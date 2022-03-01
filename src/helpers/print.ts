import { BigNumber } from '@ethersproject/bignumber';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { ethers } from 'ethers';

/**
 * Pretty print a Swap event; suitable to
 * be the callback of Swap event.
 */
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
  prettyPrint('New swap detected', {
    date: new Date(),
    sender: sender,
    amount0In: `${ethers.utils.formatUnits(amount0In, digits0)} (${amount0In})`,
    amount1In: `${ethers.utils.formatUnits(amount1In, digits1)} (${amount1In})`,
    amount0Out: `${ethers.utils.formatUnits(amount0Out, digits0)} (${amount0Out})`,
    amount1Out: `${ethers.utils.formatUnits(amount1Out, digits1)} (${amount1Out})`,
    to: to,
    block: tx.blockNumber,
  });
}

/**
 * Pretty print a Mint event; suitable to
 * be the callback of Mint event.
 */
export function printMintEvent(
  sender: string,
  amount0: BigNumber,
  amount1: BigNumber,
  tx: TransactionReceipt,
  digits0: number = 18,
  digits1: number = 18
) {
  prettyPrint('New mint detected', {
    date: new Date(),
    sender: sender,
    amount0: `${ethers.utils.formatUnits(amount0, digits0)} (${amount0})`,
    amount1: `${ethers.utils.formatUnits(amount1, digits1)} (${amount1})`,
    block: tx.blockNumber,
  });
}

/**
 * Pretty print the output of the getAmountsOut
 * function.
 */
export function printAmounts(amounts: BigNumber[], digits0: number, digits1: number) {
  prettyPrint('Amounts', {
    tokenIn: `${ethers.utils.formatUnits(amounts[0], digits0)} (${amounts[0]})`,
    tokenOut: `${ethers.utils.formatUnits(amounts[1], digits1)} (${amounts[1]})`,
  });
}

/**
 * Pretty print the receipt of a swap transaction
 */
export function printSwapReceipt(
  tx: TransactionReceipt,
  digitsIn: number = 18,
  digitsOut: number = 18
) {
  printTxReceipt(tx, 'Swap receipt');
}

/***
 * Pretty print a transaction receipt
 */
export function printTxReceipt(
  tx: TransactionReceipt,
  title: string = 'Tx receipt',
  extraLinesBefore: Record<string, any> = {},
  extraLinesAfter: Record<string, any> = {}
) {
  const status = tx.status === 1 ? 'OK' : 'ERROR!';
  const type = tx.type === 2 ? 'EIP-1559' : 'Legacy';
  const lines = {
    hash: tx.transactionHash,
    status: `${status} (${tx.status})`,
    to: tx.to,
    block: tx.blockNumber,
    'Transaction Fee': `${ethers.utils.formatUnits(tx.effectiveGasPrice.mul(tx.gasUsed))} ETH`,
    effectiveGasPrice: `${ethers.utils.formatUnits(tx.effectiveGasPrice, 9)} gwei`,
    gasUsed: tx.gasUsed,
    cumulativeGasUsed: tx.cumulativeGasUsed,
    type: `${type} (${tx.type})`,
    confirmations: tx.confirmations,
  };
  prettyPrint(title, Object.assign(extraLinesBefore, lines, extraLinesAfter));
}

/**
 * Pretty print an info message
 */
export function prettyPrint(title: string, lines: Record<string, any>, nPadding: number = 4) {
  console.log(buildPrettyPrint(title, lines, nPadding));
}

/**
 * Build a pretty info message
 */
export function buildPrettyPrint(
  title: string,
  lines: Record<string, any>,
  nPadding: number
): string {
  let padding: string = '';
  for (let i = 0; i < nPadding; i++) {
    padding += ' ';
  }
  let output = `${padding}${title}\n`;
  const nFooter = title.length;
  let footer: string = '';
  for (let i = 0; i < nFooter; i++) {
    footer += '=';
  }
  output += `${padding}${footer}\n`;
  for (const key in lines) {
    const value = lines[key];
    output += `${padding}${key}: ${value}\n`;
  }
  return output;
}
