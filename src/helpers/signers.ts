import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { getenv } from '../common/dotenv';
import { getProvider } from './providers';
import { InvalidConfig, MissingConfig, SignerError } from '../common/exceptions';
import { computeAddress } from 'ethers/lib/utils';

/**
 * Return a wallet able to sign transactions, using
 * the first private key provided for the current network
 */
export function getSigner(
  hre: HardhatRuntimeEnvironment,
  accountNumber: number,
  provider?: Provider
): Signer {
  if (!provider) {
    provider = getProvider(hre);
  }
  const { network, ethers } = hre;
  const accounts = getAccounts(hre);
  if (accountNumber < 1 || accountNumber > accounts.length) {
    throw new SignerError(`Account with number ${accountNumber} does not exist`);
  }
  const key = (network as any).config.accounts[accountNumber - 1] as string;
  return new ethers.Wallet(key, provider);
}

/**
 * Get list of registered accounts for the current
 * network.
 */
export function getAccounts({ network }: HardhatRuntimeEnvironment): string[] {
  return (network as any).config.accounts as string[];
}

/**
 * Return the list of private keys for the given
 * network.
 */
export function parseAccounts(network: string): string[] {
  const accounts = [];
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
    accounts.push(key);
  }
  return accounts;
}

/**
 * Check that the given key corresponds to the provided address
 */
export function validateKeyAddressPair(key: string, address: string): boolean {
  // Ensure that the private key has the leading 0x
  if (key.match(/^[0-9a-f]*$/i) && key.length === 64) {
    key = '0x' + key;
  }
  const expectedAddress = computeAddress(key);
  return address.toLowerCase() === expectedAddress.toLowerCase();
}
