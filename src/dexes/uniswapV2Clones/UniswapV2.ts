import { UniswapV2Clone } from "./UniswapV2Clone";

export class UniswapV2 extends UniswapV2Clone {
  network = "ethereum";
  routerAddress = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";
  factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  routerAbi = require("./abi/uniswapV2Router.json");
  pairAbi = require("./abi/uniswapV2Pair.json");
}
