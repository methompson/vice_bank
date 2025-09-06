import { DateTime } from 'luxon';

enum LogLevel {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

interface LoggedEventJSON {
  message: string;
  level: LogLevel;
  timestamp: string;
}

export class LoggedEvent {
  protected _message: string;
  protected _level: LogLevel;
  protected _timestamp: DateTime<true>;

  constructor(args: LoggedEventJSON) {
    this._message = args.message;
    this._level = args.level;

    const timestamp = DateTime.fromISO(args.timestamp);
    if (!timestamp.isValid) {
      throw new Error('Invalid timestamp');
    }

    this._timestamp = timestamp;
  }
}
