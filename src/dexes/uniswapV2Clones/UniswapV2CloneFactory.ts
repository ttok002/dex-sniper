import { UniswapV2 } from "./UniswapV2";
import { TraderJoe } from "./TraderJoe";
import { UniswapV2Clone } from "./UniswapV2Clone";
import { Provider } from "@ethersproject/abstract-provider";
import { DexFactory } from "../DexFactory";

/**
 * Insert here the DEXes that the bot should support
 */
export class UniswapV2CloneFactory extends DexFactory {
  create(dexName: string, provider: Provider, network: string): UniswapV2Clone {
    // Create DEX instance
    let dex;
    switch (dexName) {
      case "UniswapV2":
        dex = new UniswapV2(provider);
        break;
      case "TraderJoe":
        dex = new TraderJoe(provider);
        break;
      default:
        throw new Error(`DEX ${dexName} not supported`);
    }
    // Validate the created DEX instance
    if (dex.supportedNetworks.indexOf(network) === -1) {
      throw new Error(
        `Dex ${dex.constructor.name} does not support network ${network}`
      );
    }
    return dex;
  }
}
