import { UniswapV2Clone } from "./UniswapV2Clone";

export class TraderJoe extends UniswapV2Clone {
  network = "avalanche";
  routerAddress = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";
  factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  routerAbi = require("./abi/traderJoeRouter.json");
  pairAbi = require("./abi/traderJoePair.json");
}
