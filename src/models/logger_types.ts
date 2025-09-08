import { DateTime } from 'luxon';
import {
  isEnumValueGenerator,
  isString,
  typeGuardGenerator,
  typeGuardTestGenerator,
} from '@metools/tcheck';

import { isValidDateTimeString } from '@vice_bank/utils/type_guards';

export enum LogLevel {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

interface LoggedEventJSON {
  id: string;
  message: string;
  level: LogLevel;
  timestamp: string;
}

const isLoggedEventCommon = {
  id: isString,
  message: isString,
  level: isEnumValueGenerator(LogLevel),
  timestamp: isValidDateTimeString,
};
const isLoggedEventJSON =
  typeGuardGenerator<LoggedEventJSON>(isLoggedEventCommon);
const isLoggedEventTest = typeGuardTestGenerator(isLoggedEventCommon);

export class LoggedEvent {
  protected _id: string;
  protected _message: string;
  protected _level: LogLevel;
  protected _timestamp: DateTime<true>;

  constructor(args: LoggedEventJSON) {
    this._id = args.id;
    this._message = args.message;
    this._level = args.level;

    const timestamp = DateTime.fromISO(args.timestamp);
    if (!timestamp.isValid) {
      throw new Error('Invalid timestamp');
    }

    this._timestamp = timestamp;
  }

  get id() {
    return this._id;
  }
  get message() {
    return this._message;
  }
  get level() {
    return this._level;
  }
  get timestamp() {
    return this._timestamp;
  }
  get dbIndex() {
    return `${this._timestamp.toISO()}-${this._id}`;
  }

  toJSON(): LoggedEventJSON {
    return {
      id: this._id,
      message: this._message,
      level: this._level,
      timestamp: this._timestamp.toISO(),
    };
  }

  toIDBJSON() {
    return {
      ...this.toJSON(),
      dbIndex: this.dbIndex,
    };
  }

  static isLoggedEventJSON = isLoggedEventJSON;

  static fromJSON(json: unknown): LoggedEvent {
    if (!LoggedEvent.isLoggedEventJSON(json)) {
      const test = isLoggedEventTest(json);
      throw new Error(`Invalid LoggedEventJSON ${test.join(', ')}`);
    }
    return new LoggedEvent(json);
  }
}
