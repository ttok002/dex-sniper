import { task, types } from "hardhat/config";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { getProvider } from "../../src/helpers/providers";
import { getMostRecentBlocksRange } from "../../src/helpers/blocks";
// @ts-ignore
import ObjectsToCsv from "objects-to-csv";

task(
  "uniswapV2Clone:getRecentPairCreations",
  "Get recent pair creations for the given DEX"
)
  .addPositionalParam("dexName", "DEX to consider, e.g. UniswapV2")
  .addOptionalParam("nblocks", "Number of blocks to get", 10, types.int)
  .addOptionalParam("csv", "Dump table to given file in CSV format")
  .setAction(async ({ dexName, nblocks, csv }, hre) => {
    const provider = getProvider(hre);
    const dex = new UniswapV2CloneFactory().create(
      dexName,
      provider,
      hre.network.name
    );
    const [fromBlock, toBlock] = await getMostRecentBlocksRange(
      nblocks,
      provider
    );
    const swaps = await dex.getPairCreationHistory(fromBlock, toBlock);
    if (!csv) {
      console.log(swaps);
      return;
    }
    const csvFile = new ObjectsToCsv(swaps);
    await csvFile.toDisk(csv);
    console.log(`Output saved to file ${csv}`);
  });
