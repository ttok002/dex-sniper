import { AccountConfig } from './types';
import { parseAccountsConfigs } from '../helpers/config';

/**
 * List of configured accounts from .env
 */
export const accounts: AccountConfig[] = [
  ...parseAccountsConfigs('avalanche'),
  ...parseAccountsConfigs('ethereum'),
  ...parseAccountsConfigs('cronos'),
];

/**
 * Get accounts for a given network
 */
export function getNetworkAccounts(network: string): AccountConfig[] {
  return accounts.filter((a) => a.network === network);
}
