import { ethers } from 'ethers';
import { task, types } from 'hardhat/config';
import { validatePair } from '../../src/dexes/uniswapV2Clones/helpers/validation';
import { UniswapV2CloneFactory } from '../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory';
import { prettyPrint, printAmounts, printSwapReceipt } from '../../src/helpers/print';
import { getProvider, getSigner } from '../../src/helpers/providers';

task(
  'uniswapV2Clone:swap',
  'Wrapper to the RouterV2 swap function (https://docs.uniswap.org/protocol/V2/reference/smart-contracts/router-02#swapexacttokensfortokens)'
)
  .addPositionalParam('dexName', 'DEX to consider, e.g. UniswapV2')
  .addParam('pair', 'Liquidity pair')
  .addParam('token0', 'Address of 1st token in the pair')
  .addParam('token1', 'Address of 2nd token in the pair')
  .addParam('digits0', 'Digits of 1st token in pair', undefined, types.int)
  .addParam('digits1', 'Digits of 2nd token in pair', undefined, types.int)
  .addParam('itokenin', 'Index of token to sell (0 or 1)', undefined, types.int)
  .addParam('amountin', 'How much you are willing to spend', undefined, types.float)
  .addParam('minamountout', 'Minimum amout of tokens you will receive', undefined, types.float)
  .addParam('deadline', 'How many seconds should we try swapping', undefined, types.float)
  .addOptionalParam('to', 'Recipient of the swap output tokens')
  .addOptionalParam('dryrun', 'Stop right before the actual swap', true, types.boolean)
  .setAction(
    async (
      args: {
        dexName: string;
        pair: string;
        token0: string;
        token1: string;
        digits0: number;
        digits1: number;
        itokenin: 0 | 1;
        amountin: number;
        minamountout: number;
        deadline: number;
        to: string;
        dryrun: boolean;
      },
      hre
    ) => {
      prettyPrint('Arguments', args);
      const {dexName, pair, token0, token1, digits0, digits1, itokenin, amountin, minamountout, deadline, to, dryrun} = args; // prettier-ignore
      // Determine which token we are selling and which we are buying
      let tokenIn: string, tokenOut: string, digitsIn: number, digitsOut: number;
      if (itokenin === 0) {
        (tokenIn = token0), (tokenOut = token1), (digitsIn = digits0), (digitsOut = digits1);
      } else if (itokenin === 1) {
        (tokenIn = token1), (tokenOut = token0), (digitsIn = digits1), (digitsOut = digits0);
      } else {
        throw new Error(`Parameter itokenin must be either 0 or 1, given '${itokenin}'`);
      }
      // Get the amounts in blockchhain format
      const amountInBigNumber = ethers.utils.parseUnits(amountin + '', digitsIn);
      const minAmountOutBigNumber = ethers.utils.parseUnits(minamountout + '', digitsOut);
      prettyPrint('Derived values', {tokenIn, tokenOut, amountInBigNumber, minAmountOutBigNumber}); // prettier-ignore
      // Load credentials and get dex object
      const provider = getProvider(hre);
      const signer = getSigner(hre, provider);
      const dex = new UniswapV2CloneFactory().create(dexName, provider, hre.network.name, signer);
      // Check that the given pair corresponds to the tokens
      if (!validatePair(dex, pair, tokenIn, tokenOut, true)) {
        return false;
      }
      // Get the expected amount of tokens for debug purposes
      const router = dryrun ? dex.getRouter() : dex.getRouterSigner();
      const amounts = await dex.getAmountsOut(amountInBigNumber, tokenIn, tokenOut);
      printAmounts(amounts, digitsIn, digitsOut);
      // Exit if we are simulating
      if (dryrun) {
        prettyPrint('Dry run', { msg: 'Exiting...' });
        return false;
      }
      // Swap
      const swapTx = await router.swapExactTokensForTokens(
        amountInBigNumber,
        minAmountOutBigNumber,
        [tokenIn, tokenOut],
        to || (await signer.getAddress()),
        Date.now() + 1000 * 60 * deadline
        // {
        //   // nonce: 1029,
        //   gasLimit: 400000,
        //   maxFeePerGas: ethers.utils.parseUnits('200', 'gwei'),
        //   maxPriorityFeePerGas: ethers.utils.parseUnits('10', 'gwei'),
        // }
      );
      const swapTxReceipt = await swapTx.wait();
      printSwapReceipt(swapTxReceipt, digitsIn, digitsOut);
    }
  );
