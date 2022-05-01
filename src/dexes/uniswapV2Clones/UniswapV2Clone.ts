import { Contract, ethers, Event, constants, BigNumber, logger } from 'ethers';
import { Dex } from '../Dex';
import {
  AddLiquidityMethodCallback,
  BurnEventCallback,
  MintEventCallback,
  PairCreatedEventCallback,
  SwapEventCallback,
} from '../types';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { isResponseFrom, isResponseTo } from '../../helpers/transactions';
import { TransactionDescription } from 'ethers/lib/utils';

export abstract class UniswapV2Clone extends Dex {
  abstract routerAddress: string;
  abstract factoryAddress: string;
  routerAbi = require('./abi/uniswapV2/router.json');
  pairAbi = require('./abi/uniswapV2/pair.json');
  factoryAbi = require('./abi/uniswapV2/factory.json');

  /*
   * =====================
   *        Getters
   * =====================
   */

  /**
   * Return the router contract
   */
  getRouter(): Contract {
    return new ethers.Contract(this.routerAddress.toLowerCase(), this.routerAbi, this.provider);
  }

  /**
   * Return the router contract with signing
   * powers
   */
  getRouterSigner(): Contract {
    this.validateSigner();
    return new ethers.Contract(this.routerAddress.toLowerCase(), this.routerAbi, this.signer);
  }

  /**
   * Return the factory contract
   */
  getFactory(): Contract {
    return new ethers.Contract(this.factoryAddress.toLowerCase(), this.factoryAbi, this.provider);
  }

  /**
   * Return the factory contract with signing
   * powers
   */
  getFactorySigner(): Contract {
    this.validateSigner();
    return new ethers.Contract(this.factoryAddress.toLowerCase(), this.factoryAbi, this.signer);
  }

  /**
   * Return the contract of a specific LP pair
   */
  getPair(pair: string): Contract {
    return new ethers.Contract(pair.toLowerCase(), this.pairAbi, this.provider);
  }

  /**
   * Return the contract of a specific LP pair
   * with signing powers
   */
  getPairSigner(pair: string): Contract {
    this.validateSigner();
    return new ethers.Contract(pair.toLowerCase(), this.pairAbi, this.signer);
  }

  /**
   * Throw an error if the dex cannot sign transactions
   */
  validateSigner() {
    if (!this.signer) {
      throw new Error('Signer not found!');
    }
  }

  /*
   * =====================
   *       Listeners
   * =====================
   */

  /**
   * Fire the given callback every time a Swap event is
   * emitted for the given pair
   */
  listenToSwap(pair: string, callback: SwapEventCallback): void {
    this.getPair(pair).on('Swap', callback);
  }

  /**
   * Fire the given callback everytime a Mint (add liquidity)
   * is made on the given pair
   */
  listenToMint(pair: string, callback: MintEventCallback): void {
    this.getPair(pair).on('Mint', callback);
  }

  /**
   * Fire the given callback the next time a Mint (add liquidity)
   * is made on the given pair
   */
  listenToMintOnce(pair: string, callback: MintEventCallback): void {
    this.getPair(pair).once('Mint', callback);
  }

  /**
   * Fire the given callback everytime a Burn (remove liquidity)
   * is made on the given pair
   */
  listenToBurn(pair: string, callback: BurnEventCallback): void {
    this.getPair(pair).on('Burn', callback);
  }

  /**
   * Fire the given callback everytime a new pair is
   * created
   */
  listenToPairCreated(callback: PairCreatedEventCallback): void {
    this.getFactory().on('PairCreated', callback);
  }

  /*
   * =====================
   *         Logs
   * =====================
   */

  /**
   * Return the list of Swap events for the given pair.
   *
   * Docs: https://docs.ethers.io/v5/getting-started/#getting-started--history
   */
  async getSwapHistory(pair: string, fromBlock?: number, toBlock?: number): Promise<Event[]> {
    const pool = this.getPair(pair);
    const filter = pool.filters.Swap();
    return await pool.queryFilter(filter, fromBlock, toBlock);
  }

  /**
   * Return the list of Mint events (liquidity add) for the given
   * pair.
   */
  async getMintHistory(pair: string, fromBlock?: number, toBlock?: number): Promise<Event[]> {
    const pool = this.getPair(pair);
    const filter = pool.filters.Mint();
    return await pool.queryFilter(filter, fromBlock, toBlock);
  }

  /**
   * Return the transaction that created the pair consisting of
   * the given tokens.
   *
   * Order is important.
   */
  async getPairCreationTx(token0: string, token1: string): Promise<TransactionReceipt> {
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
  async getPairCreationHistory(fromBlock?: number, toBlock?: number): Promise<Event[]> {
    const factory = this.getFactory();
    const filter = factory.filters.PairCreated();
    return await factory.queryFilter(filter, fromBlock, toBlock);
  }

  /*
   * =====================
   *       Utilities
   * =====================
   */

  /**
   * Return the reserves in the pool.
   *
   * Docs: https://docs.uniswap.org/protocol/V2/reference/smart-contracts/pair#getreserves
   */
  async getReserves(pair: string): Promise<number[]> {
    const pool = this.getPair(pair);
    return await pool.getReserves();
  }

  /**
   * Given the addresses of two tokens, return the address
   * of the corresponding liquidity pair, if it exists.
   *
   * Returns null if there is no such pair.
   */
  async getPairAddress(token0: string, token1: string, checksum = false): Promise<string | null> {
    const factory = this.getFactory();
    const pairAddress = await factory.getPair(token0, token1);
    if (pairAddress === constants.AddressZero) {
      return null;
    }
    return checksum ? pairAddress : pairAddress.toLowerCase();
  }

  /**
   * Given an amount you would like to sell on the pair token0-token1,
   * return the estimated amount of token1 you would get with said swap.
   *
   * Does not support routing through multiple pairs.
   */
  async getAmountsOut(amountIn: BigNumber, token0: string, token1: string): Promise<BigNumber[]> {
    const router = this.getRouter();
    const amountsOut = await router.getAmountsOut(amountIn, [token0, token1]);
    return amountsOut;
  }

  /*
   * =====================
   *       Mempool
   * =====================
   */

  /**
   * Fire the given callback every time a transaction
   * directed at the router enters the mempool.
   *
   * Optionally consider only the transactions from the 'from'
   * address.
   */
  listenToRouterPendingTxs(
    callback: (t: TransactionDescription) => void,
    from: string | null = null,
    routerAddress: string = this.routerAddress
  ): void {
    this.provider.on('pending', async (txHash: string) => {
      const res = await this.provider.getTransaction(txHash);
      if (!isResponseTo(res, routerAddress)) {
        return null;
      }
      if (from && !isResponseFrom(res, from)) {
        return null;
      }
      callback(this.getRouter().interface.parseTransaction(res));
    });
  }
}
