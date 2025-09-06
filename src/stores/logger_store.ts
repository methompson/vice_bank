import { defineStore } from 'pinia';

export const useLoggerStore = defineStore('loggerStore', () => {
  let db: IDBDatabase | undefined = undefined;

  /**
   * Initialize the IndexedDB database and object store
   */
  async function initialize() {
    const result = window.indexedDB.open('myDatabase', 1);
    result.onsuccess = (ev) => {
      db = result.result;
    };
  }

  /**
   * Stringifies the logs object and saves it to local storage
   * Checks the total amount of logs that exist. If there are
   * too many logs, it will call the trimLogs function, then
   * re-run the saveLogsToLocalStorage function
   */
  function saveLogsToLocalStorage() {}

  /**
   * Keep only so many logs to avoid hitting a browser quota
   * Unlikely to be reached, but nice to have.
   */
  function trimLogs() {}

  /**
   * Base function for adding logs. Should not be exposed as an
   * exported function. "Helper" functions like addErrorLog should
   * call this function.
   */
  function addLog() {}
  function addInfoLog() {}
  function addWarningLog() {}
  function addErrorLog() {}
  function clearLogs() {}

  return {};
});
