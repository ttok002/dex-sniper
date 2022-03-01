import * as dotenv from 'dotenv';

dotenv.config();

export function getenv(key: string, fallback: string = ''): string {
  return process.env[key] ?? fallback;
}
