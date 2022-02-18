import { Contract, ethers, Event } from "ethers";
import { Dex } from "../Dex";
import { swapEventToCsvRow } from "../../helpers/events";
import { SwapEventCallback, SwapRecord } from "../types";
import { TransactionReceipt } from "@ethersproject/abstract-provider";

export abstract class UniswapV2Clone extends Dex {
  abstract routerAddress: string;
  abstract factoryAddress: string;
  routerAbi = require("./abi/uniswapV2/router.json");
  pairAbi = require("./abi/uniswapV2/pair.json");
  factoryAbi = require("./abi/uniswapV2/factory.json");

  /**
   * Return the router contract
   */
  getRouter(): Contract {
    return new ethers.Contract(
      this.routerAddress,
      this.routerAbi,
      this.signerOrProvider
    );
  }

  /**
   * Return the factory contract
   */
  getFactory(): Contract {
    return new ethers.Contract(
      this.factoryAddress,
      this.factoryAbi,
      this.signerOrProvider
    );
  }

  /**
   * Return the contract of a specific LP pair
   */
  getPair(pair: string): Contract {
    return new ethers.Contract(pair, this.pairAbi, this.signerOrProvider);
  }

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
    const pool = this.getPair(pair);
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

  /**
   * Return the transaction that created the pair consisting of
   * the given tokens.
   *
   * Order is important.
   */
  async getPairCreationTx(
    token0: string,
    token1: string
  ): Promise<TransactionReceipt> {
    const factory = this.getFactory();
    const filter = factory.filters.PairCreated(token0, token1, null, null);
    const events = await factory.queryFilter(filter);
    if (events.length === 0) {
      throw new Error(
        `PairCreated event NOT found for pair ${token0} - ${token1}. Try inverting the tokens?`
      );
    } else if (events.length > 1) {
      console.log(
        `More than one PairCreated event found for pair ${token0} - ${token1}, will return the first`
      );
    }
    return events[0].getTransactionReceipt();
  }

  /**
   * Return the list of pair creation events.
   */
  async getPairCreationHistory(
    fromBlock?: number,
    toBlock?: number
  ): Promise<Event[]> {
    const factory = this.getFactory();
    const filter = factory.filters.PairCreated();
    return await factory.queryFilter(filter, fromBlock, toBlock);
  }
}
