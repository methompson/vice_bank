import { LoggedEvent } from '@/models/logger_types';
import { DateTime } from 'luxon';

const loggingDBName = 'loggingDB';
const loggingStore = 'loggingStore';
const dbIndex = 'dbIndex';

function getDBFromEvent(ev: Event): IDBDatabase {
  const target = ev.target;
  if (!(target instanceof IDBOpenDBRequest)) {
    throw new Error('Invalid database');
  }
  const db = target.result;

  return db;
}

export async function connectToDB(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(loggingDBName, 1);
    request.onsuccess = (ev) => {
      try {
        const db = getDBFromEvent(ev);
        resolve(db);
      } catch (e) {
        reject(e);
      }
    };
    request.onerror = (ev) => {
      console.error('Failed to open database', ev);
      const msg = request.error?.message ?? 'Unknown error';
      reject(new Error(`Failed to open database ${msg}`));
    };
    request.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
      console.log('Upgrading database');
      let db;
      try {
        db = getDBFromEvent(ev);
        // resolve(db);
      } catch (e) {
        reject(e);
        return;
      }

      // Sortable by timestamp with an id to make things unique
      db.createObjectStore(loggingStore, {
        keyPath: dbIndex,
      });
      console.log('Created object store');
    };
  });
}

export async function addLogToDB(log: LoggedEvent) {
  const db = await connectToDB();
  const tx = db.transaction([loggingStore], 'readwrite');

  return new Promise<void>((res, rej) => {
    tx.oncomplete = () => {
      res();
    };
    tx.onerror = (ev) => {
      console.error('Transaction failed', ev);

      const msg = tx.error?.message ?? 'Unknown error';
      rej(new Error(`Failed to add log to database ${msg}`));
    };

    const oStore = tx.objectStore(loggingStore);
    oStore.add(log.toIDBJSON());
  }).finally(() => {
    db.close();
  });
}

/**
 * Reads logs in the DB from the start of the previous month
 * to now in reverse chronological order.
 */
export async function readLogsFromDB(): Promise<LoggedEvent[]> {
  const db = await connectToDB();

  const lastMonth = DateTime.now().minus({ months: 1 }).startOf('month');
  const keyRange = IDBKeyRange.lowerBound(`${lastMonth.toISODate()}`);

  const logs: LoggedEvent[] = [];

  // Create a promise that resolves when the cursor is done
  // We place the db.close function in a finally block to
  // ensure it always gets called.
  await new Promise<void>((res, rej) => {
    const objectStore = db.transaction(loggingStore).objectStore(loggingStore);
    const cursor = objectStore.openCursor(keyRange, 'prev');

    cursor.onsuccess = (ev) => {
      if (
        !(ev.target instanceof IDBRequest) ||
        !(ev.target.result instanceof IDBCursorWithValue)
      ) {
        res();
        return;
      }

      const result = ev.target.result;
      try {
        logs.push(LoggedEvent.fromJSON(result.value));
      } catch (e) {
        console.error('Invalid log in database', e);
      }

      result.continue();
    };
    cursor.onerror = (ev) => {
      console.error('Cursor failed', ev);

      if (!(ev.target instanceof IDBRequest)) {
        rej(new Error('Failed to read logs from database - invalid event'));
        return;
      }

      const msg = ev.target.error?.message ?? 'Unknown error';
      rej(new Error(`Failed to read logs from database ${msg}`));

      rej();
    };
  }).finally(() => {
    console.log('Closing database after reading logs');
    db.close();
  });

  return logs;
}

export async function deleteDB() {
  return new Promise<void>((res, rej) => {
    const request = indexedDB.deleteDatabase(loggingDBName);
    request.onsuccess = () => {
      console.log('Database deleted');
      res();
    };
    request.onerror = (ev) => {
      console.error('Failed to delete database', ev);
      const msg = request.error?.message ?? 'Unknown error';
      rej(new Error(`Failed to delete database ${msg}`));
    };
    request.onblocked = (ev) => {
      console.warn('Database deletion blocked', ev);
      rej(new Error('Database deletion blocked'));
    };
  });
}

/**
 * Deletes a specific log from the database. Meant to be used
 * with deleteOldLogs.
 */
async function deleteLogFromDB(log: LoggedEvent, db?: IDBDatabase) {
  const theDb = db ?? (await connectToDB());
  return new Promise<void>((res, rej) => {
    const request = theDb
      .transaction([loggingStore], 'readwrite')
      .objectStore(loggingStore)
      .delete(log.dbIndex);

    request.onsuccess = () => {
      res();
    };
    request.onerror = () => {
      const msg = request.error?.message ?? 'Unknown error';
      rej(new Error(`Failed to delete log from database ${msg}`));
    };
  });
}

export async function deleteOldLogs() {
  const db = await connectToDB();

  const lastMonth = DateTime.now().minus({ months: 1 }).startOf('month');
  const keyRange = IDBKeyRange.lowerBound(`${lastMonth.toISODate()}`);

  const delPromises: Promise<void>[] = [];

  await new Promise<void>((res, rej) => {
    const objectStore = db.transaction(loggingStore).objectStore(loggingStore);
    const cursor = objectStore.openCursor(keyRange);

    cursor.onsuccess = (ev) => {
      if (
        !(ev.target instanceof IDBRequest) ||
        !(ev.target.result instanceof IDBCursorWithValue)
      ) {
        // No more cursors. All done getting data
        res();
        return;
      }

      const result = ev.target.result;
      try {
        const log = LoggedEvent.fromJSON(result.value);
        delPromises.push(deleteLogFromDB(log, db));
      } catch (e) {
        console.error('Invalid log in database', e);
      }

      result.continue();
    };
    cursor.onerror = (ev) => {
      console.error('Cursor failed', ev);

      const msg = cursor.error?.message ?? 'Unknown error';
      rej(new Error(`Failed to read logs from database ${msg}`));

      rej();
    };
  }).finally(() => {
    db.close();
  });

  return await Promise.all(delPromises);
}
