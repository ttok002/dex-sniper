import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

/**
 * Class representing a DEX with which we interact
 * via scripts.
 */
export abstract class Dex {
  /**
   * The DEX object must contain the provider used to
   * read the contracts
   */
  provider: Provider;

  /**
   * If the DEX object contains a signer it will be able
   * to send transactions
   */
  signer?: Signer;

  /**
   * List of networks supported by the DEX (ethereum,
   * avalanche, etc)
   */
  abstract supportedNetworks: string[];

  constructor(provider: Provider, signer?: Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  /**
   * Return true if the DEX supports the given network
   */
  supportsNetwork(network: string) {
    return this.supportedNetworks.indexOf(network) !== -1;
  }
}
