import { LogLevel } from '@ethersproject/logger';
import { getenv, SCRIPT_PATH } from './dotenv';
import path from 'path';
import { createLoggerObject, createWriteStream, writeLogLine } from '../helpers/logger';

/**
 * Log level: DEBUG, INFO, WARN, ERROR, OFF
 */
export const LOG_LEVEL: LogLevel = getenv('LOG_LEVEL', 'OFF') as LogLevel;

/**
 * Whether or not to log to screen
 */
export const LOG_TO_SCREEN: boolean = parseInt(getenv('LOG_TO_SCREEN', '1'), 10) !== 0;

/**
 * Whether or not to log to file
 */
export const LOG_TO_FILE: boolean = parseInt(getenv('LOG_TO_FILE', '1'), 10) !== 0;

/**
 * Directory where to dump logs
 */
export const LOG_DIR: string = getenv('LOG_DIR', path.resolve(SCRIPT_PATH, 'storage', 'logs'));

/**
 * Whether or not to log requests made by ethers.js provider
 */
export const LOG_REQUESTS: number = parseInt(getenv('LOG_REQUESTS', '0'), 10);

/**
 * Whether or not to log responses received by ethers.js provider
 */
export const LOG_RESPONSES: number = parseInt(getenv('LOG_RESPONSES', '0'), 10);

/**
 * Export default logger object
 */
export const ethersLogger = createLoggerObject(LOG_LEVEL);

/**
 * Export default output stream
 */
export const fileLogger = LOG_TO_FILE && createWriteStream(path.resolve(LOG_DIR, 'app.log'));

/**
 * Log info message
 */
export function info(...args: any[]): void {
  if (LOG_TO_SCREEN) {
    ethersLogger.info(...args);
  }
  if (fileLogger && shouldLog('INFO')) {
    writeLogLine(fileLogger, '[INFO]', ...args);
  }
}

/**
 * Log debug message
 */
export function debug(...args: any[]) {
  if (LOG_TO_SCREEN) {
    ethersLogger.debug(...args);
  }
  if (fileLogger && shouldLog('DEBUG')) {
    writeLogLine(fileLogger, '[DEBUG]', ...args);
  }
}

/**
 * Log warning message
 */
export function warn(...args: any[]) {
  if (LOG_TO_SCREEN) {
    ethersLogger.warn(...args);
  }
  if (fileLogger && shouldLog('WARNING')) {
    writeLogLine(fileLogger, ['WARNING'], ...args);
  }
}

/**
 * Log warning message
 */
export function warning(...args: any[]) {
  warn(...args);
}

/**
 * Return true if the given log level is going
 * to be logged by the logger
 */
export function shouldLog(logLevel: string): boolean {
  const logLevels = { DEBUG: 1, INFO: 2, WARNING: 3, ERROR: 4, OFF: 5 }; // copied from ethers.js
  if (logLevels.hasOwnProperty(logLevel)) {
    // @ts-ignore
    return logLevels[LOG_LEVEL] <= logLevels[logLevel];
  }
  throw new Error(`Unrecognized log level '${logLevel}'`);
}

export default {
  info,
  debug,
  warn,
  warning,
};
