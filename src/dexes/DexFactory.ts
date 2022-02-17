import { Dex } from "./Dex";
import { Provider } from "@ethersproject/abstract-provider";

/**
 * Base class for the DEX factories.
 *
 * A DEX factory allows to choose the type of DEX to instantiate at
 * runtime, for example via a CLI parameter.
 */
export abstract class DexFactory {
  abstract create(dexName: string, provider: Provider, network: string): Dex;
}
