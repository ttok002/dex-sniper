import { ethers } from "ethers";
import { task, types } from "hardhat/config";
import { validatePair } from "../../src/dexes/uniswapV2Clones/helpers/validation";
import { UniswapV2CloneFactory } from "../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory";
import { getProvider, getSigner } from "../../src/helpers/providers";

task(
  "uniswapV2Clone:swap",
  "Wrapper to the RouterV2 swap function (https://docs.uniswap.org/protocol/V2/reference/smart-contracts/router-02#swapexacttokensfortokens)"
)
  .addPositionalParam("dexName", "DEX to consider, e.g. UniswapV2")
  .addParam("pair", "Liquidity pair")
  .addParam("token0", "Address of 1st token in the pair")
  .addParam("token1", "Address of 2nd token in the pair")
  .addParam("digits0", "Digits of 1st token in pair", undefined, types.int)
  .addParam("digits1", "Digits of 2nd token in pair", undefined, types.int)
  .addParam("itokenin", "Index of token to sell (0 or 1)", undefined, types.int)
  .addParam("to", "Recipient of the swap output tokens")
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
    "deadline",
    "How many seconds should we try swapping",
    undefined,
    types.float
  )
  .addOptionalParam(
    "dryrun",
    "Stop right before the actual swap",
    true,
    types.boolean
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
        to,
        amountin,
        minamountout,
        deadline,
        dryrun,
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
         to: ${to}
         amountin: ${amountin}
         minamountout: ${minamountout}
         deadline: ${deadline}
         dryrun: ${dryrun}
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
      const signer = getSigner(hre, provider);
      const dex = new UniswapV2CloneFactory().create(
        dexName,
        provider,
        hre.network.name,
        signer
      );
      // Check that the given pair corresponds to the tokens
      if (!validatePair(dex, pair, tokenIn, tokenOut, true)) {
        return false;
      }
      // Get the expected amount of tokens
      const router = dryrun ? dex.getRouter() : dex.getRouterSigner();
      // const amounts = await router.getAmountsOut(amountInBigNumber, [
      //   tokenIn,
      //   tokenOut,
      // ]);
      // console.log(`
      //   Get amounts
      //   ==============
      //   ${amounts}
      // `);
      // Exit if we are simulating
      if (dryrun) {
        console.log(`
          Dry run
          ==============
          Exiting...
        `);
        return false;
      }
      // Swap
      const swapTx = await router.swapExactTokensForTokens(
        amountInBigNumber,
        minAmountOutBigNumber,
        [tokenIn, tokenOut],
        to,
        Date.now() + 1000 * 60 * deadline
      );
      const swapTxReceipt = await swapTx.wait();
      console.log(`
        Swap receipt
        ==============
      `);
      console.log(swapTxReceipt);
    }
  );
