import * as dotenv from "dotenv";

dotenv.config();

export function getenv(key: string, fallback: any = null): any {
  return process.env[key] ?? fallback;
}
