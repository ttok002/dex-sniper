import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { BigNumber, ethers, Overrides } from 'ethers';
import { task, types } from 'hardhat/config';
import { validatePair } from '../../src/dexes/uniswapV2Clones/helpers/validation';
import { UniswapV2CloneFactory } from '../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory';
import { wait } from '../../src/helpers/general';
import { prepare, prettyPrint, printMintEvent, printSwapReceipt } from '../../src/helpers/print';
import { startConnection } from '../../src/helpers/providers';
import { getSigner } from '../../src/helpers/signers';

task(
  'uniswapV2Clone:snipeMints',
  'Swap as soon as liquidity is added on the given pair. Token should be pre-approved.'
)
  .addPositionalParam('dexName', 'DEX to consider, e.g. UniswapV2')
  .addParam('account', "Who's supposed to do the swap")
  .addParam('pair', 'Pair to spy')
  .addParam('token0', 'Address of 1st token in the pair')
  .addParam('token1', 'Address of 2nd token in the pair')
  .addParam('digits0', 'Digits of 1st token in pair', undefined, types.int)
  .addParam('digits1', 'Digits of 2nd token in pair', undefined, types.int)
  .addParam('itokenin', 'Index of token to sell (0 or 1)', undefined, types.int)
  .addParam('amountin', 'How much you are willing to spend', undefined, types.float)
  .addParam('minamountout', 'Minimum amout of tokens you will receive', undefined, types.float)
  .addOptionalParam('to', 'Recipient of the swap output tokens')
  .addOptionalParam(
    'gasLimit',
    'Maximum gas to use. If not given, or zero, the bot will use eth_estimateGas, with a beneficial side effect: it checks whether the tx would fail, without actually sending it (https://ethereum.stackexchange.com/a/770/89782).',
    0,
    types.int
  )
  .addOptionalParam('maxFeePerGas', 'Max gwei to pay per unit of gas', 0.0, types.float)
  .addOptionalParam('maxPriorityFeePerGas', 'Max gwei for the miner tip', 0.0, types.float)
  .addOptionalParam(
    'fastnonce',
    'Keep track of nonce internally for faster performance. Do not sign txs while the script is running, lest you mess the nonce count',
    false,
    types.boolean
  )
  .addOptionalParam('deadline', 'How many seconds should we try swapping', 120, types.float)
  .addOptionalParam(
    'minliquidityin',
    'Swap only if the Mint added more than this liquidity in the token you are selling. Set to zero to always swap regardless.',
    0.0,
    types.float
  )
  .addOptionalParam('runonce', 'Stop after first liquidity add', true, types.boolean)
  .addOptionalParam('dryrun', 'Stop right before the actual swap', true, types.boolean)
  .setAction(
    async (
      args: {
        dexName: string;
        account: string;
        pair: string;
        token0: string;
        token1: string;
        digits0: number;
        digits1: number;
        itokenin: 0 | 1;
        amountin: number;
        minamountout: number;
        fastnonce: boolean;
        to: string;
        gasLimit: number;
        maxFeePerGas: number;
        maxPriorityFeePerGas: number;
        deadline: number;
        minliquidityin: number;
        runonce: boolean;
        dryrun: boolean;
      },
      hre
    ) => {
      // Parse parameters
      prettyPrint('Arguments', prepare(args));
      const { dexName, account, pair, token0, token1, digits0, digits1, itokenin, amountin, minamountout, fastnonce, to, gasLimit, maxFeePerGas, maxPriorityFeePerGas, deadline, minliquidityin, runonce, dryrun } = args; // prettier-ignore

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
      const minLiquidityInBigNumber = ethers.utils.parseUnits(minliquidityin + '', digitsIn);
      prettyPrint('Derived values', prepare({tokenIn, tokenOut, amountInBigNumber, minAmountOutBigNumber, minLiquidityInBigNumber})); // prettier-ignore

      // Start the WebSocket connection
      startConnection(hre, async (hre, provider) => {
        // Load credentials and get dex object
        const signer = getSigner(hre, account, provider);
        const dex = new UniswapV2CloneFactory().create(dexName, provider, hre.network.name, signer);

        // Check that the given pair corresponds to the tokens
        if (!validatePair(dex, pair, tokenIn, tokenOut, true)) {
          return false;
        }

        // Get initial nonce
        let nonce: number;
        if (fastnonce) {
          nonce = await signer.getTransactionCount();
          prettyPrint('Initial nonce set', prepare({ nonce }));
        }

        // Function that will be called after each liquidity add event
        const mintCallback = async (
          mintSender: string,
          mintAmount0: BigNumber,
          mintAmount1: BigNumber,
          mintTxReceipt: TransactionReceipt
        ) => {
          // Print mint event
          printMintEvent(mintSender, mintAmount0, mintAmount1, mintTxReceipt, digits0, digits1);
          // Compute price and minimum amount of tokenOut
          const liquidityInBigNumber = itokenin === 0 ? mintAmount0 : mintAmount1;
          // Exit if the liquidity added is too small
          if (minliquidityin && minLiquidityInBigNumber.gt(liquidityInBigNumber)) {
            prettyPrint('Small liquidity!', [
              ['msg', 'Exiting because liquidity add in token${itokenin} was too small'],
              ['liquidityIn', `${ethers.utils.formatUnits(liquidityInBigNumber, digitsIn)}`],
              ['minLiquidityIn', minliquidityin],
            ]);
            return;
          }
          // Exit if we are simulating
          if (dryrun) {
            prettyPrint('Dry run', [['msg', 'Exiting...']]);
            return false;
          }
          // Optionally, compute nonce & gas manually
          const swapOverrides: Overrides = {
            nonce: fastnonce ? nonce : undefined,
            gasLimit: gasLimit || undefined,
            maxFeePerGas: maxFeePerGas
              ? ethers.utils.parseUnits(maxFeePerGas + '', 'gwei')
              : undefined,
            maxPriorityFeePerGas: maxPriorityFeePerGas
              ? ethers.utils.parseUnits(maxPriorityFeePerGas + '', 'gwei')
              : undefined,
          };
          if (swapOverrides) {
            prettyPrint('Overrides', prepare(swapOverrides));
          }
          // Swap.
          // We wrap the swap in a try-catch statement
          // to avoid exiting if a transaction fails
          const router = dex.getRouterSigner();
          try {
            const swapTx = await router.swapExactTokensForTokens(
              amountInBigNumber,
              minAmountOutBigNumber,
              [tokenIn, tokenOut],
              to || (await signer.getAddress()),
              Date.now() + 1000 * 60 * deadline,
              swapOverrides
            ); // will throw if gasEstimate gives error
            // Increment nonce
            if (fastnonce) {
              nonce += 1;
            }
            const swapTxReceipt = await swapTx.wait(); // will throw if tx has error
            printSwapReceipt(swapTxReceipt, digitsIn, digitsOut);
          } catch (error) {
            prettyPrint('Caught exception', [['msg', (error as Error).message]]);
          }
        };

        // Start listening for add liquidity events
        if (runonce) {
          dex.listenToMintOnce(pair, mintCallback);
        } else {
          dex.listenToMint(pair, mintCallback);
        }
      }); // end startConnection
      return wait();
    }
  );
