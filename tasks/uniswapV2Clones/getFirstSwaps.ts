import { task, types } from "hardhat/config";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { getProvider } from "../../src/helpers/providers";
// @ts-ignore
import ObjectsToCsv from "objects-to-csv";

task(
  "uniswapV2Clone:getFirstSwaps",
  "Get the first ever swaps for the given pair"
)
  .addPositionalParam("dexName", "DEX to consider, e.g. UniswapV2")
  .addPositionalParam("pair", "Address of the pair to analyze")
  .addPositionalParam("token0", "Address of the first token in the pair")
  .addPositionalParam("token1", "Address of the second token in the pair")
  .addOptionalParam("nblocks", "Number of blocks to get", 10, types.int)
  .addOptionalParam("csv", "Optionally dump table to this file as CSV")
  .addOptionalParam("digits0", "1st token digits", 18, types.int)
  .addOptionalParam("digits1", "2nd token digits", 18, types.int)
  .setAction(
    async (
      { dexName, pair, token0, token1, nblocks, csv, digits0, digits1 },
      hre
    ) => {
      const provider = getProvider(hre);
      const dex = new UniswapV2CloneFactory().create(
        dexName,
        provider,
        hre.network.name
      );
      const creationTx = await dex.getPairCreationTx(token0, token1);
      console.log(`>>> PAIR CREATED ON BLOCK ${creationTx.blockNumber}`);
      const fromBlock = creationTx.blockNumber;
      const toBlock = fromBlock + nblocks;
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
