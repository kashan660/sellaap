// Diagnose + manually run Paddle catalog sync for a given product ID,
// mirroring src/lib/paddle-catalog.ts#syncProductToPaddleCatalog.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PADDLE_API_BASE =
  (process.env.PADDLE_ENV || "sandbox").toLowerCase() === "live"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";

async function paddleFetch(path, payload) {
  const paddleApiKey = process.env.PADDLE_API_KEY;
  if (!paddleApiKey) throw new Error("Paddle is not configured (missing PADDLE_API_KEY).");

  const response = await fetch(`${PADDLE_API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${paddleApiKey}` },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.error?.detail || data?.error?.message || "Paddle API request failed";
    throw new Error(`${detail} (status ${response.status})`);
  }
  return data;
}

async function getPaddleMapByProductId(productId) {
  const rows = await prisma.$queryRawUnsafe(
    "SELECT id, productId, paddleProductId, paddlePriceId FROM `PaddleProductMap` WHERE productId = ? LIMIT 1",
    productId
  );
  return rows[0] || null;
}

async function upsertPaddleMap(productId, paddleProductId, paddlePriceId) {
  await prisma.$executeRawUnsafe(
    "INSERT INTO `PaddleProductMap` (productId, paddleProductId, paddlePriceId, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE paddleProductId = VALUES(paddleProductId), paddlePriceId = VALUES(paddlePriceId), updatedAt = CURRENT_TIMESTAMP",
    productId, paddleProductId, paddlePriceId
  );
}

async function syncProduct(product) {
  const existingMap = await getPaddleMapByProductId(product.id);
  let paddleProductId = existingMap?.paddleProductId;

  if (!paddleProductId) {
    const productPayload = await paddleFetch("/products", {
      name: product.name,
      description: product.description.slice(0, 255),
      tax_category: "standard",
    });
    paddleProductId = productPayload?.data?.id;
    if (!paddleProductId) throw new Error("Paddle product creation returned no ID.");
  }

  const amount = String(Math.round(product.price * 100));
  const pricePayload = await paddleFetch("/prices", {
    product_id: paddleProductId,
    name: `${product.name} Price`,
    description: `Auto-synced price for ${product.name}`,
    unit_price: { amount, currency_code: product.currency || "USD" },
  });
  const paddlePriceId = pricePayload?.data?.id;
  if (!paddlePriceId) throw new Error("Paddle price creation returned no ID.");

  await upsertPaddleMap(product.id, paddleProductId, paddlePriceId);
  return { paddleProductId, paddlePriceId };
}

async function main() {
  const productId = Number(process.argv[2]);
  if (!productId) throw new Error("Usage: node sync-paddle-product.js <productId>");

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, description: true, price: true, currency: true },
  });
  if (!product) throw new Error(`Product ${productId} not found`);

  console.log("Syncing:", product.name);
  const result = await syncProduct(product);
  console.log("Synced OK:", result);
}

main()
  .catch((e) => {
    console.error("FAILED:", e.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
