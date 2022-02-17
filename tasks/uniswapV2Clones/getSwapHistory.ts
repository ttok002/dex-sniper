/**
 * Get historical swaps for the given pair on the given Dex
 */

import { task, types } from "hardhat/config";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { getWebsocketProvider } from "../../src/helpers/providers";
import { getBlockRange } from "../../src/helpers/blocks";
// @ts-ignore
import ObjectsToCsv from "objects-to-csv";

task(
  "uniswapV2Clone:getSwapHistory",
  "Get historical swaps for the given pair."
)
  .addPositionalParam("dexName", "DEX to consider, e.g. UniswapV2")
  .addPositionalParam("pair", "Pair to analyze, default is USDC.e-WAVAX")
  .addOptionalParam("nblocks", "Number of blocks to get", 10, types.int)
  .addOptionalParam("csv", "Dump table to given file in CSV format")
  .setAction(async ({ pair, nblocks, csv, dexName }, hre) => {
    const provider = getWebsocketProvider(hre);
    const dex = new UniswapV2CloneFactory().create(
      dexName,
      provider,
      hre.network.name
    );
    const [fromBlock, toBlock] = await getBlockRange(nblocks, provider);
    const swaps = await dex.getSwapHistoryTable(pair, fromBlock, toBlock);
    if (!csv) {
      console.log(swaps);
      return;
    }
    const csvFile = new ObjectsToCsv(swaps);
    await csvFile.toDisk(csv);
    console.log(`Output saved to file ${csv}`);
  });
