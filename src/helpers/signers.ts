import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { getProvider } from './providers';
import { SignerError } from '../common/exceptions';
import { computeAddress } from 'ethers/lib/utils';

/**
 * TODO: Find a way to tell hardhat/ethers that we are using a
 * specific account, otherwise we always have to override
 * the 'from' tx parameter.
 */

/**
 * Return a wallet able to sign transactions, using
 * the private key corresponding to the given address
 */
export function getSigner(
  hre: HardhatRuntimeEnvironment,
  address: string,
  provider?: Provider
): Signer {
  if (!provider) {
    provider = getProvider(hre);
  }
  const { ethers } = hre;
  const key = getAccountFromAddress(hre, address);
  if (!key) {
    throw new SignerError(`Could not find account with address '${address}'`);
  }
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
 * Given an account ID, return its private key from the hardhat
 * configuration.
 *
 * @param {number | string} accountId - The ID of the account. It can be
 * either:
 * - The 1-based number of the account, for example 1 or 2, following the order
 *   in hardhat.config.js, which in turn comes from the ordering in .env
 * - The address of the account, where you can also specify just the first
 *   5 digits (if they are enough to identify the address).
 */
export function getAccount(
  hre: HardhatRuntimeEnvironment,
  accountId: number | string
): string | null {
  // Get registered private keys from hardhat config
  const privateKeys = getAccounts(hre);
  // Simple case: we have the account number
  if (typeof accountId === 'number') {
    if (accountId < 1 || accountId > privateKeys.length) {
      throw new SignerError(`Account with number ${accountId} does not exist`);
    }
    return privateKeys[accountId - 1];
  }
  // Hard case: we have a string with the address and need
  // to use it to recover the private key
  return getAccountFromAddress(hre, accountId);
}

/**
 * Given an address, return its private key from the hardhat
 * configuration, or null if it is not there.
 *
 * @param {string} address The address of the account, where you
 * can also specify just the first 5 digits, if they are enough
 * to identify the address.
 */
export function getAccountFromAddress(
  hre: HardhatRuntimeEnvironment,
  address: string
): string | null {
  const privateKeys = getAccounts(hre);
  const addresses = privateKeys.map(getAddressFromKey);
  // Make sure we have a reasonably-sized chunk of the address
  if (address.length < 5) {
    throw new SignerError('Address should contain at least 5 characters');
  }
  // List of the addresses that match
  const suitableAddresses = addresses.filter((a) => a.substring(0, address.length) === address);
  // Address not registered
  if (suitableAddresses.length === 0) {
    return null;
  }
  // Ambiguity is dangerous
  if (suitableAddresses.length > 1) {
    throw new SignerError(`Found ${suitableAddresses.length} addresses like ${address}!`);
  }
  // We have located the address
  const index = addresses.indexOf(suitableAddresses[0]);
  return privateKeys[index];
}

/**
 * Check that the given key corresponds to the provided address
 */
export function validateKeyAddressPair(key: string, address: string): boolean {
  const expectedAddress = getAddressFromKey(key);
  return address.toLowerCase() === expectedAddress.toLowerCase();
}

/**
 * Return the address given the private key
 */
export function getAddressFromKey(key: string) {
  // Ensure that the private key has the leading 0x
  if (key.match(/^[0-9a-f]*$/i) && key.length === 64) {
    key = '0x' + key;
  }
  return computeAddress(key);
}
