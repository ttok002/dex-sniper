import { getenv } from '../common/dotenv';
import { InvalidConfig, MissingConfig } from '../common/exceptions';
import { AccountConfig } from '../common/types';
import { validateKeyAddressPair } from './signers';

/**
 * Parse from .env the list of address-key pairs for the given
 * network.
 *
 * Each private key will be validated against its address,
 * which must also be contained in .env.
 */
export function parseAccountsConfigs(network: string): AccountConfig[] {
  const accounts: AccountConfig[] = [];
  for (let i = 1; true; i++) {
    const address = getenv(`USER_${i}_${network.toUpperCase()}_ADDRESS`);
    const key = getenv(`USER_${i}_${network.toUpperCase()}_PRIVATE_KEY`);
    // No more users, break with success
    if (!address && !key) {
      break;
    }
    // Key without address
    if (!address) {
      throw new MissingConfig(`Missing address for user ${i}`);
    }
    // Address without key
    if (!key) {
      throw new MissingConfig(`Missing key for user ${i}`);
    }
    // Validate key and address
    if (!validateKeyAddressPair(key, address)) {
      throw new InvalidConfig(`Private key of ${address} does not match address`);
    }
    accounts.push({ network, address, key });
  }
  return accounts;
}
