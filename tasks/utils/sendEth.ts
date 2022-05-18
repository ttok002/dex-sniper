import { TransactionRequest } from '@ethersproject/abstract-provider';
import { task, types } from 'hardhat/config';
import { sleep } from '../../src/helpers/general';
import { prepare, prettyPrint, printTxReceipt } from '../../src/helpers/print';
import { getSigner } from '../../src/helpers/signers';

task('utils:sendEth', 'Send some ETH to the give address')
  .addOptionalPositionalParam('to', 'Recipient address; default is self.')
  .addOptionalPositionalParam('valueInEth', 'Amount to send in ETH', '0.000000001', types.string)
  .addParam('account', "Who's sending the monies")
  .addOptionalParam('n', 'How many times to send ETH', 1, types.int)
  .addOptionalParam('delay', 'Delay in milliseconds between each send', 0, types.int)
  .setAction(async ({ to, valueInEth, account, n, delay }, hre) => {
    const signer = getSigner(hre, account);
    if (!to) {
      to = await signer.getAddress();
    }
    const params: TransactionRequest = {
      to: to,
      value: hre.ethers.utils.parseEther(valueInEth),
    };
    prettyPrint('Params', prepare(params));
    return new Promise(async (resolve) => {
      for (let i = 0; i < n; i++) {
        const txRes = await signer.sendTransaction(params);
        if (delay && i > 0) {
          prettyPrint(`Waiting ${delay} ms...`);
          await sleep(delay);
        }
        const txReceipt = await txRes.wait();
        printTxReceipt(txReceipt, undefined, undefined, n > 1 ? [['n', i + 1]] : undefined);
      }
      resolve(n);
    });
  });
