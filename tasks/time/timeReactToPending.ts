import { logger } from 'ethers';
import { task, types } from 'hardhat/config';
import { exit } from 'process';
import { wait } from '../../src/helpers/general';
import { prettyPrint, printTxResponse } from '../../src/helpers/print';
import { getProvider, getSigner } from '../../src/helpers/providers';
import { isResponseFrom, isResponsePending } from '../../src/helpers/transactions';
import { TxTracker } from '../../src/tracking/TxTracker';

task(
  'time:reactToPending',
  'If the given address sends a transaction, react by self-sending 1 wei. Useful to time reaction speed.'
)
  .addParam('from', 'Address to monitor')
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
    // Transaction logger
    const txTracker = new TxTracker();
    // Counter of outbound transactions
    let n = 0;
    // Print a summary on exit
    process.on('SIGINT', printReport);
    async function printReport() {
      const txsToKeep = await TxTracker.fetchReceipts(
        txTracker.getTxsByTag(['valid', 'out']),
        provider
      );
      prettyPrint(
        'Transactions summary',
        txsToKeep.map((tx) => [
          tx.hash,
          `${tx.blockNumber} timings=[${txTracker.formatTimings(tx.id)}] tags=[${tx.tags}] `,
        ])
      );
      exit(1);
    }
    // Get signer
    const provider = getProvider(hre);
    const signer = getSigner(hre, provider);
    const self = await signer.getAddress();
    // Listen to tx
    provider.on('pending', async (inboundTxHash) => {
      // Log & fetch pending transaction
      const inboundTxLogId = txTracker.add(inboundTxHash, ['in']);
      const inboundTx = await provider.getTransaction(inboundTxHash);
      txTracker.addTiming(inboundTxLogId, `fetch`);
      if (!inboundTx) {
        prettyPrint('Empty pending transaction!');
        return;
      }
      // Consider only txs from address
      if (from && isResponseFrom(inboundTx, from) !== true) {
        return;
      }
      // React only to pending transactions. Needed because the
      // 'pending' listener always finds the same tx twice: first
      // as a pending tx, and then as a confirmed tx.
      if (isResponsePending(inboundTx) !== true) {
        return;
      }
      // Increase processed transactions counter
      n += 1;
      // Avoid falling in an unpleasant infinite loop
      if (n > nMax) {
        prettyPrint(`Reached nMax, won't react`, [
          ['pending tx', inboundTxHash.substring(0, 7)],
          ['iteration', n],
          ['nMax', nMax],
        ]);
        provider.removeAllListeners();
        return;
      }
      txTracker.addTag(inboundTxLogId, 'valid');
      printTxResponse(inboundTx, 'Received tx!', [['iteration', n]]);
      // React immediately by sending 1 gwei
      prettyPrint(`Reacting to ${inboundTxHash.substring(0, 7)}...`, [['iteration', n]]);
      const outboundTxLogId = txTracker.add('', [
        'out',
        `triggered by ${inboundTxHash.substring(0, 7)}`,
      ]);
      const outboundTx = await signer.sendTransaction({ to: self, value: 1 });
      txTracker.update(outboundTxLogId, outboundTx.hash);
      txTracker.addTiming(outboundTxLogId, 'sent');
      printTxResponse(outboundTx, `Reaction to ${inboundTxHash.substring(0, 7)}`);
    });
    // Optionally trigger the listener
    if (trigger) {
      prettyPrint('Sending trigger...');
      const triggerTxLogId = txTracker.add('', ['out', 'trigger']);
      const triggerTx = await signer.sendTransaction({ to: self, value: 1 });
      if (!triggerTx) {
        prettyPrint('Empty trigger transaction!');
        return;
      }
      txTracker.update(triggerTxLogId, triggerTx.hash);
      txTracker.addTiming(triggerTxLogId, 'sent');
      printTxResponse(triggerTx, 'Trigger');
    }
    return wait();
  });
