import { BigNumber } from '@ethersproject/bignumber';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider';
import { ethers, logger } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';

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
  prettyPrint('New swap detected', [
    ['date', new Date()],
    ['sender', sender],
    ['amount0In', `${ethers.utils.formatUnits(amount0In, digits0)} (${amount0In})`],
    ['amount1In', `${ethers.utils.formatUnits(amount1In, digits1)} (${amount1In})`],
    ['amount0Out', `${ethers.utils.formatUnits(amount0Out, digits0)} (${amount0Out})`],
    ['amount1Out', `${ethers.utils.formatUnits(amount1Out, digits1)} (${amount1Out})`],
    ['to', to],
    ['block', tx.blockNumber],
  ]);
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
  prettyPrint('New mint detected', [
    ['date', new Date()],
    ['sender', sender],
    ['amount0', `${ethers.utils.formatUnits(amount0, digits0)} (${amount0})`],
    ['amount1', `${ethers.utils.formatUnits(amount1, digits1)} (${amount1})`],
    ['block', tx.blockNumber],
  ]);
}

/**
 * Pretty print the output of the getAmountsOut
 * function.
 */
export function printAmounts(amounts: BigNumber[], digits0: number, digits1: number) {
  prettyPrint('Amounts', [
    ['tokenIn', `${ethers.utils.formatUnits(amounts[0], digits0)} (${amounts[0]})`],
    ['tokenOut', `${ethers.utils.formatUnits(amounts[1], digits1)} (${amounts[1]})`],
  ]);
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
  extraLinesBefore: [string, any][] = [],
  extraLinesAfter: [string, any][] = []
) {
  const status = tx.status === 1 ? 'OK' : 'ERROR!';
  const type = tx.type === 2 ? 'EIP-1559' : 'Legacy';
  const lines = [
    ['hash', tx.transactionHash],
    ['status', `${status} (${tx.status})`],
    ['to', tx.to],
    ['from', tx.from],
    ['block', tx.blockNumber],
    ['Transaction Fee', `${ethers.utils.formatUnits(tx.effectiveGasPrice.mul(tx.gasUsed))} ETH`],
    ['effectiveGasPrice', `${ethers.utils.formatUnits(tx.effectiveGasPrice, 9)} gwei`],
    ['gasUsed', tx.gasUsed],
    ['cumulativeGasUsed', tx.cumulativeGasUsed],
    ['type', `${type} (${tx.type})`],
    ['confirmations', tx.confirmations],
  ] as [string, any][];
  prettyPrint(title, [...extraLinesBefore, ...lines, ...extraLinesAfter]);
}

/**
 * Pretty print a transaction response.
 *
 * A tx response is the object returned by the
 * getTransaction function (which calls the RPC
 * method getTransactionByHash).
 */
export function printTxResponse(
  tx: TransactionResponse | null,
  title: string = 'Tx response',
  extraLinesBefore: [string, any][] = [],
  extraLinesAfter: [string, any][] = [],
  withData: boolean = false
): void {
  if (!tx) {
    return prettyPrint('Empty tx response!', []);
  }
  const lines = [
    ['hash', tx.hash],
    ['from', tx.from],
    ['to', tx.to],
    ['confirmations', tx.confirmations],
    ['blockNumber', tx.blockNumber],
    ['value', tx.value],
  ] as [string, any][];
  if (withData) {
    lines.push(['data', tx.data]);
  }
  prettyPrint(title, [...extraLinesBefore, ...lines, ...extraLinesAfter]);
}

/**
 * Pretty print a parsed transaction.
 *
 * A parsed tx is a contract transaction that has been
 * decoded with the contract's ABI interface.
 */
export function printParsedTx(
  tx: TransactionDescription | null,
  title: string = 'Parsed Tx',
  extraLinesBefore: [string, any][] = [],
  extraLinesAfter: [string, any][] = [],
  nPadding: number = 4
): void {
  if (!tx) {
    return prettyPrint('Empty parsed tx!', []);
  }
  const lines = [
    ['method', tx.name],
    ['sighash', tx.sighash],
    ['value', tx.value],
  ] as [string, any][];
  // Inputs
  if (tx.functionFragment.inputs) {
    lines.push(['args:', '']);
  }
  tx.functionFragment.inputs.forEach((v, i) => {
    lines.push([` \\ ${v.name}`, tx.args[v.name]]);
  });
  prettyPrint(title, [...extraLinesBefore, ...lines, ...extraLinesAfter], nPadding);
}

/**
 * Pretty print an info message
 */
export function prettyPrint(
  title: string,
  lines: [string, any][] = [],
  nPadding: number = 4
): void {
  logger.info(buildPrettyPrint(title, lines, nPadding));
}

/**
 * Build a pretty info message
 */
export function buildPrettyPrint(title: string, lines: [string, any][], nPadding: number): string {
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
  lines.forEach((v) => {
    output += `${padding}${v[0]}`;
    if (v[1] !== '') {
      output += `: ${v[1]}`;
    }
    output += '\n';
  });
  return output;
}

/**
 * Make an object suitable to be printed with
 * the prettyPrint functions in this module
 */
export function prepare(obj: Record<string, any>): [string, any][] {
  const output = [] as [string, any][];
  for (const key in obj) {
    output.push([key, obj[key]]);
  }
  return output;
}
