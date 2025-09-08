import { defineStore } from 'pinia';
import { DateTime } from 'luxon';

import { LoggedEvent, LogLevel } from '@/models/logger_types';
import {
  addLogToDB,
  deleteDB,
  deleteOldLogs,
  readLogsFromDB,
} from '@/stores/logger_db_connection';

interface AddLogOptions {
  timestamp?: DateTime<true>;
}

export const useLoggerStore = defineStore('loggerStore', () => {
  /**
   * Keep only so many logs to avoid hitting a browser quota
   * Unlikely to be reached, but nice to have.
   */
  async function trimLogs() {
    await deleteOldLogs();
  }

  async function getRecentLogs() {
    return await readLogsFromDB();
  }

  /**
   * Base function for adding logs. Should not be exposed as an
   * exported function. "Helper" functions like addErrorLog should
   * call this function.
   */
  async function addLog(log: LoggedEvent) {
    await addLogToDB(log);
  }

  async function addInfoLog(msg: string, options?: AddLogOptions) {
    const log = new LoggedEvent({
      id: crypto.randomUUID(),
      level: LogLevel.Info,
      message: msg,
      timestamp: options?.timestamp?.toISO() ?? DateTime.now().toISO(),
    });
    return addLog(log);
  }

  async function addWarningLog(msg: string, options?: AddLogOptions) {
    const log = new LoggedEvent({
      id: crypto.randomUUID(),
      level: LogLevel.Warning,
      message: msg,
      timestamp: options?.timestamp?.toISO() ?? DateTime.now().toISO(),
    });
    return addLog(log);
  }

  async function addErrorLog(msg: string, options?: AddLogOptions) {
    const log = new LoggedEvent({
      id: crypto.randomUUID(),
      level: LogLevel.Error,
      message: msg,
      timestamp: options?.timestamp?.toISO() ?? DateTime.now().toISO(),
    });
    return addLog(log);
  }

  async function clearLogs() {
    await deleteDB();
  }

  return {
    addInfoLog,
    addWarningLog,
    addErrorLog,
    clearLogs,
    trimLogs,
    getRecentLogs,
  };
});
