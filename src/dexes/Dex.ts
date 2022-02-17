import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

/**
 * Class representing a DEX with which we interact
 * via scripts.
 */
export abstract class Dex {
  signerOrProvider?: Signer | Provider;

  constructor(signerOrProvider?: Signer | Provider) {
    this.signerOrProvider = signerOrProvider;
  }
}
