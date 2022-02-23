import { BigNumber } from "ethers";
import { task, types } from "hardhat/config";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { wait } from "../../src/helpers/general";
import { getProvider } from "../../src/helpers/providers";
import { TransactionReceipt } from "@ethersproject/abstract-provider";

task(
  "uniswapV2Clone:snipeMints",
  "Listen to Mint events (add liquidity) on the given Dex and pair, and swap when that happens using swapExactTokensForTokens. IMPORTANT: here we assume the token we are swapping out has been preapproved."
)
  .addPositionalParam("dexName", "DEX to consider, e.g. UniswapV2")
  .addPositionalParam("pair", "Pair to spy")
  .addPositionalParam("tokenOut", "Address of token to buy")
  .addPositionalParam("amountIn", "How much you are willing to spend")
  .addOptionalParam(
    "slippage",
    "% you are willing to pay more compared to the price at them moment of the liquidity add",
    10.0,
    types.float
  )
  .setAction(async ({ dexName, pair, tokenOut, amountIn, slippage }, hre) => {
    const provider = getProvider(hre);
    const dex = new UniswapV2CloneFactory().create(
      dexName,
      provider,
      hre.network.name
    );
    dex.listenToMint(
      pair,
      (
        sender: string,
        amount0: BigNumber,
        amount1: BigNumber,
        tx: TransactionReceipt
      ) => {
        console.log(sender);
        console.log(tx);
      }
    );
    return wait();
  });
