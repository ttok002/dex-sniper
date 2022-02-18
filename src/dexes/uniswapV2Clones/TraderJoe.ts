import { UniswapV2Clone } from "./UniswapV2Clone";

export class TraderJoe extends UniswapV2Clone {
  supportedNetworks: string[] = ["avalanche"];
  routerAddress = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";
  factoryAddress = "0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10";
  routerAbi = require("./abi/traderJoe/router.json");
  pairAbi = require("./abi/traderJoe/pair.json");
  factoryAbi = require("./abi/traderJoe/factory.json");
}
