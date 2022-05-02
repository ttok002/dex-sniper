import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider';

export interface LogTx {
  id: number; // internal id in the log
  hash: string;
  tags: string[];
  blockNumber?: number;
  receipt?: TransactionReceipt;
}
