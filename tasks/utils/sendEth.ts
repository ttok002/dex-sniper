import { task, types } from 'hardhat/config';
import { prepare, prettyPrint, printTxReceipt } from '../../src/helpers/print';
import { getSigner } from '../../src/helpers/signers';

task('utils:sendEth', 'Send some ETH to the give address')
  .addOptionalPositionalParam('to', 'Recipient address; default is self.')
  .addOptionalPositionalParam('valueInEth', 'Amount to send in ETH', '0.000000001', types.string)
  .addParam('account', "Who's sending the monies")
  .setAction(async ({ to, valueInEth, account }, hre) => {
    if (!to) {
      to = await getSigner(hre, account).getAddress();
    }
    const params = {
      to: to,
      value: hre.ethers.utils.parseEther(valueInEth),
    };
    prettyPrint('Params', prepare(params));
    const txRes = await getSigner(hre, account).sendTransaction(params);
    const txReceipt = await txRes.wait();
    printTxReceipt(txReceipt);
  });
