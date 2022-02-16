import { BigNumber } from "@ethersproject/bignumber";
import { TransactionReceipt } from "@ethersproject/abstract-provider";

/**
 * The callback to a Swap event
 */
export interface swapEventCallback {
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
