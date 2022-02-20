import { ethers, Event } from "ethers";
import { MintEvent, MintRecordRaw, MintRecordStat } from "../dexes/types";
import { getRelativePrice } from "./swaps";

/**
 * Convert a Mint event to a flat object suitable to
 * be printed as a CSV row
 */
export function getMintRecordRaw(
  event: Event,
  digits0: number = 18,
  digits1: number = 18
): MintRecordRaw {
  const e = (event as any).args as MintEvent;
  return {
    blockNumber: event.blockNumber,
    sender: e.sender,
    amount0: ethers.utils.formatUnits(e.amount0, digits0),
    amount1: ethers.utils.formatUnits(e.amount1, digits1),
    tx: event.transactionHash,
  };
}

/**
 * Convert a Mint event to a flat object suitable to
 * be printed as a CSV row and used for statistical
 * purposes.
 *
 * The function requires to know which token to treat
 * as the main token; prices and amounts will be computed
 * relative to the main token.
 */
export function getMintRecordStat(
  event: Event,
  digits0: number = 18,
  digits1: number = 18,
  mainToken: 0 | 1 = 0
): MintRecordStat {
  const e = (event as any).args as MintEvent;
  if (mainToken === 0) {
    return {
      Block: event.blockNumber,
      Amount1: ethers.utils.formatUnits(e.amount0, digits0),
      Amount2: ethers.utils.formatUnits(e.amount1, digits1),
      Price: getRelativePrice(e.amount0, e.amount1, digits0, digits1),
      Transaction: event.transactionHash,
      Sender: e.sender,
    };
  } else if (mainToken === 1) {
    return {
      Block: event.blockNumber,
      Amount1: ethers.utils.formatUnits(e.amount1, digits1),
      Amount2: ethers.utils.formatUnits(e.amount0, digits0),
      Price: getRelativePrice(e.amount1, e.amount0, digits1, digits0),
      Transaction: event.transactionHash,
      Sender: e.sender,
    };
  } else {
    throw new Error(`mainToken must be either 0 or 1, ${mainToken} given`);
  }
}
