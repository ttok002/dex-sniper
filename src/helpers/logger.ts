import { LogLevel, Logger } from '@ethersproject/logger';
import fs, { WriteStream } from 'fs';
import logger from '../common/logger';

/**
 * Crate a new logger object
 */
export function createLoggerObject(logLevel: LogLevel, version = 'v1.0') {
  Logger.setLogLevel(logLevel ? logLevel : Logger.levels.OFF);
  return new Logger(version);
}

/**
 * Create a new file output stream
 */
export function createWriteStream(filePath: string) {
  return fs.createWriteStream(filePath, {
    flags: 'a+',
  });
}

/**
 * Return the concatenation of the string representations of the
 * given arguments, prepended with the current ISO date.
 */
export function buildLogLine(...args: any[]): string {
  let output = '';
  output += new Date().toISOString();
  output += `${args.reduce((s, v) => s + ' ' + v.toString(), '')}`;
  output += '\n';
  return output;
}

/**
 * Dump the given args to a stream
 */
export function writeLogLine(stream: WriteStream, ...args: any[]): void {
  stream.write(buildLogLine(...args));
}

/**
 * What to do when the provider makes a request or
 * receives a response
 */
export function onProviderDebug(
  info: Record<string, any>,
  logRequests: number,
  logResponses: number
) {
  // Log requests
  if (info.action === 'request') {
    switch (logRequests) {
      case 1:
        logger.info(`> Request ${info.request.method}`);
        break;
      case 2:
        logger.info('> Request');
        logger.info(info.request);
        break;
      default:
        break;
    }
  }
  // Log responses
  else if (info.action === 'response') {
    switch (logResponses) {
      case 1:
        logger.info(`> Response`);
        logger.info(info.response);
        break;
      default:
        break;
    }
  } else {
    logger.info(`Unknown debug type ${info.action}`);
    logger.info(info);
  }
}
