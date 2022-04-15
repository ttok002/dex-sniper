import { LogLevel } from '@ethersproject/logger';
import { ethers } from 'ethers';
import { getenv } from './dotenv';

export const LOGGING = getenv('LOGGING', 'OFF') as LogLevel;
export const LOG_REQUESTS = parseInt(getenv('LOG_REQUESTS', '0'), 10);
export const LOG_RESPONSES = parseInt(getenv('LOG_RESPONSES', '0'), 10);

const Logger = ethers.utils.Logger;

Logger.setLogLevel(LOGGING ? LOGGING : Logger.levels.OFF);

export const logger = new ethers.utils.Logger('v1.0');

export function info(...args: any[]) {
  LOGGING && logger.info(args);
}

export function debug(...args: any[]) {
  LOGGING && logger.debug(args);
}

export function warn(...args: any[]) {
  LOGGING && logger.warn(args);
}

/**
 * What to do when the provider makes a request or
 * receives a response
 */
export function onProviderDebug(info: Record<string, any>) {
  // Log requests
  if (info.action === 'request') {
    switch (LOG_REQUESTS) {
      case 1:
        console.log(`> Request ${info.request.method}`);
        break;
      case 2:
        console.log('> Request');
        console.log(info.request);
        break;
      default:
        break;
    }
  }
  // Log responses
  else if (info.action === 'response') {
    switch (LOG_RESPONSES) {
      case 1:
        console.log(`> Response`);
        console.log(info.response);
        break;
      default:
        break;
    }
  } else {
    console.log(`Unknown debug type ${info.action}`);
    console.log(info);
  }
}
