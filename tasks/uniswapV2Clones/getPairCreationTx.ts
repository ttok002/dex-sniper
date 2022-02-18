import { task } from "hardhat/config";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { getWebsocketProvider } from "../../src/helpers/providers";

task(
  "uniswapV2Clone:getPairCreationTx",
  "Given two tokens, get the tx at which the pair was created; order is important."
)
  .addPositionalParam("dexName", "DEX to consider, e.g. UniswapV2")
  .addPositionalParam("token0", "Address of the first token in the pair")
  .addPositionalParam("token1", "Address of the second token in the pair")
  .setAction(async ({ dexName, token0, token1 }, hre) => {
    const provider = getWebsocketProvider(hre);
    const dex = new UniswapV2CloneFactory().create(
      dexName,
      provider,
      hre.network.name
    );
    console.log(await dex.getPairCreationTx(token0, token1));
  });
