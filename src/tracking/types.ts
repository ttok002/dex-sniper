import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider';

export interface LogTx {
  id: number; // internal id in the log
  hash: string;
  tags: string[];
  blockNumber?: number;
  timings: TxTiming[];
  receipt?: TransactionReceipt;
}

export interface TxTiming {
  label: string;
  absolute: number; // ms timestamp of insertion
  sinceStart: number; // ms diff since instantiating the tracker
  sinceFirst: number; // ms diff since first tx timing
  sinceLast: number; // ms diff since last tx timing
}
