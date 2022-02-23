import { UniswapV2Clone } from "./UniswapV2Clone";

export class TraderJoe extends UniswapV2Clone {
  supportedNetworks: string[] = ["avalanche"];
  routerAddress = "0x60aE616a2155Ee3d9A68541Ba4544862310933d4";
  factoryAddress = "0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10";
  routerAbi = require("./abi/traderJoe/router.json");
  pairAbi = require("./abi/traderJoe/pair.json");
  factoryAbi = require("./abi/traderJoe/factory.json");
}
