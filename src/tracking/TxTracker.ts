import { LogTx } from './types';
import { Provider } from '@ethersproject/providers';

/**
 * Track transactions on the fly to allow for later
 * analysis.
 */
export class TxTracker {
  txs: LogTx[] = [];

  /**
   * Log a transaction.
   *
   * If the transaction was already logged and doubleCheck
   * is true, do nothing.
   *
   * @returns {number} The ID of the added tx in the log,
   * 0 if the tx was not added.
   */
  add(txHash: string, tags: string[], doubleCheck = false): number {
    if (doubleCheck && this.findTx(txHash)) {
      return 0;
    }
    return this.txs.push({ id: this.txs.length + 1, hash: txHash, tags });
  }

  /**
   * Update the hash and tags of the given transaction; does
   * not fetch the tx receipt.
   */
  update(id: number, txHash: string | null = null, tags: string[] | null = null) {
    const tx = this.txs[id];
    if (txHash) {
      tx.hash = txHash;
    }
    if (tags) {
      tx.tags = tags;
    }
    return tx;
  }

  /**
   * Get a transaction from the log given its ID
   * in the log
   */
  getTx(id: number): LogTx {
    return this.txs[id - 1];
  }

  /**
   * Return all transctions logged so far
   */
  getAllTxs(): LogTx[] {
    return this.txs;
  }

  /**
   * Return the number of txs logged so far
   */
  getLogLength(): number {
    return this.txs.length;
  }

  /**
   * Add a tag to the transaction with the given ID
   *
   * @returns {string[]} The updated tags of the tx
   */
  addTag(id: number, tag: string): string[] {
    const tx = this.getTx(id);
    tx.tags.push(tag);
    return tx.tags;
  }

  /**
   * Return the tags of the given transaction
   */
  getTags(id: number): string[] {
    return this.getTx(id).tags;
  }

  /**
   * Search the log for given transaction hash.
   *
   * @returns {number} The ID of the transaction in the log,
   * or -1 if not found.
   */
  findTx(txHash: string): number {
    const txs = this.txs.filter((tx) => tx.hash === txHash);
    return txs[0].id ?? -1;
  }

  /**
   * Fetch receipt for all txs in the log
   */
  async fetchReceipts(provider: Provider): Promise<LogTx[]> {
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
