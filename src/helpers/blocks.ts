import { Provider } from '@ethersproject/providers';

/**
 * Return an array with two elements:
 * - the latest block number minus N
 * - the latest block number
 */
export async function getMostRecentBlocksRange(n: number, provider: Provider) {
  const latest = await provider.getBlockNumber();
  return [latest - n, latest];
}
