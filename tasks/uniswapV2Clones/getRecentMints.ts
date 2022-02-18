import { task, types } from "hardhat/config";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { getProvider } from "../../src/helpers/providers";
import { getMostRecentBlocksRange } from "../../src/helpers/blocks";
// @ts-ignore
import ObjectsToCsv from "objects-to-csv";

task("uniswapV2Clone:getRecentMints", "Get recent mints for the given pair")
  .addPositionalParam("dexName", "DEX to consider, e.g. UniswapV2")
  .addPositionalParam("pair", "Address of the pair to analyze")
  .addOptionalParam("nblocks", "Number of blocks to get", 10, types.int)
  .addOptionalParam("csv", "Dump table to given file in CSV format")
  .addOptionalParam("digits0", "1st token digits", 18, types.int)
  .addOptionalParam("digits1", "2nd token digits", 18, types.int)
  .setAction(async ({ dexName, pair, nblocks, csv, digits0, digits1 }, hre) => {
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
    const mints = await dex.getMintHistoryTable({
      pair,
      fromBlock,
      toBlock,
      digits0,
      digits1,
    });
    if (!csv) {
      console.log(mints);
      return;
    }
    const csvFile = new ObjectsToCsv(mints);
    await csvFile.toDisk(csv);
    console.log(`Output saved to file ${csv}`);
  });
