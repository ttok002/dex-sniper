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

/**
 * Return a promise that never resolves; useful to
 * make a Hardhat run indefinitely.
 *
 * Optionally specify a number of milli seconds to have
 * the promise resolve after that amount of time.
 */
export function wait(nMilliseconds: number = 0) {
  if (!nMilliseconds) {
    return new Promise(() => {});
  } else {
    return new Promise((resolve) => setTimeout(resolve, nMilliseconds));
  }
}

/**
 * Remove potential username and password from an URL
 */
export function getSafeUrl(url: string | URL) {
  const u = new URL(url);
  return `${u.origin}/${u.pathname}`;
}
