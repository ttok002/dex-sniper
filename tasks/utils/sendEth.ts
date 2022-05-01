import { task, types } from 'hardhat/config';
import { prepare, prettyPrint, printTxReceipt } from '../../src/helpers/print';
import { getSigner } from '../../src/helpers/providers';

task('utils:sendEth', 'Send some ETH to the give address')
  .addOptionalPositionalParam('to', 'Recipient address; default is self.')
  .addOptionalPositionalParam('valueInEth', 'Amount to send in ETH', '0.000000001', types.string)
  .setAction(async ({ to, valueInEth }, hre) => {
    if (!to) {
      to = await getSigner(hre).getAddress();
    }
    const params = {
      to: to,
      value: hre.ethers.utils.parseEther(valueInEth),
    };
    prettyPrint('Params', prepare(params));
    const txRes = await getSigner(hre).sendTransaction(params);
    const txReceipt = await txRes.wait();
    printTxReceipt(txReceipt);
  });
