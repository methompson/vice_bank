import { getAuthToken, getBaseUrl } from './common';

export async function getVBUsers() {
  const url = `${getBaseUrl()}/vice_bank/users`;

  const headers = new Headers();
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    headers,
  });

  const dat = await response.json();
}

export async function addVBUser() {}

export async function updateVBUser() {}

export async function deleteVBUser() {}
