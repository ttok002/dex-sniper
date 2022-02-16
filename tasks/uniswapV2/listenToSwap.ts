/**
 * Listen to swaps on Uniswap.
 */

import { task } from "hardhat/config";
import { UniswapV2 } from "../../src/dexes/uniswapV2Clones/UniswapV2";
import { printSwapEvent } from "../../src/helpers/debug";
import { wait } from "../../src/helpers/general";

task("uniswapV2:listenToSwap", "Listen to swaps on Uniswap.")
  .addOptionalPositionalParam(
    "pair",
    "Pair to spy, default is USDC-ETH",
    "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc" // USDC-ETH pair
  )
  .setAction(async ({ pair }, hre) => {
    const dex = new UniswapV2();
    dex.listenToSwap(pair, hre, printSwapEvent);
    return wait();
  });
