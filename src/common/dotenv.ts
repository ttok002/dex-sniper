import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Directory from which the script was launched
 */
export const SCRIPT_PATH = process.cwd();

/**
 * Path where the .env file should be
 */
export const DOT_ENV_PATH = resolve(SCRIPT_PATH, '.env');

if (!existsSync(DOT_ENV_PATH)) {
  throw new Error(`Could not find .env file, are you in the project's root dir?`);
}

dotenv.config({ path: DOT_ENV_PATH });

/**
 * Get variable from the environment with optional
 * fallback
 */
export function getenv(key: string, fallback: string = ''): string {
  return process.env[key] ?? fallback;
}
