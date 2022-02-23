import { BigNumber, ethers, Event } from "ethers";
import { SwapEvent, SwapRecordRaw, SwapRecordStat } from "../dexes/types";

/**
 * Convert a Swap event to a flat object suitable to
 * be printed as a CSV row
 */
export function getSwapRecordRaw(
  event: Event,
  digits0: number = 18,
  digits1: number = 18
): SwapRecordRaw {
  const e = (event as any).args as SwapEvent;
  const format0 = (n: BigNumber) =>
    ethers.utils.formatUnits(e.amount0In, digits0);
  const format1 = (n: BigNumber) =>
    ethers.utils.formatUnits(e.amount0In, digits1);
  return {
    blockNumber: event.blockNumber,
    sender: e.sender,
    amount0In: format0(e.amount0In),
    amount1In: format1(e.amount1In),
    amount0Out: format0(e.amount0Out),
    amount1Out: format1(e.amount1Out),
    to: e.to,
    tx: event.transactionHash,
  };
}

/**
 * Convert a Swap event to a flat object suitable to
 * be printed as a CSV row and used for statistical
 * purposes.
 *
 * The function requires to know which token to treat
 * as the main token; prices and amounts will be computed
 * relative to the main token.
 */
export function getSwapRecordStat(
  event: Event,
  digits0: number = 18,
  digits1: number = 18,
  mainToken: 0 | 1 = 0
): SwapRecordStat {
  const e = (event as any).args as SwapEvent;
  let stats;
  if (mainToken === 0) {
    stats = getSwapStats(
      e.amount0In,
      e.amount0Out,
      e.amount1In,
      e.amount1Out,
      digits0,
      digits1
    );
  } else if (mainToken === 1) {
    stats = getSwapStats(
      e.amount1In,
      e.amount1Out,
      e.amount0In,
      e.amount0Out,
      digits1,
      digits0
    );
  } else {
    throw new Error(`mainToken must be either 0 or 1, ${mainToken} given`);
  }
  return {
    Block: event.blockNumber,
    Amount1: stats.net0Formatted,
    Amount2: stats.net1Formatted,
    Price: stats.relativePrice,
    Transaction: event.transactionHash,
    Sender: e.sender,
    To: e.to,
  };
}

/**
 * Given the amounts as returned by a Swap event,
 * return the net flows in the two tokens and the
 * price of token 0 relative to token 1.
 */
export function getSwapStats(
  amount0In: BigNumber,
  amount0Out: BigNumber,
  amount1In: BigNumber,
  amount1Out: BigNumber,
  digits0: number,
  digits1: number
) {
  const net0 = amount0Out.sub(amount0In);
  const net1 = amount1Out.sub(amount1In);
  return {
    net0,
    net1,
    net0Formatted: ethers.utils.formatUnits(net0, digits0),
    net1Formatted: ethers.utils.formatUnits(net1, digits1),
    relativePrice: getRelativePrice(net0, net1, digits0, digits1),
  };
}

/**
 * Given the amounts swapped in a swap, return the
 * price of token0 relative to token1.
 */
export function getRelativePrice(
  amount0: BigNumber,
  amount1: BigNumber,
  digits0: number,
  digits1: number
): number {
  return Math.abs(
    parseFloat(ethers.utils.formatUnits(amount0, digits1)) /
      parseFloat(ethers.utils.formatUnits(amount1, digits0))
  );
}
