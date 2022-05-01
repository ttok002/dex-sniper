import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider';

export interface logTx {
  hash: string;
  tags: string[];
  blockNumber?: number;
  receipt?: TransactionReceipt;
}
