import { LogTx, TxTiming } from './types';
import { Provider } from '@ethersproject/providers';

/**
 * Track transactions on the fly to allow for later
 * analysis.
 *
 * TODO: Use uuid for the ids
 */
export class TxTracker {
  txs: LogTx[] = [];
  t0: number = Date.now();

  /**
   * Log a transaction.
   *
   * Optionally, set doubleCheck=true not to add the transaction if it
   * already exists in the log.
   *
   * @returns {number} The ID of the added tx in the log,
   * 0 if the tx was not added.
   */
  add(txHash: string, tags: string[], doubleCheck = false): number {
    if (doubleCheck && this.findTx(txHash)) {
      return 0;
    }
    const id = this.txs.length + 1;
    this.txs.push({
      id: id,
      hash: txHash,
      tags,
      timings: [],
    });
    this.addTiming(id, 'start');
    return id;
  }

  /**
   * Update the hash and tags of the given transaction; does
   * not fetch the tx receipt.
   */
  update(id: number, txHash: string | null = null, tags: string[] | null = null) {
    const tx = this.getTx(id);
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
   * Add a timing to the transaction with the given ID.
   *
   * @returns {TxTiming[]} The timings of the transaction, so far
   */
  addTiming(id: number, stepName: string): TxTiming[] {
    const tx = this.getTx(id);
    const tNow = Date.now();
    tx.timings.push({
      label: stepName,
      absolute: tNow,
      sinceStart: tNow - this.t0,
      sinceFirst: tNow - (tx.timings[0]?.absolute ?? tNow),
      sinceLast: tNow - (tx.timings[tx.timings.length - 1]?.absolute ?? tNow),
    });
    return tx.timings;
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
   * @returns {number} The ID of the first transaction in the
   * log with the given hash, or -1 if not found.
   */
  findTx(txHash: string): number {
    const txHashes = this.txs.map((t) => t.hash);
    const position = txHashes.indexOf(txHash);
    if (position === -1) {
      return -1;
    }
    return this.txs[position].id;
  }

  /**
   * Return the first transaction with the given hash
   */
  getTxByHash(txHash: string): LogTx {
    const id = this.findTx(txHash);
    return this.getTx(id);
  }

  /**
   * Return one line with all the timings of the transaction with
   * the given ID
   */
  formatTimings(id: number, delimiter = '|'): string {
    const tx = this.getTx(id);
    const data = tx.timings.map((t, i) => {
      if (i === 0) {
        return `${t.label}=${t.sinceStart}`;
      }
      return `${t.label}=+${t.sinceFirst}ms`;
    });
    return data.join(delimiter);
  }

  /**
   * Return all txs with the given tags,
   * preserving order
   */
  getTxsByTag(tags: string[]) {
    const allTxs = this.getAllTxs();
    const filteredTxs: LogTx[] = [];
    for (let i = 0; i < allTxs.length; i++) {
      const tx = allTxs[i];
      const intersection = tags.filter((tag) => tx.tags.includes(tag));
      if (intersection.length) {
        filteredTxs.push(tx);
      }
    }
    return filteredTxs;
  }

  /**
   * Attach receipt to the given txs
   *
   * @returns The txs with the receipt attached
   */
  static async fetchReceipts(txs: LogTx[], provider: Provider): Promise<LogTx[]> {
    for (let i = 0; i < txs.length; i++) {
      const logTx = txs[i];
      if (!logTx.hash) {
        continue;
      }
      if (!logTx.receipt) {
        logTx.receipt = await provider.waitForTransaction(logTx.hash);
      }
      logTx.blockNumber = logTx.receipt.blockNumber;
    }
    return txs;
  }

  /**
   * Attach receipt to all the transactions in the log
   *
   * @returns The txs with the receipt attached
   */
  async fetchAllReceipts(provider: Provider): Promise<LogTx[]> {
    return TxTracker.fetchReceipts(this.txs, provider);
  }
}
