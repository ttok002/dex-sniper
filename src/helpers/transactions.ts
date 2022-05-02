import { TransactionResponse } from '@ethersproject/abstract-provider';

/**
 * Return true if the given transaction (response) came
 * from the given address
 */
export function isResponseFrom(res: TransactionResponse, address: string): boolean {
  return res && res?.from?.toLowerCase() === address.toLowerCase();
}

/**
 * Return true if the given transaction (response) had
 * the given recipient address
 */
export function isResponseTo(res: TransactionResponse, address: string): boolean {
  return res && res?.to?.toLowerCase() === address.toLowerCase();
}

/**
 * Return true if the given transaction (response) came
 * from a mempool transaction
 */
export function isResponsePending(res: TransactionResponse): boolean {
  return res && res?.confirmations === 0;
}
