import { isArrayOfGenerator } from 'tcheck';

import {
  ActionDeposit,
  type ActionDepositJSON,
} from '@vice_bank/models/action_deposit';

import { getAuthToken, getBaseUrl } from '@/utils/auth';

const isActionDepositJSONArray = isArrayOfGenerator<ActionDepositJSON>(
  ActionDeposit.isActionDepositJSON,
);

export async function getActionDeposits(
  vbUserId: string,
): Promise<ActionDeposit[]> {
  const url = `${getBaseUrl()}/vice_bank/actionDeposits?vbUserId=${vbUserId}`;

  const headers = new Headers();
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error getting action deposits:', dat);
    throw new Error(`Error getting action deposits`);
  }

  const actionDeposits = dat.actionDeposits;

  if (!isActionDepositJSONArray(actionDeposits)) {
    throw new Error('Invalid response from server');
  }

  return actionDeposits.map(
    (actionDeposit) => new ActionDeposit(actionDeposit),
  );
}

export async function addActionDeposit(
  deposit: ActionDeposit,
): Promise<ActionDeposit> {
  const url = `${getBaseUrl()}/vice_bank/addActionDeposit`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const body = JSON.stringify({
    actionDeposit: {
      vbUserId: deposit.vbUserId,
      date: deposit.date.toISO(),
      depositQuantity: deposit.depositQuantity,
      action: deposit.action.toJSON(),
    },
  });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error adding action deposit:', dat);
    throw new Error(`Error adding action deposit`);
  }

  if (!ActionDeposit.isActionDepositJSON(dat.actionDeposit)) {
    const test = ActionDeposit.actionDepositJSONTest(dat.actionDeposit);
    console.error(`Invalid response from server: ${test.join(',')}`, dat);
    throw new Error('Invalid response from server');
  }

  return new ActionDeposit(dat.actionDeposit);
}

export async function updateActionDeposit(
  deposit: ActionDeposit,
): Promise<ActionDeposit> {
  const url = `${getBaseUrl()}/vice_bank/updateActionDeposit`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const body = JSON.stringify({
    actionDeposit: deposit.toJSON(),
  });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error updating action deposit:', dat);
    throw new Error(`Error updating action deposit`);
  }

  if (!ActionDeposit.isActionDepositJSON(dat.actionDeposit)) {
    const test = ActionDeposit.actionDepositJSONTest(dat.actionDeposit);
    console.error(`Invalid response from server: ${test.join(',')}`, dat);
    throw new Error('Invalid response from server');
  }

  return new ActionDeposit(dat.actionDeposit);
}

export async function deleteActionDeposit(
  actionDepositId: string,
): Promise<ActionDeposit> {
  const url = `${getBaseUrl()}/vice_bank/deleteActionDeposit`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const body = JSON.stringify({
    actionDepositId,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error deleting action deposit:', dat);
    throw new Error(`Error deleting action deposit`);
  }

  if (!ActionDeposit.isActionDepositJSON(dat.actionDeposit)) {
    const test = ActionDeposit.actionDepositJSONTest(dat.actionDeposit);
    console.error(`Invalid response from server: ${test.join(',')}`, dat);
    throw new Error('Invalid response from server');
  }

  return new ActionDeposit(dat.actionDeposit);
}
