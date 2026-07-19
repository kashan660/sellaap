import { cjGet } from './client';

export interface CjCatalogProduct {
  pid: string;
  name: string;
  sku: string;
  image: string;
  sellPrice: number;
  weight: number;
  categoryName: string | null;
}

export interface CjVariant {
  vid: string;
  pid: string;
  name: string;
  sku: string;
  image: string;
  sellPrice: number;
  weight: number;
}

// countryCode=US restricts results to products CJ can actually ship to the US,
// which is the only market this store fulfills to.
export async function searchCjProducts(keyword: string, pageNum = 1, pageSize = 20): Promise<CjCatalogProduct[]> {
  const payload = await cjGet('/product/list', {
    productNameEn: keyword,
    pageNum,
    pageSize,
    countryCode: 'US',
  });

  const list = payload?.data?.list ?? [];
  return list.map((item: any) => ({
    pid: String(item.pid),
    name: item.productNameEn,
    sku: item.productSku,
    image: item.productImage,
    sellPrice: Number(item.sellPrice ?? 0),
    weight: Number(item.productWeight ?? 0),
    categoryName: item.categoryName ?? null,
  }));
}

export async function getCjVariants(pid: string): Promise<CjVariant[]> {
  const payload = await cjGet('/product/variant/query', { pid });
  const variants = payload?.data ?? [];

  // Single-variant products sometimes have an empty variantNameEn - fall back
  // to the parent product's name rather than importing something nameless.
  let fallbackName: string | undefined;
  if (variants.some((v: any) => !v.variantNameEn)) {
    const detail = await cjGet('/product/query', { pid }).catch(() => null);
    fallbackName = detail?.data?.productNameEn;
  }

  return variants.map((v: any) => ({
    vid: String(v.vid),
    pid: String(v.pid),
    name: v.variantNameEn || fallbackName || `CJ product ${v.variantSku}`,
    sku: v.variantSku,
    image: v.variantImage,
    sellPrice: Number(v.variantSellPrice ?? 0),
    weight: Number(v.variantWeight ?? 0),
  }));
}

// Full image gallery for a product (shared across its variants) - the
// variant-level `image` field is only ever a single photo.
export async function getCjProductImages(pid: string): Promise<string[]> {
  const payload = await cjGet('/product/query', { pid });
  const images = payload?.data?.productImageSet ?? [];
  return images.filter((url: unknown): url is string => typeof url === 'string' && url.length > 0);
}

// Real per-warehouse stock - separate from product/list's "listedNum", which is
// just how many storefronts have listed the product, not inventory.
export async function getCjVariantStock(vid: string): Promise<number> {
  const warehouses = await getCjVariantWarehouses(vid);
  return warehouses.reduce((sum, w) => sum + w.totalInventoryNum, 0);
}

export interface CjWarehouseStock {
  countryCode: string;
  totalInventoryNum: number;
}

async function getCjVariantWarehouses(vid: string): Promise<CjWarehouseStock[]> {
  const payload = await cjGet('/product/stock/queryByVid', { vid });
  const warehouses = payload?.data ?? [];
  return warehouses.map((w: any) => ({
    countryCode: w.countryCode,
    totalInventoryNum: Number(w.totalInventoryNum ?? 0),
  }));
}

// Which warehouse to ship a variant from - needed as `fromCountryCode` when
// creating a CJ order. Picks the warehouse with the most stock.
export async function getCjVariantFromCountry(vid: string): Promise<string> {
  const warehouses = await getCjVariantWarehouses(vid);
  const best = warehouses.sort((a, b) => b.totalInventoryNum - a.totalInventoryNum)[0];
  if (!best) throw new Error(`No warehouse stock found for variant ${vid}`);
  return best.countryCode;
}
