import { task, types } from 'hardhat/config';
import { exit } from 'process';
import { wait } from '../../src/helpers/general';
import { prettyPrint, printTxResponse } from '../../src/helpers/print';
import { getProvider, getSigner } from '../../src/helpers/providers';
import { isResponsePending, isResponseTo } from '../../src/helpers/transactions';

task(
  'time:reactToPending',
  'Set up a listener that immediately reacts by self-sending 1 wei. Useful to time reaction speed.'
)
  .addOptionalParam('nMax', 'Max number of txs to listen to', 1, types.int)
  .addOptionalParam(
    'trigger',
    'Immediately trigger the listener by sending 1 wei. This is the fastest possible scenario because trigger & listener are on the same node.',
    false,
    types.boolean
  )
  .setAction(async ({ nMax, trigger }, hre) => {
    const t0 = Date.now();
    let n = 0;
    // Get signer
    const provider = getProvider(hre);
    const signer = getSigner(hre, provider);
    const address = await signer.getAddress();
    // Listen to tx
    provider.on('pending', async (txHash) => {
      // Consider only txs from address
      const txRes = await provider.getTransaction(txHash);
      if (!isResponseTo(txRes, address)) {
        return;
      }
      // React only to pending transactions
      if (!isResponsePending(txRes)) {
        return;
      }
      printTxResponse(txRes, 'Received tx!', [
        ['time', Date.now() - t0],
        ['iteration', n],
      ]);
      // Increase pending transaction counter
      n += 1;
      // Avoid falling in an unpleasant infinite loop
      if (n > nMax) {
        prettyPrint(`Won't react to ${txRes.hash.substring(0, 7)}`, [
          ['time', Date.now() - t0],
          ['iteration', n],
        ]);
        provider.removeAllListeners();
        return;
      }
      // React immediately by sending 1 gwei
      prettyPrint(`Reacting to ${txRes.hash.substring(0, 7)}...`, [
        ['time', Date.now() - t0],
        ['iteration', n],
      ]);
      const sendTxRes = await signer.sendTransaction({ to: address, value: 1 });
      printTxResponse(sendTxRes, `Reaction to ${txRes.hash.substring(0, 7)}`, [
        ['time', Date.now() - t0],
        ['iteration', n],
      ]);
    });
    // Optionally trigger the listener
    if (trigger) {
      prettyPrint('Sending trigger...', [['time', Date.now() - t0]]);
      const sendTxRes = await signer.sendTransaction({ to: address, value: 1 });
      printTxResponse(sendTxRes, 'Trigger response', [['time', Date.now() - t0]]);
    }
    return wait();
  });
