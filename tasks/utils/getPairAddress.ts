import { task } from "hardhat/config";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { getProvider } from "../../src/helpers/providers";

task(
  "utils:getPairAddress",
  "Print the address of the liquidity pair corrisponding to the two given tokens. The order of the tokens is interchangeable."
)
  .addPositionalParam("dexName", "DEX to consider, e.g. UniswapV2")
  .addPositionalParam("token0", "1st token in the pair")
  .addPositionalParam("token1", "2nd token in the pair")
  .setAction(async ({ dexName, token0, token1 }, hre) => {
    const provider = getProvider(hre);
    const dex = new UniswapV2CloneFactory().create(
      dexName,
      provider,
      hre.network.name
    );
    const pairAddress = await dex.getPairAddress(token0, token1);
    console.log(pairAddress || "Pair not found.");
  });
