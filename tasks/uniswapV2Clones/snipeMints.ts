import { BigNumber, ethers } from "ethers";
import { task, types } from "hardhat/config";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { wait } from "../../src/helpers/general";
import { getProvider } from "../../src/helpers/providers";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { printMintEvent } from "../../src/helpers/debug";
import { getRelativePrice } from "../../src/helpers/swaps";

task(
  "uniswapV2Clone:snipeMints",
  "Swap as soon as a Mint events happens on the given pair. Token should be pre-approved."
)
  .addPositionalParam("dexName", "DEX to consider, e.g. UniswapV2")
  .addParam("pair", "Pair to spy")
  .addParam("token0", "Address of 1st token in the pair")
  .addParam("token1", "Address of 2nd token in the pair")
  .addParam("digits0", "Digits of 1st token in pair", 18, types.int)
  .addParam("digits1", "Digits of 2nd token in pair", 18, types.int)
  .addParam("itokenin", "Index of token to sell (0 or 1)", undefined, types.int)
  .addParam(
    "amountin",
    "How much you are willing to spend",
    undefined,
    types.float
  )
  .addParam(
    "minamountout",
    "Minimum amout of tokens you will receive",
    undefined,
    types.float
  )
  .addParam(
    "slippage",
    "% you are willing to pay more compared to the price at them moment of the liquidity add",
    undefined,
    types.float
  )
  .setAction(
    async (
      {
        dexName,
        pair,
        token0,
        token1,
        digits0,
        digits1,
        itokenin,
        amountin,
        minamountout,
        slippage,
      },
      hre
    ) => {
      console.log(`
        Arguments
        =================
        dexName: ${dexName}
        pair: ${pair}
        token0: ${token0}
        token1: ${token1}
        digits0: ${digits0}
        digits1: ${digits1}
        itokenin: ${itokenin}
        amountin: ${amountin}
        minamountout: ${minamountout}
        slippage: ${slippage}
      `);
      // Determine which token we are selling and which we are buying
      let tokenIn: string,
        tokenOut: string,
        digitsIn: number,
        digitsOut: number;
      switch (itokenin) {
        case 0:
          tokenIn = token0;
          tokenOut = token1;
          digitsIn = digits0;
          digitsOut = digits1;
          break;
        case 1:
          tokenIn = token1;
          tokenOut = token0;
          digitsIn = digits1;
          digitsOut = digits0;
          break;
        default:
          throw new Error(
            `Parameter itokenin must be either 0 or 1, given '${itokenin}'`
          );
      }
      // Get the amounts in blockchhain format
      const amountInBigNumber = ethers.utils.parseUnits(
        amountin + "",
        digitsIn
      );
      const minAmountOutBigNumber = ethers.utils.parseUnits(
        minamountout + "",
        digitsOut
      );
      console.log(`
        Derived values
        =================
        tokenIn: ${tokenIn}
        tokenOut: ${tokenOut}
        amountInBigNumber: ${amountInBigNumber}
        minAmountOutBigNumber: ${minAmountOutBigNumber}
      `);
      // Load credentials and get dex object
      const provider = getProvider(hre);
      const dex = new UniswapV2CloneFactory().create(
        dexName,
        provider,
        hre.network.name
      );
      // Start listening for add liquidity events
      dex.listenToMint(
        pair,
        (
          mintSender: string,
          mintAmount0: BigNumber,
          mintAmount1: BigNumber,
          mintTxReceipt: TransactionReceipt
        ) => {
          // Print mint event
          printMintEvent(
            mintSender,
            mintAmount0,
            mintAmount1,
            mintTxReceipt,
            digits0,
            digits1
          );
          // Compute price and minimum amount of tokenOut
          let price: number;
          switch (itokenin) {
            case 0:
              price = getRelativePrice(
                mintAmount1,
                mintAmount0,
                digits1,
                digits0
              );
              break;
            case 1:
              price = getRelativePrice(
                mintAmount0,
                mintAmount1,
                digits0,
                digits1
              );
              break;
            default:
              throw new Error(
                `Parameter itokenin must be either 0 or 1, given '${itokenin}'`
              );
          }
          console.log(`
            Price of token${itokenin}
            ==================
            price: ${price}
          `);

          // const amountOutMin = ;
          // Swap
          // const router = dex.getRouter();
          // const tx = await router.swapExactTokensForTokens(
          //   amountin,
          //   amountOutMin,
          //   [tokenIn, tokenOut],
          //   addresses.recipient,
          //   Date.now() + 1000 * 60 * 10 // 10 minutes
          // );
          // const receipt = await tx.wait();
          // console.log("Transaction receipt");
          // console.log(receipt);
        }
      );
      return wait();
    }
  );
