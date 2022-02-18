import { task } from "hardhat/config";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { wait } from "../../src/helpers/general";
import { getWebsocketProvider } from "../../src/helpers/providers";

task(
  "uniswapV2Clone:listenToBurns",
  "Listen to Burn events (remove liquidity) on the given Dex and pair."
)
  .addPositionalParam("dexName", "DEX to consider, e.g. UniswapV2")
  .addPositionalParam("pair", "Pair to spy")
  .setAction(async ({ dexName, pair }, hre) => {
    const provider = getWebsocketProvider(hre);
    const dex = new UniswapV2CloneFactory().create(
      dexName,
      provider,
      hre.network.name
    );
    dex.listenToBurn(pair, console.log);
    return wait();
  });
