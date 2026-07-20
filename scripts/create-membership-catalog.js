// One-off: create the Sellaap+ membership catalog in Paddle (3 products,
// each with a monthly and yearly recurring price). Run once; re-running is
// safe-ish but will create duplicate Paddle products since there's no
// dedupe-by-name check here (this is meant to run exactly once).
require("@prisma/client");

const PADDLE_API_BASE =
  (process.env.PADDLE_ENV || "sandbox").toLowerCase() === "live"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";

async function paddleFetch(path, payload) {
  const res = await fetch(`${PADDLE_API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.PADDLE_API_KEY}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error?.detail || `Paddle request failed: ${path} (${res.status})`);
  }
  return data;
}

const TIERS = [
  {
    key: "starter",
    name: "Sellaap+ Starter",
    description: "5% off every order at Sellaap.",
    monthPrice: 499,
    yearPrice: 4990,
  },
  {
    key: "pro",
    name: "Sellaap+ Pro",
    description: "10% off every order at Sellaap.",
    monthPrice: 999,
    yearPrice: 9990,
  },
  {
    key: "advanced",
    name: "Sellaap+ Advanced",
    description: "15% off every order at Sellaap.",
    monthPrice: 1999,
    yearPrice: 19990,
  },
];

async function main() {
  const results = {};

  for (const tier of TIERS) {
    console.log(`Creating product: ${tier.name}`);
    const productPayload = await paddleFetch("/products", {
      name: tier.name,
      description: tier.description,
      tax_category: "standard",
    });
    const productId = productPayload.data.id;

    const monthPayload = await paddleFetch("/prices", {
      product_id: productId,
      name: `${tier.name} - Monthly`,
      description: `${tier.name} monthly subscription`,
      billing_cycle: { interval: "month", frequency: 1 },
      unit_price: { amount: String(tier.monthPrice), currency_code: "USD" },
    });

    const yearPayload = await paddleFetch("/prices", {
      product_id: productId,
      name: `${tier.name} - Yearly`,
      description: `${tier.name} yearly subscription`,
      billing_cycle: { interval: "year", frequency: 1 },
      unit_price: { amount: String(tier.yearPrice), currency_code: "USD" },
    });

    results[tier.key] = {
      productId,
      month: monthPayload.data.id,
      year: yearPayload.data.id,
    };
    console.log(`  product=${productId} month=${monthPayload.data.id} year=${yearPayload.data.id}`);
  }

  console.log("\n=== Copy this into lib/membership/tiers.ts ===");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exitCode = 1;
});
