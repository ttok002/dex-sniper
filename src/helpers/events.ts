import { Event } from "ethers";
import { SwapRecord } from "../dexes/types";

/**
 * Convert a swap event to a flat object suitable to
 * be printed as a CSV row
 */
export function swapEventToCsvRow(event: Event): SwapRecord {
  return {
    blockNumber: event.blockNumber,
    // @ts-ignore
    sender: event.args.sender.toString(),
    // @ts-ignore
    amount0In: event.args.amount0In.toString(),
    // @ts-ignore
    amount1In: event.args.amount1In.toString(),
    // @ts-ignore
    amount0Out: event.args.amount0Out.toString(),
    // @ts-ignore
    amount1Out: event.args.amount1Out.toString(),
    // @ts-ignore
    to: event.args.to,
    tx: event.transactionHash,
  };
}
