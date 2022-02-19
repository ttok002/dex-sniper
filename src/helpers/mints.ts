import { ethers, Event } from "ethers";
import { MintRecordRaw } from "../dexes/types";

/**
 * Convert a Mint event to a flat object suitable to
 * be printed as a CSV row
 */
export function mintEventToCsvRow(
  event: Event,
  digits0: number = 18,
  digits1: number = 18
): MintRecordRaw {
  return {
    blockNumber: event.blockNumber,
    // @ts-ignore
    sender: event.args.sender.toString(),
    amount0: ethers.utils.formatUnits(
      // @ts-ignore
      event.args.amount0,
      digits0
    ),
    // @ts-ignore
    amount1: ethers.utils.formatUnits(
      // @ts-ignore
      event.args.amount1,
      digits1
    ),
    tx: event.transactionHash,
  };
}
