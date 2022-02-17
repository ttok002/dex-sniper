import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

/**
 * Class representing a DEX with which we interact
 * via scripts.
 */
export abstract class Dex {
  /**
   * The DEX object contains the provider (if it just needs
   * to read) or the signer (if it also needs to write)
   */
  signerOrProvider?: Signer | Provider;

  /**
   * List of networks supported by the DEX (ethereum,
   * avalanche, etc)
   */
  abstract supportedNetworks: string[];

  constructor(signerOrProvider?: Signer | Provider) {
    this.signerOrProvider = signerOrProvider;
  }

  /**
   * Return true if the DEX supports the given network
   */
  supportsNetwork(network: string) {
    return this.supportedNetworks.indexOf(network) !== -1;
  }
}
