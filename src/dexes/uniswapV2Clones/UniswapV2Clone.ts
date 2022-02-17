import { ethers, Event } from "ethers";
import { Dex } from "../Dex";
import { swapEventToCsvRow } from "../../helpers/events";
import { SwapEventCallback, SwapRecord } from "../types";

export abstract class UniswapV2Clone extends Dex {
  abstract routerAddress: string;
  abstract factoryAddress: string;
  routerAbi = require("./abi/uniswapV2Router.json");
  pairAbi = require("./abi/uniswapV2Pair.json");

  /**
   * Fire the given callback everytime a swap is made
   * on the given pair
   */
  listenToSwap(pair: string, callback: SwapEventCallback): void {
    const pool = new ethers.Contract(pair, this.pairAbi, this.signerOrProvider);
    pool.on("Swap", callback);
  }

  /**
   * Return the list of swap events for the given pair.
   *
   * Docs: https://docs.ethers.io/v5/getting-started/#getting-started--history
   */
  async getSwapHistory(
    pair: string,
    fromBlock?: number,
    toBlock?: number
  ): Promise<Event[]> {
    const pool = new ethers.Contract(pair, this.pairAbi, this.signerOrProvider);
    const filter = pool.filters.Swap();
    return await pool.queryFilter(filter, fromBlock, toBlock);
  }

  /**
   * Return a table with the swap events for the given pair.
   */
  async getSwapHistoryTable(
    pair: string,
    fromBlock?: number,
    toBlock?: number
  ): Promise<SwapRecord[]> {
    const swapHistory = await this.getSwapHistory(pair, fromBlock, toBlock);
    return swapHistory.map(swapEventToCsvRow);
  }
}
