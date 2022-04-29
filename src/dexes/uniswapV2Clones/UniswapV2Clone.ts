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

export abstract class UniswapV2Clone extends Dex {
  abstract routerAddress: string;
  abstract factoryAddress: string;
  routerAbi = require('./abi/uniswapV2/router.json');
  pairAbi = require('./abi/uniswapV2/pair.json');
  factoryAbi = require('./abi/uniswapV2/factory.json');

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
   * Fire the given callback every time a Swap event is
   * emitted for the given pair
   */
  listenToSwap(pair: string, callback: SwapEventCallback): void {
    this.getPair(pair).on('Swap', callback);
  }

  /**
   * Fire the given callback every time an addLiquidity transaction
   * directed at the router enters the mempool.
   *
   * Optionally filter the transactions by the 'from'
   * address.
   *
   * TODO: Support both addLiquidity and addLiquidityAVAX
   */
  listenToPendingAddLiquidity(
    callback: AddLiquidityMethodCallback,
    from: string | null = null,
    routerAddress: string = this.routerAddress
  ): void {
    // Listen to all pending transactions
    this.provider.on('pending', async (txHash: string) => {
      const res = await this.provider.getTransaction(txHash);
      // Pick only txs to the router
      if (!isResponseTo(res, routerAddress)) {
        return;
      }
      // Optionally filter by sender
      if (from && !isResponseFrom(res, from)) {
        return;
      }
      // Parse transaction
      const parsedTx = this.getRouter().interface.parseTransaction(res);
      // Return if the transaction is not an addLiquidity
      if (parsedTx.functionFragment.name !== 'addLiquidity') {
        return;
      }
      logger.info('>>> ARGS');
      logger.info(parsedTx.args);
      // callback();
    });
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
   * Return the reserves in the pool.
   *
   * Docs: https://docs.uniswap.org/protocol/V2/reference/smart-contracts/pair#getreserves
   */
  async getReserves(pair: string): Promise<number[]> {
    const pool = this.getPair(pair);
    return await pool.getReserves();
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

  /**
   * Throw an error if the dex cannot sign transactions
   */
  validateSigner() {
    if (!this.signer) {
      throw new Error('Signer not found!');
    }
  }
}
