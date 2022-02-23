import { UniswapV2Clone } from "../UniswapV2Clone";

/**
 * Check if the given pair corresponds to the given tokens,
 * returns false otherwise.
 *
 * Token order does not matter.
 */
export async function validatePair(
  dex: UniswapV2Clone,
  pair: string,
  token0: string,
  token1: string,
  doEcho: boolean = false
): Promise<boolean> {
  const expectedPair = await dex.getPairAddress(token0, token1, false);
  if (expectedPair !== pair.toLowerCase()) {
    if (doEcho) {
      console.log(`
        Wrong pair!
        ==============
        given pair: ${pair}
        expected: ${expectedPair}
      `);
    }
    return false;
  }
  return true;
}
