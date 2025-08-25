import { isArrayOfGenerator } from '@metools/tcheck';

import { Purchase, type PurchaseJSON } from '@vice_bank/models/purchase';
import { getAuthToken, getBaseUrl } from '@/utils/auth';

const isPurchasesJSONArray = isArrayOfGenerator<PurchaseJSON>(
  Purchase.isPurchaseJSON,
);

export async function getPurchases(vbUserId: string) {
  const url = `${getBaseUrl()}/vice_bank/purchases?vbUserId=${vbUserId}`;

  const headers = new Headers();
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error getting purchases:', dat);
    throw new Error(`Error getting purchases`);
  }

  const purchases = dat.purchases;
  if (!isPurchasesJSONArray(purchases)) {
    const test = Purchase.purchaseJSONTest(dat);
    throw new Error(`Invalid response from server: ${test.join(', ')}`);
  }

  return purchases.map((r) => new Purchase(r));
}

export async function addPurchase(purchase: Purchase) {
  const url = `${getBaseUrl()}/vice_bank/addPurchase`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const body = JSON.stringify({
    purchase: {
      vbUserId: purchase.vbUserId,
      date: purchase.date.toISO(),
      purchasedQuantity: purchase.purchasedQuantity,
      reward: purchase.reward.toJSON(),
    },
  });

  const response = await fetch(url, {
    method: 'POST',
    body,
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error getting purchases:', dat);
    throw new Error(`Error getting purchases`);
  }

  if (!Purchase.isPurchaseJSON(dat.purchase)) {
    const test = Purchase.purchaseJSONTest(dat.purchase);
    throw new Error(`Invalid response from server: ${test.join(', ')}`);
  }

  return new Purchase(dat.purchase);
}

export async function updatePurchase(purchase: Purchase) {
  const url = `${getBaseUrl()}/vice_bank/updatePurchase`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const body = JSON.stringify({
    purchase: purchase.toJSON(),
  });

  const response = await fetch(url, {
    method: 'POST',
    body,
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error getting purchases:', dat);
    throw new Error(`Error getting purchases`);
  }

  if (!Purchase.isPurchaseJSON(dat.purchase)) {
    const test = Purchase.purchaseJSONTest(dat.purchase);
    throw new Error(`Invalid response from server: ${test.join(', ')}`);
  }

  return new Purchase(dat.purchase);
}

export async function deletePurchase(purchaseId: string) {
  const url = `${getBaseUrl()}/vice_bank/deletePurchase`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const body = JSON.stringify({
    purchaseId,
  });

  const response = await fetch(url, {
    method: 'POST',
    body,
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error getting purchases:', dat);
    throw new Error(`Error getting purchases`);
  }

  return dat;
}
