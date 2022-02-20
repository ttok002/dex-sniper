import { task, types } from "hardhat/config";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { getProvider } from "../../src/helpers/providers";
// @ts-ignore
import ObjectsToCsv from "objects-to-csv";
import { getMintRecordStat } from "../../src/helpers/mints";

task(
  "uniswapV2Clone:getMints",
  "Get mints (liquidity add) for the given pair after a certain block"
)
  .addPositionalParam("dexName", "DEX to consider, e.g. UniswapV2")
  .addPositionalParam("pair", "Address of the pair to analyze")
  .addParam(
    "fromblock",
    "Block number from which to start",
    undefined,
    types.int
  )
  .addOptionalParam(
    "nblocks",
    "Number of blocks to get, you can use negative values to find earlier blocks",
    "10"
  )
  .addOptionalParam("csv", "Optionally dump table to this file as CSV")
  .addOptionalParam("digits0", "1st token digits", 18, types.int)
  .addOptionalParam("digits1", "2nd token digits", 18, types.int)
  .addOptionalParam(
    "maintoken",
    "Token you are more interested in; it will be shown first (0 or 1)",
    0,
    types.int
  )
  .setAction(
    async (
      { dexName, pair, fromblock, nblocks, csv, digits0, digits1, maintoken },
      hre
    ) => {
      const provider = getProvider(hre);
      const dex = new UniswapV2CloneFactory().create(
        dexName,
        provider,
        hre.network.name
      );
      const fromBlock = Math.min(fromblock, fromblock + parseInt(nblocks, 10));
      const toBlock = Math.max(fromblock, fromblock + parseInt(nblocks, 10));
      console.log(`fromBlock: ${fromBlock}`);
      console.log(`toBlock:   ${toBlock}`);
      const mintsHistory = await dex.getMintHistory(pair, fromBlock, toBlock);
      const mints = mintsHistory.map((e) =>
        getMintRecordStat(e, digits0, digits1, maintoken)
      );
      if (!csv) {
        console.log(mints);
        return;
      }
      const csvFile = new ObjectsToCsv(mints);
      await csvFile.toDisk(csv);
      console.log(`Output saved to file ${csv}`);
    }
  );
