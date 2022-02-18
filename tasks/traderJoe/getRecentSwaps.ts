import { task, types } from "hardhat/config";
import { TraderJoe } from "../../src/dexes/uniswapV2Clones/TraderJoe";
import { getProvider } from "../../src/helpers/providers";
import { getMostRecentBlocksRange } from "../../src/helpers/blocks";
// @ts-ignore
import ObjectsToCsv from "objects-to-csv";

task(
  "traderJoe:getRecentSwaps",
  "Get recent swaps for the given pair on Trader Joe."
)
  .addOptionalPositionalParam(
    "pair",
    "Pair to analyze, default is USDC.e-WAVAX",
    "0xa389f9430876455c36478deea9769b7ca4e3ddb1" // USDC.e-WAVAX pair
  )
  .addOptionalParam("n", "Number of blocks to get", 1, types.int)
  .addOptionalParam("csv", "Dump table to given file in CSV format")
  .setAction(async ({ pair, n, csv }, hre) => {
    const provider = getProvider(hre);
    const dex = new TraderJoe(provider);
    const [fromBlock, toBlock] = await getMostRecentBlocksRange(n, provider);
    const swaps = await dex.getSwapHistoryTable({ pair, fromBlock, toBlock });
    if (!csv) {
      console.log(swaps);
      return;
    }
    const csvFile = new ObjectsToCsv(swaps);
    await csvFile.toDisk(csv);
    console.log(`Ouptut saved to file ${csv}`);
  });
