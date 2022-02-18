import { BigNumber } from "@ethersproject/bignumber";
import { TransactionReceipt } from "@ethersproject/abstract-provider";

/**
 * The callback of a Swap event on the pair
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
 * The callback of a Mint event on the pair
 */
export interface MintEventCallback {
  (
    sender: string,
    amount0: BigNumber,
    amount1: BigNumber,
    tx: TransactionReceipt
  ): void;
}

/**
 * The callback of a Burn event on the pair
 */
export interface BurnEventCallback {
  (
    sender: string,
    amount0: BigNumber,
    amount1: BigNumber,
    to: string,
    tx: TransactionReceipt
  ): void;
}

/**
 * The callback of a PairCreated event on the factory
 */
export interface PairCreatedEventCallback {
  (token0: string, token1: string, pair: string, tx: TransactionReceipt): void;
}

/**
 * TODO: How can we use SwapEvent in SwapEventCallback,
 * to reduce boilerplate?
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
