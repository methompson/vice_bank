import { useAppStore } from '@/stores/app_store';

export function useAuthComposable() {
  const appStore = useAppStore();

  async function logout() {
    try {
      await appStore.logout();
    } catch (e) {
      console.error('Logout failed', e);
      appStore.setErrorMessage({
        message: 'Logout failed',
      });
    }
  }

  return {
    logout,
  };
}
