/**
 * Listen to swaps on Trader Joe
 */

import { task } from "hardhat/config";
import { TraderJoe } from "../../src/dexes/uniswapV2Clones/TraderJoe";
import { printSwapEvent } from "../../src/helpers/debug";
import { wait } from "../../src/helpers/general";
import { getProvider } from "../../src/helpers/providers";

task("traderJoe:listenToSwap", "Listen to swaps on Trader Joe.")
  .addOptionalPositionalParam(
    "pair",
    "Pair to spy, default is USDC.e-WAVAX",
    "0xa389f9430876455c36478deea9769b7ca4e3ddb1" // USDC.e-WAVAX pair
  )
  .setAction(async ({ pair }, hre) => {
    const dex = new TraderJoe(getProvider(hre));
    dex.listenToSwap(pair, printSwapEvent);
    return wait();
  });
