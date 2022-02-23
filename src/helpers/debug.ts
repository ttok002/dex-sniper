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
  tx: TransactionReceipt,
  digits0: number = 18,
  digits1: number = 18
) {
  console.log(new Date());
  console.log(`
        New swap detected
        =================
        sender: ${sender}
        amount0In: ${ethers.utils.formatUnits(amount0In, digits0)}
        amount1In: ${ethers.utils.formatUnits(amount1In, digits1)}
        amount0Out: ${ethers.utils.formatUnits(amount0Out, digits0)}
        amount1Out: ${ethers.utils.formatUnits(amount1Out, digits1)}
        to: ${to}
        block: ${tx.blockNumber}
    `);
}

export function printMintEvent(
  sender: string,
  amount0: BigNumber,
  amount1: BigNumber,
  tx: TransactionReceipt,
  digits0: number = 18,
  digits1: number = 18
) {
  console.log(new Date());
  console.log(`
        New mint detected
        =================
        sender: ${sender}
        amount0: ${ethers.utils.formatUnits(amount0, digits0)}
        amount1: ${ethers.utils.formatUnits(amount1, digits1)}
        block: ${tx.blockNumber}
    `);
}
