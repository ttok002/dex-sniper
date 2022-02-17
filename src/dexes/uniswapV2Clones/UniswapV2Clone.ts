import { ethers } from "ethers";
import { Dex } from "../Dex";
import { swapEventCallback } from "./types";

export abstract class UniswapV2Clone extends Dex {
  abstract routerAddress: string;
  abstract factoryAddress: string;
  routerAbi = require("./abi/uniswapV2Router.json");
  pairAbi = require("./abi/uniswapV2Pair.json");

  /**
   * Fire the given callback everytime a swap is made
   * on the given pair
   */
  listenToSwap(pair: string, callback: swapEventCallback): void {
    const pool = new ethers.Contract(pair, this.pairAbi, this.signerOrProvider);
    pool.on("Swap", callback);
  }
}
