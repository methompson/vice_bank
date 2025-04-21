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
