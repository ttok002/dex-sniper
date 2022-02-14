/**
 * Wait for n milliseconds
 */
export async function sleep(nMilliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, nMilliseconds));
}

/**
 * Get first command line argument, or null
 */
export function firstArg() {
  return process.argv[2] ?? null;
}

/**
 * Get second command line argument, or null
 */
export function secondArg() {
  return process.argv[3] ?? null;
}

/**
 * Get third command line argument, or null
 */
export function thirdArg() {
  return process.argv[4] ?? null;
}
