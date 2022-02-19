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
  let mainTokenIn,
    otherTokenOut,
    mainTokenInFormatted,
    otherTokenOutFormatted,
    price;
  if (mainToken === 0) {
    mainTokenIn = e.amount0Out.sub(e.amount0In);
    mainTokenInFormatted = ethers.utils.formatUnits(mainTokenIn, digits0);
    otherTokenOut = e.amount1Out.sub(e.amount1In);
    otherTokenOutFormatted = ethers.utils.formatUnits(otherTokenOut, digits1);
    price = getRelativePrice(mainTokenIn, otherTokenOut, digits0, digits1);
  } else if (mainToken === 1) {
    mainTokenIn = e.amount1Out.sub(e.amount1In);
    mainTokenInFormatted = ethers.utils.formatUnits(mainTokenIn, digits1);
    otherTokenOut = e.amount0Out.sub(e.amount0In);
    otherTokenOutFormatted = ethers.utils.formatUnits(otherTokenOut, digits0);
    price = getRelativePrice(mainTokenIn, otherTokenOut, digits1, digits0);
  } else {
    throw new Error(`mainToken must be either 0 or 1, ${mainToken} given`);
  }
  return {
    Block: event.blockNumber,
    AmountIn: mainTokenInFormatted,
    AmountOut: otherTokenOutFormatted,
    Price: price,
    Transaction: event.transactionHash,
    Sender: e.sender,
    To: e.to,
  };
}

/**
 * Given the amounts swapped between two tokens, return a string
 * with the price of token0 relative to token1.
 */
export function getRelativePrice(
  token0: BigNumber,
  token1: BigNumber,
  digits0: number,
  digits1: number
): number {
  return Math.abs(
    parseFloat(ethers.utils.formatUnits(token1, digits1)) /
      parseFloat(ethers.utils.formatUnits(token0, digits0))
  );
}
