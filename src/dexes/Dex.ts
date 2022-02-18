import { Provider } from "@ethersproject/providers";

/**
 * Class representing a DEX with which we interact
 * via scripts.
 */
export abstract class Dex {
  /**
   * The DEX object must contains the provider used to
   * read the contracts
   */
  provider?: Provider;

  /**
   * List of networks supported by the DEX (ethereum,
   * avalanche, etc)
   */
  abstract supportedNetworks: string[];

  constructor(provider?: Provider) {
    this.provider = provider;
  }

  /**
   * Return true if the DEX supports the given network
   */
  supportsNetwork(network: string) {
    return this.supportedNetworks.indexOf(network) !== -1;
  }
}
