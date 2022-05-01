import { task, types } from 'hardhat/config';
import { wait } from '../../src/helpers/general';
import { prettyPrint, printTxResponse } from '../../src/helpers/print';
import { getProvider, getSigner } from '../../src/helpers/providers';
import { isResponseFrom, isResponsePending } from '../../src/helpers/transactions';
import { TxTracker } from '../../src/tracking/TxTracker';

task(
  'time:reactToPending',
  'If the given address sends a transaction, react by self-sending 1 wei. Useful to time reaction speed.'
)
  .addOptionalParam('from', 'Address to monitor')
  .addOptionalParam(
    'nMax',
    'Stop listening after nMax transactions (to avoid infinite loops)',
    1,
    types.int
  )
  .addOptionalParam(
    'trigger',
    'Self-send 1 wei immediately after setting up the listener. If the address is the same as the account, the reactiom will be automatically triggered. this is the fastest possible scenario because trigger & listener are on the same node.',
    false,
    types.boolean
  )
  .setAction(async ({ from, nMax, trigger }, hre) => {
    const t0 = Date.now();
    const txTracker = new TxTracker();
    let n = 0;
    // Get signer
    const provider = getProvider(hre);
    const signer = getSigner(hre, provider);
    const self = await signer.getAddress();
    // Listen to tx
    provider.on('pending', async (txHash) => {
      // Consider only txs from address
      const txRes = await provider.getTransaction(txHash);
      if (!isResponseFrom(txRes, from)) {
        return;
      }
      // React only to pending transactions
      if (!isResponsePending(txRes)) {
        return;
      }
      txTracker.add(txRes.hash, ['in']);
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
      }
      // React immediately by sending 1 gwei
      prettyPrint(`Reacting to ${txRes.hash.substring(0, 7)}...`, [
        ['time', Date.now() - t0],
        ['iteration', n],
      ]);
      const sendTxRes = await signer.sendTransaction({ to: self, value: 1 });
      txTracker.add(sendTxRes.hash, ['out', `triggered by ${txRes.hash.substring(0, 7)}`]);
      printTxResponse(sendTxRes, `Reaction to ${txRes.hash.substring(0, 7)}`, [
        ['time', Date.now() - t0],
        ['iteration', n],
      ]);
      // Wrap up!
      if (n === nMax) {
        // Print block numbers
        const loggedTxs = await txTracker.fetchReceipts(provider);
        prettyPrint(
          'Transactions summary',
          loggedTxs.map((tx) => [tx.hash, `${tx.blockNumber} [${tx.tags}]`])
        );
        return;
      }
    });
    // Optionally trigger the listener
    if (trigger) {
      prettyPrint('Sending trigger...', [['time', Date.now() - t0]]);
      const sendTxRes = await signer.sendTransaction({ to: self, value: 1 });
      txTracker.add(sendTxRes.hash, ['out', 'trigger']);
      printTxResponse(sendTxRes, 'Trigger response', [['time', Date.now() - t0]]);
    }
    return wait();
  });
