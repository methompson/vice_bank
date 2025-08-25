import { isArrayOfGenerator } from '@metools/tcheck';

import { Action, type ActionJSON } from '@vice_bank/models/action';
import { getAuthToken, getBaseUrl } from '@/utils/auth';

const isActionJSONArray = isArrayOfGenerator<ActionJSON>(Action.isActionJSON);

export async function getActions(vbUserId: string): Promise<Action[]> {
  const url = `${getBaseUrl()}/vice_bank/actions?vbUserId=${vbUserId}`;

  const headers = new Headers();
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error getting users:', dat);
    throw new Error(`Error getting users`);
  }

  const actions = dat.actions;

  if (!isActionJSONArray(actions)) {
    throw new Error('Invalid response from server');
  }

  return actions.map((action) => new Action(action));
}

export async function addAction(action: Action): Promise<Action> {
  const url = `${getBaseUrl()}/vice_bank/addAction`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const body = JSON.stringify({
    action: {
      vbUserId: action.vbUserId,
      name: action.name,
      conversionUnit: action.conversionUnit,
      inputQuantity: action.inputQuantity,
      tokensEarnedPerInput: action.tokensEarnedPerInput,
      minDeposit: action.minDeposit,
      maxDeposit: action.maxDeposit,
    },
  });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error adding action:', dat);
    throw new Error(`Error adding action`);
  }

  if (!Action.isActionJSON(dat.action)) {
    const test = Action.actionJSONTest(dat.action);
    console.error(`Invalid response from server: ${test.join(',')}`, dat);
    throw new Error('Invalid response from server');
  }

  return new Action(dat.action);
}

export async function updateAction(action: Action): Promise<Action> {
  const url = `${getBaseUrl()}/vice_bank/updateAction`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action: action.toJSON() }),
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error adding action:', dat);
    throw new Error(`Error adding action`);
  }

  if (!Action.isActionJSON(dat.action)) {
    throw new Error('Invalid response from server');
  }
  return new Action(dat.action);
}

export async function deleteAction(actionId: string): Promise<Action> {
  const url = `${getBaseUrl()}/vice_bank/deleteAction`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ actionId }),
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error deleting action:', dat);
    throw new Error(`Error deleting action`);
  }
  if (!Action.isActionJSON(dat.action)) {
    throw new Error('Invalid response from server');
  }

  return new Action(dat.action);
}
