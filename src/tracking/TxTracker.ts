import { ethers } from 'ethers';
import { logTx } from './types';
import { Provider } from '@ethersproject/providers';

export class TxTracker {
  txs: logTx[] = [];

  /**
   * Log a transaction.
   *
   * If the transaction was already logged, do nothing.
   */
  add(txHash: string, tags: string[]): void {
    if (this.findTx(txHash)) {
      return;
    }
    this.txs.push({ hash: txHash, tags });
  }

  /**
   * Return all transctions logged so far
   */
  getTxs(): logTx[] {
    return this.txs;
  }

  /**
   * Return the number of txs logged so far
   */
  getTxsLen(): number {
    return this.txs.length;
  }

  /**
   * Add a tag to the given transaction
   */
  addTag(txHash: string, tag: string) {
    const tx = this.findTx(txHash);
    tx.tags.push(tag);
    tx.tags = [...new Set(tx.tags)]; // unique
  }

  /**
   * Return the given transaction from the log
   */
  findTx(txHash: string): logTx {
    const txs = this.txs.filter((tx) => tx.hash === txHash);
    return txs[0] ?? null;
  }

  /**
   * Find receipt for all txs in the log
   */
  async fetchReceipts(provider: Provider): Promise<logTx[]> {
    for (let i = 0; i < this.txs.length; i++) {
      const logTx = this.txs[i];
      if (!logTx.receipt) {
        logTx.receipt = await provider.waitForTransaction(logTx.hash);
      }
      logTx.blockNumber = logTx.receipt.blockNumber;
    }
    return this.txs;
  }
}
