import { BigNumber } from "@ethersproject/bignumber";
import { TransactionReceipt } from "@ethersproject/abstract-provider";

/**
 * The callback to a Swap event
 */
export interface SwapEventCallback {
  (
    sender: string,
    amount0In: BigNumber,
    amount1In: BigNumber,
    amount0Out: BigNumber,
    amount1Out: BigNumber,
    to: string,
    tx: TransactionReceipt
  ): void;
}

/**
 * TODO: How can we use SwapEvent in SwapEventCallback?
 */
export interface SwapEvent {
  sender: string;
  amount0In: BigNumber;
  amount1In: BigNumber;
  amount0Out: BigNumber;
  amount1Out: BigNumber;
  to: string;
  tx: TransactionReceipt;
}

/**
 * Info concerning a swap on a DEX pair
 */
export interface SwapRecord {
  blockNumber: number;
  sender: string;
  amount0In: string;
  amount1In: string;
  amount0Out: string;
  amount1Out: string;
  to: string;
  tx: string;
}

/**
 * Info concerning a mint on a DEX pair
 */
export interface MintRecord {
  blockNumber: number;
  sender: string;
  amount0: string;
  amount1: string;
  tx: string;
}
