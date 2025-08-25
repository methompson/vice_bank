import { isNumber, typeGuardGenerator } from '@metools/tcheck';

import {
  ViceBankUser,
  type ViceBankUserJSON,
} from '@vice_bank/models/vice_bank_user';
import { getAuthToken, getBaseUrl } from '@/utils/auth';
import type { VBUserTokens } from '@/utils/vb_user_types';
import { NotFoundError } from '@/utils/errors';

interface GetVBUserResponse {
  user: ViceBankUserJSON;
  currentTokens: number;
}

const isGetVBUserResponse = typeGuardGenerator<GetVBUserResponse>({
  user: ViceBankUser.isViceBankUserJSON,
  currentTokens: isNumber,
});

export async function getVBUser(vbUserId: string): Promise<VBUserTokens> {
  const url = `${getBaseUrl()}/vice_bank/user?userId=${vbUserId}`;

  const headers = new Headers();
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.log('response', response);
    if (response.status === 404) {
      console.log('throw not found error');
      throw new NotFoundError();
    }
    console.error('Error fetching user:', dat);
    throw new Error(`Error fetching user`);
  }

  if (!isGetVBUserResponse(dat)) {
    throw new Error('Invalid response from server');
  }

  return {
    user: new ViceBankUser(dat.user),
    currentTokens: dat.currentTokens,
  };
}

interface AddVBUserPayload {
  name: string;
}
export async function addVBUser(
  payload: AddVBUserPayload,
): Promise<ViceBankUser> {
  const url = `${getBaseUrl()}/vice_bank/addUser`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      userToAdd: payload,
    }),
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error adding user:', dat);
    throw new Error(`Error adding user`);
  }

  if (!ViceBankUser.isViceBankUserJSON(dat.user)) {
    throw new Error('Invalid response from server');
  }

  return new ViceBankUser(dat.user);
}

export async function updateVBUser(
  updatedUser: ViceBankUser,
): Promise<ViceBankUser> {
  const url = `${getBaseUrl()}/vice_bank/updateUser`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ vbUser: updatedUser.toJSON() }),
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error updating user:', dat);
    throw new Error(`Error updating user`);
  }
  if (!ViceBankUser.isViceBankUserJSON(dat.user)) {
    throw new Error('Invalid response from server');
  }
  return new ViceBankUser(dat.user);
}

export async function deleteVBUser(vbUserId: string): Promise<ViceBankUser> {
  const url = `${getBaseUrl()}/vice_bank/deleteUser`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ vbUserId }),
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error deleting user:', dat);
    throw new Error(`Error deleting user`);
  }

  if (!ViceBankUser.isViceBankUserJSON(dat.user)) {
    throw new Error('Invalid response from server');
  }

  return new ViceBankUser(dat.user);
}

export async function getUserTokens(vbUserId: string) {
  const url = `${getBaseUrl()}/vice_bank/userTokens?userId=${vbUserId}`;

  const headers = new Headers();
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error fetching user:', dat);
    throw new Error(`Error fetching user`);
  }

  const tokens = dat.tokens;

  if (!isNumber(tokens)) {
    throw new Error('Invalid response from server');
  }

  return tokens;
}
