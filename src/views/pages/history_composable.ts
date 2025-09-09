import { useViceBankStore } from '@/stores/vice_bank_store';
import { DateTime } from 'luxon';

export function useHistoryComposable() {
  function makeFriendlyYear(year: string) {
    const dt = DateTime.fromISO(year);

    return dt.toLocaleString(DateTime.DATE_MED);
  }

  return {
    makeFriendlyYear,
  };
}

export async function fetchActionAndTaskData(vbUserId: string) {
  const vbStore = useViceBankStore();

  await Promise.all([
    vbStore.getActions(vbUserId),
    vbStore.getTasks(vbUserId),
    vbStore.getActionDeposits(vbUserId),
    vbStore.getTaskDeposits(vbUserId),
  ]);
}

export async function fetchPurchaseData(vbUserId: string) {
  const vbStore = useViceBankStore();

  await Promise.all([
    vbStore.getRewards(vbUserId),
    vbStore.getPurchases(vbUserId),
  ]);
}
