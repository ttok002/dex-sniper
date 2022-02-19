import { task, types } from "hardhat/config";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { getProvider } from "../../src/helpers/providers";
// @ts-ignore
import ObjectsToCsv from "objects-to-csv";

task(
  "uniswapV2Clone:getSwaps",
  "Get swaps for the given pair after a certain block"
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
  .setAction(
    async (
      { dexName, pair, fromblock, nblocks, csv, digits0, digits1 },
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
      const swaps = await dex.getSwapHistoryTable({
        pair,
        fromBlock,
        toBlock,
        digits0,
        digits1,
      });
      if (!csv) {
        console.log(swaps);
        return;
      }
      const csvFile = new ObjectsToCsv(swaps);
      await csvFile.toDisk(csv);
      console.log(`Output saved to file ${csv}`);
    }
  );
