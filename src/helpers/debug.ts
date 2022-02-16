import { BigNumber } from "@ethersproject/bignumber";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";

export function printSwapEvent(
  sender: string,
  amount0In: BigNumber,
  amount1In: BigNumber,
  amount0Out: BigNumber,
  amount1Out: BigNumber,
  to: string,
  tx: TransactionReceipt
) {
  console.log(new Date());
  console.log(`
        New swap detected
        =================
        sender: ${sender}
        amount0In: ${ethers.utils.formatUnits(amount0In, 6)}
        amount1In: ${ethers.utils.formatUnits(amount1In)}
        amount0Out: ${ethers.utils.formatUnits(amount0Out, 6)}
        amount1Out: ${ethers.utils.formatUnits(amount1Out)}
        to: ${to}
        block: ${tx.blockNumber}
    `);
}
