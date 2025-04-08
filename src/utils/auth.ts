import { getAuth } from 'firebase/auth';

export function getBaseUrl() {
  return import.meta.env.VITE_SERVER_BASE_API_URL ?? '';
}

export async function getAuthToken() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user === null) {
    throw new Error('No user logged in');
  }

  const token = await user.getIdToken();

  return token;
}

export function getUserId() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user === null) {
    throw new Error('No user logged in');
  }

  return user.uid;
}
