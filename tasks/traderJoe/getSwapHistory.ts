/**
 * Get historical swaps for the given pair on Trader Joe
 */

import { task, types } from "hardhat/config";
import { TraderJoe } from "../../src/dexes/uniswapV2Clones/TraderJoe";
import { getWebsocketProvider } from "../../src/helpers/providers";
import { getBlockRange } from "../../src/helpers/blocks";

task(
  "traderJoe:getSwapHistory",
  "Get historical swaps for the given pair on Trader Joe."
)
  .addOptionalPositionalParam(
    "pair",
    "Pair to analyze, default is USDC.e-WAVAX",
    "0xa389f9430876455c36478deea9769b7ca4e3ddb1" // USDC.e-WAVAX pair
  )
  .addOptionalParam("n", "Number of blocks to get", 1, types.int)
  .setAction(async ({ pair, n }, hre) => {
    const provider = getWebsocketProvider("avalanche", hre);
    const dex = new TraderJoe(provider);
    const [fromBlock, toBlock] = await getBlockRange(n, provider);
    // const swaps = await dex.getSwapHistory(pair, fromBlock, toBlock);
    const swaps = await dex.getSwapHistoryTable(pair, fromBlock, toBlock);
    console.log(swaps);
  });
