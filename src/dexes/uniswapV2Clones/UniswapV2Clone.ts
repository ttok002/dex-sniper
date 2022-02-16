import { Dex } from "../Dex";
import { getWebsocketProvider } from "../../helpers/providers";
import { swapEventCallback } from "./types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export abstract class UniswapV2Clone extends Dex {
  routerAddress: string = "";
  factoryAddress: string = "";
  routerAbi = require("./abi/uniswapV2Router.json");
  pairAbi = require("./abi/uniswapV2Pair.json");

  /**
   * Fire the given callback everytime a swap is made
   * on the given pair
   */
  listenToSwap(
    pair: string,
    hre: HardhatRuntimeEnvironment,
    callback: swapEventCallback
  ): void {
    const provider = getWebsocketProvider(this.network, hre);
    const pool = new hre.ethers.Contract(pair, this.pairAbi, provider);
    pool.on("Swap", callback);
  }
}
