// Proactively sync every product that doesn't yet have a Paddle catalog
// mapping, so customers stop hitting "Missing Paddle sync for product ID: N"
// at checkout one product at a time. Mirrors syncProductToPaddleCatalog in
// src/lib/paddle-catalog.ts, including the price-name truncation fix.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PADDLE_API_BASE =
  (process.env.PADDLE_ENV || "sandbox").toLowerCase() === "live"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";
const PADDLE_PRICE_NAME_MAX = 150;
const REQUEST_DELAY_MS = 700;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function paddleFetch(path, payload) {
  const paddleApiKey = process.env.PADDLE_API_KEY;
  if (!paddleApiKey) throw new Error("Paddle is not configured (missing PADDLE_API_KEY).");
  await sleep(REQUEST_DELAY_MS);
  const response = await fetch(`${PADDLE_API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${paddleApiKey}` },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.error?.detail || data?.error?.message || "Paddle API request failed";
    const fieldErrors = (data?.error?.errors || []).map((e) => `${e.field}: ${e.message}`).join("; ");
    throw new Error(fieldErrors ? `${detail} (${fieldErrors})` : detail);
  }
  return data;
}

async function upsertPaddleMap(productId, paddleProductId, paddlePriceId) {
  await prisma.$executeRawUnsafe(
    "INSERT INTO `PaddleProductMap` (productId, paddleProductId, paddlePriceId, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE paddleProductId = VALUES(paddleProductId), paddlePriceId = VALUES(paddlePriceId), updatedAt = CURRENT_TIMESTAMP",
    productId, paddleProductId, paddlePriceId
  );
}

async function syncProduct(product) {
  const productPayload = await paddleFetch("/products", {
    name: product.name,
    description: product.description.slice(0, 255),
    tax_category: "standard",
  });
  const paddleProductId = productPayload?.data?.id;
  if (!paddleProductId) throw new Error("Paddle product creation returned no ID.");

  const amount = String(Math.round(product.price * 100));
  const pricePayload = await paddleFetch("/prices", {
    product_id: paddleProductId,
    name: `${product.name} Price`.slice(0, PADDLE_PRICE_NAME_MAX),
    description: `Auto-synced price for ${product.name}`.slice(0, 250),
    unit_price: { amount, currency_code: product.currency || "USD" },
  });
  const paddlePriceId = pricePayload?.data?.id;
  if (!paddlePriceId) throw new Error("Paddle price creation returned no ID.");

  await upsertPaddleMap(product.id, paddleProductId, paddlePriceId);
  return { paddleProductId, paddlePriceId };
}

async function main() {
  const mappedRows = await prisma.$queryRawUnsafe("SELECT productId FROM `PaddleProductMap`");
  const mappedIds = new Set(mappedRows.map((r) => r.productId));

  const products = await prisma.product.findMany({
    where: { id: { notIn: [...mappedIds] } },
    select: { id: true, name: true, description: true, price: true, currency: true },
    orderBy: { id: "asc" },
  });

  console.log(`Syncing ${products.length} unmapped products to Paddle...`);
  let synced = 0;
  let failed = 0;

  for (const product of products) {
    try {
      await syncProduct(product);
      synced++;
      console.log(`[ok] ${product.id} ${product.name.slice(0, 60)}`);
    } catch (error) {
      failed++;
      console.error(`[fail] ${product.id} ${product.name.slice(0, 60)} - ${error.message}`);
    }
  }

  console.log("\n=== Paddle sync summary ===");
  console.log({ synced, failed, total: products.length });
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
