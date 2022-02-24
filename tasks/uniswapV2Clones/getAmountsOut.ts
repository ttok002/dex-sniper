import { ethers } from "ethers";
import { task, types } from "hardhat/config";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { printAmounts } from "../../src/helpers/print";
import { getProvider } from "../../src/helpers/providers";

task(
  "uniswapV2Clone:getAmountsOut",
  "Wrapper to the function getAmountsOut (https://docs.uniswap.org/protocol/V2/reference/smart-contracts/library#getamountsout)"
)
  .addPositionalParam("dexName", "DEX to consider, e.g. UniswapV2")
  .addPositionalParam(
    "amountIn",
    "Amount of tokens you wish to sell (formatted, not BigNumber)"
  )
  .addPositionalParam("token0", "1st token in the pair (in token)")
  .addPositionalParam("token1", "2nd token in the pair (out token)")
  .addOptionalParam("digits0", "Decimals of the in token", 18, types.int)
  .addOptionalParam("digits1", "Decimals of the out token", 18, types.int)
  .setAction(
    async ({ dexName, amountIn, token0, token1, digits0, digits1 }, hre) => {
      const provider = getProvider(hre);
      const dex = new UniswapV2CloneFactory().create(
        dexName,
        provider,
        hre.network.name
      );
      const amounts = await dex.getAmountsOut(
        ethers.utils.parseUnits(amountIn + "", digits0),
        token0,
        token1
      );
      printAmounts(amounts, digits0, digits1);
    }
  );
