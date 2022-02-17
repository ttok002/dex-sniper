import { task, types } from "hardhat/config";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { getWebsocketProvider } from "../../src/helpers/providers";
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
  .setAction(async ({ dexName, pair, token0, token1, nblocks, csv }, hre) => {
    const provider = getWebsocketProvider(hre);
    const dex = new UniswapV2CloneFactory().create(
      dexName,
      provider,
      hre.network.name
    );
    const creationTx = await dex.getPairCreationTx(token0, token1);
    const fromBlock = creationTx.blockNumber;
    const swaps = await dex.getSwapHistoryTable(
      pair,
      fromBlock,
      fromBlock + nblocks
    );
    if (!csv) {
      console.log(swaps);
      return;
    }
    const csvFile = new ObjectsToCsv(swaps);
    await csvFile.toDisk(csv);
    console.log(`Output saved to file ${csv}`);
  });
