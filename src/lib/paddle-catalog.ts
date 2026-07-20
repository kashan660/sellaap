'use server';

import { prisma } from '@/lib/prisma';
import { getPaddleApiBaseUrl } from '@/lib/paddle-api';

type ProductForSync = {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
};

type PaddleMapRow = {
  id: number;
  productId: number;
  paddleProductId: string;
  paddlePriceId: string;
};

async function paddleFetch(path: string, payload: Record<string, unknown>) {
  const paddleApiKey = process.env.PADDLE_API_KEY;
  if (!paddleApiKey) {
    throw new Error('Paddle is not configured (missing PADDLE_API_KEY).');
  }

  const response = await fetch(`${getPaddleApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${paddleApiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.error?.detail || data?.error?.message || 'Paddle API request failed';
    throw new Error(detail);
  }
  return data;
}

export async function ensurePaddleProductMapTable() {
  // MySQL/MariaDB syntax only - this project's datasource is MySQL
  // (see prisma/schema.prisma), there's no Postgres/SQLite deployment target.
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS \`PaddleProductMap\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`productId\` INT NOT NULL UNIQUE,
      \`paddleProductId\` VARCHAR(191) NOT NULL,
      \`paddlePriceId\` VARCHAR(191) NOT NULL,
      \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function getPaddleMapByProductId(productId: number): Promise<PaddleMapRow | null> {
  await ensurePaddleProductMapTable();
  const rows = await prisma.$queryRaw<PaddleMapRow[]>`
    SELECT id, productId, paddleProductId, paddlePriceId
    FROM \`PaddleProductMap\`
    WHERE productId = ${productId}
    LIMIT 1
  `;
  return rows[0] || null;
}

async function upsertPaddleMap(productId: number, paddleProductId: string, paddlePriceId: string) {
  await ensurePaddleProductMapTable();
  await prisma.$executeRaw`
    INSERT INTO \`PaddleProductMap\` (productId, paddleProductId, paddlePriceId, updatedAt)
    VALUES (${productId}, ${paddleProductId}, ${paddlePriceId}, CURRENT_TIMESTAMP)
    ON DUPLICATE KEY UPDATE
      paddleProductId = VALUES(paddleProductId),
      paddlePriceId = VALUES(paddlePriceId),
      updatedAt = CURRENT_TIMESTAMP
  `;
}

async function createPaddlePrice(paddleProductId: string, product: ProductForSync) {
  const amount = String(Math.round(product.price * 100));
  const payload = await paddleFetch('/prices', {
    product_id: paddleProductId,
    name: `${product.name} Price`,
    description: `Auto-synced price for ${product.name}`,
    unit_price: {
      amount,
      currency_code: product.currency || 'USD',
    },
  });

  const priceId = payload?.data?.id as string | undefined;
  if (!priceId) throw new Error('Paddle price creation returned no ID.');
  return priceId;
}

export async function syncProductToPaddleCatalog(product: ProductForSync) {
  const existingMap = await getPaddleMapByProductId(product.id);

  let paddleProductId = existingMap?.paddleProductId;
  if (!paddleProductId) {
    const productPayload = await paddleFetch('/products', {
      name: product.name,
      description: product.description.slice(0, 255),
      tax_category: 'standard',
    });
    paddleProductId = productPayload?.data?.id as string | undefined;
    if (!paddleProductId) throw new Error('Paddle product creation returned no ID.');
  } else {
    await fetch(`${getPaddleApiBaseUrl()}/products/${paddleProductId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      },
      body: JSON.stringify({
        name: product.name,
        description: product.description.slice(0, 255),
        tax_category: 'standard',
      }),
    }).catch(() => null);
  }

  const paddlePriceId = await createPaddlePrice(paddleProductId, product);
  await upsertPaddleMap(product.id, paddleProductId, paddlePriceId);

  return { paddleProductId, paddlePriceId };
}
