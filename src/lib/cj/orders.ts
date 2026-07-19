import { cjPost } from './client';
import { getCjVariantFromCountry } from './catalog';

export interface CjShippingInfo {
  name: string;
  phone: string;
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
}

export interface CjOrderLineItem {
  vid: string;
  quantity: number;
}

// Verified 2026-07-19 against a real (unpaid) test order - createOrderV2 needs
// both shippingCountryCode (ISO) and shippingCountry (full name, we're US-only
// so this is always "United States"), plus fromCountryCode (which CJ warehouse
// ships it) and logisticName (a specific carrier string from freightCalculate,
// not something you can pick arbitrarily).
async function getLogisticName(fromCountryCode: string, toCountryCode: string, items: CjOrderLineItem[]) {
  const payload = await cjPost('/logistic/freightCalculate', {
    startCountryCode: fromCountryCode,
    endCountryCode: toCountryCode,
    products: items.map((item) => ({ vid: item.vid, quantity: item.quantity })),
  });
  const options = payload?.data ?? [];
  const option = options[0];
  if (!option?.logisticName) {
    throw new Error(`No shipping method available from ${fromCountryCode} to ${toCountryCode}`);
  }
  return option.logisticName as string;
}

// CJ_SHOP_ID identifies which connected "API" store (from shop/getShops) this
// order belongs to - required since this CJ account has more than one API
// store connected, so CJ can't auto-match a single default one.
//
// NOTE: this only calls createOrderV2 (no cost yet). Paying via payBalanceV2 -
// which actually spends account balance and triggers the real shipment - is a
// separate, deliberate step (see fulfillOrderWithCj/retryCjFulfillment).
export async function createCjOrder(orderNumber: string, shipping: CjShippingInfo, items: CjOrderLineItem[]) {
  const shopId = process.env.CJ_SHOP_ID;
  if (!shopId) throw new Error('CJ_SHOP_ID is not configured');
  if (items.length === 0) throw new Error('No CJ items to order');

  // All items ship together from one warehouse/carrier - assumes a single
  // order doesn't mix variants stocked in different countries.
  const fromCountryCode = await getCjVariantFromCountry(items[0].vid);
  const logisticName = await getLogisticName(fromCountryCode, shipping.countryCode, items);

  const created = await cjPost('/shopping/order/createOrderV2', {
    orderNumber,
    shopId,
    fromCountryCode,
    logisticName,
    shippingCountryCode: shipping.countryCode,
    shippingCountry: 'United States',
    shippingProvince: shipping.state,
    shippingCity: shipping.city,
    shippingAddress: shipping.address2 ? `${shipping.address1}, ${shipping.address2}` : shipping.address1,
    shippingCustomerName: shipping.name,
    shippingZip: shipping.postalCode,
    shippingPhone: shipping.phone,
    products: items.map((item) => ({ vid: item.vid, quantity: item.quantity })),
  });

  const cjOrderId = created?.data?.orderId ?? created?.data?.orderCode;
  if (!cjOrderId) {
    throw new Error('CJ Dropshipping did not return an order id');
  }

  return { cjOrderId: String(cjOrderId) };
}

// Pays for a previously-created (createCjOrder) order from the CJ account's
// balance - this is what actually spends money and triggers the shipment.
export async function payCjOrder(cjOrderId: string) {
  await cjPost('/shopping/order/payBalanceV2', { orderId: cjOrderId });
}

export async function getCjOrderTracking(cjOrderId: string) {
  const payload = await cjPost('/shopping/order/getOrderDetail', { orderId: cjOrderId });
  const data = payload?.data;
  return {
    status: data?.orderStatus ?? null,
    trackingNumber: data?.trackNumber ?? null,
    trackingCarrier: data?.logisticName ?? null,
  };
}
