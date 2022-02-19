import { Contract, ethers, Event } from "ethers";
import { Dex } from "../Dex";
import { mintEventToCsvRow } from "../../helpers/mints";
import { swapEventToCsvRow } from "../../helpers/swaps";
import {
  BurnEventCallback,
  MintEventCallback,
  MintRecordRaw,
  PairCreatedEventCallback,
  SwapEventCallback,
  SwapRecordRaw,
} from "../types";
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
      this.routerAddress.toLowerCase(),
      this.routerAbi,
      this.provider
    );
  }

  /**
   * Return the factory contract
   */
  getFactory(): Contract {
    return new ethers.Contract(
      this.factoryAddress.toLowerCase(),
      this.factoryAbi,
      this.provider
    );
  }

  /**
   * Return the contract of a specific LP pair
   */
  getPair(pair: string): Contract {
    return new ethers.Contract(pair.toLowerCase(), this.pairAbi, this.provider);
  }

  /**
   * Fire the given callback everytime a Swap is made
   * on the given pair
   */
  listenToSwap(pair: string, callback: SwapEventCallback): void {
    this.getPair(pair).on("Swap", callback);
  }

  /**
   * Fire the given callback everytime a Mint (add liquidity)
   * is made on the given pair
   */
  listenToMint(pair: string, callback: MintEventCallback): void {
    this.getPair(pair).on("Mint", callback);
  }

  /**
   * Fire the given callback everytime a Burn (remove liquidity)
   * is made on the given pair
   */
  listenToBurn(pair: string, callback: BurnEventCallback): void {
    this.getPair(pair).on("Burn", callback);
  }

  /**
   * Fire the given callback everytime a new pair is
   * created
   */
  listenToPairCreated(callback: PairCreatedEventCallback): void {
    this.getFactory().on("PairCreated", callback);
  }

  /**
   * Return the list of Swap events for the given pair.
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
   * Return a table with the Swap events for the given pair.
   */
  async getSwapHistoryTable({
    pair,
    fromBlock,
    toBlock,
    digits0,
    digits1,
  }: {
    pair: string;
    fromBlock?: number;
    toBlock?: number;
    digits0?: number;
    digits1?: number;
  }): Promise<SwapRecordRaw[]> {
    const swapHistory = await this.getSwapHistory(pair, fromBlock, toBlock);
    return swapHistory.map((s) => swapEventToCsvRow(s, digits0, digits1));
  }

  /**
   * Return the list of Mint events (liquidity add) for the given
   * pair.
   */
  async getMintHistory(
    pair: string,
    fromBlock?: number,
    toBlock?: number
  ): Promise<Event[]> {
    const pool = this.getPair(pair);
    const filter = pool.filters.Mint();
    return await pool.queryFilter(filter, fromBlock, toBlock);
  }

  /**
   * Return a table with the Mint events for the given pair.
   */
  async getMintHistoryTable({
    pair,
    fromBlock,
    toBlock,
    digits0,
    digits1,
  }: {
    pair: string;
    fromBlock?: number;
    toBlock?: number;
    digits0?: number;
    digits1?: number;
  }): Promise<MintRecordRaw[]> {
    const mintHistory = await this.getMintHistory(pair, fromBlock, toBlock);
    return mintHistory.map((s) => mintEventToCsvRow(s, digits0, digits1));
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
    const filter = factory.filters.PairCreated(
      token0.toLowerCase(),
      token1.toLowerCase(),
      null,
      null
    );
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
