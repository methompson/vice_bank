import { isArrayOfGenerator, typeGuardGenerator } from 'tcheck';

import {
  ViceBankUser,
  type ViceBankUserJSON,
} from '@vice_bank/models/vice_bank_user';
import { getAuthToken, getBaseUrl } from '../utils/auth';

interface GetVBUsersResponse {
  users: ViceBankUserJSON[];
}

const isGetVBUsersResponse = typeGuardGenerator<GetVBUsersResponse>({
  users: isArrayOfGenerator(ViceBankUser.isViceBankUserJSON),
});

export async function getVBUsers(): Promise<ViceBankUser[]> {
  const url = `${getBaseUrl()}/vice_bank/users`;

  const headers = new Headers();
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error fetching users:', dat);
    throw new Error(`Error fetching users`);
  }

  if (!isGetVBUsersResponse(dat)) {
    throw new Error('Invalid response from server');
  }

  console.log('data', dat);

  return dat.users.map((user) => new ViceBankUser(user));
}

interface AddVBUserPayload {
  name: string;
  currentTokens: number;
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
