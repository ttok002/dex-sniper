import { ethers, Event } from "ethers";
import { MintRecord, SwapRecord } from "../dexes/types";

/**
 * Convert a Swap event to a flat object suitable to
 * be printed as a CSV row
 */
export function swapEventToCsvRow(
  event: Event,
  digits0: number = 18,
  digits1: number = 18
): SwapRecord {
  return {
    blockNumber: event.blockNumber,
    // @ts-ignore
    sender: event.args.sender.toString(),
    amount0In: ethers.utils.formatUnits(
      // @ts-ignore
      event.args.amount0In,
      digits0
    ),
    // @ts-ignore
    amount1In: ethers.utils.formatUnits(
      // @ts-ignore
      event.args.amount1In,
      digits1
    ),
    // @ts-ignore
    amount0Out: ethers.utils.formatUnits(
      // @ts-ignore
      event.args.amount0Out,
      digits0
    ),
    // @ts-ignore
    amount1Out: ethers.utils.formatUnits(
      // @ts-ignore
      event.args.amount1Out,
      digits1
    ),
    // @ts-ignore
    to: event.args.to,
    tx: event.transactionHash,
  };
}

/**
 * Convert a Mint event to a flat object suitable to
 * be printed as a CSV row
 */
export function mintEventToCsvRow(
  event: Event,
  digits0: number = 18,
  digits1: number = 18
): MintRecord {
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
