import { task } from "hardhat/config";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { wait } from "../../src/helpers/general";
import { getProvider } from "../../src/helpers/providers";

task(
  "uniswapV2Clone:listenToPairCreated",
  "Listen to PairCreated events on the given Dex."
)
  .addPositionalParam("dexName", "DEX to consider, e.g. UniswapV2")
  .setAction(async ({ dexName }, hre) => {
    const provider = getProvider(hre);
    const dex = new UniswapV2CloneFactory().create(
      dexName,
      provider,
      hre.network.name
    );
    dex.listenToPairCreated(console.log);
    return wait();
  });
