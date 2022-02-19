// @ts-ignore
import EthDater from "ethereum-block-by-date";
import { Provider, Block } from "@ethersproject/providers";
import { Moment } from "moment";

/**
 * Given a date in moment.js format, return the number of the
 * first block mined after that date.
 */
export async function getBlockNumberFromDate(
  date: Moment,
  provider: Provider
): Promise<number> {
  const dater = new EthDater(provider);
  return (await dater.getDate(date, true)).block;
}

/**
 * Given a date in moment.js format, return the first block
 * mined after that date.
 */
export async function getBlockFromDate(
  date: Moment,
  provider: Provider
): Promise<Block> {
  const blockNumber = getBlockNumberFromDate(date, provider);
  return await provider.getBlock(blockNumber);
}
