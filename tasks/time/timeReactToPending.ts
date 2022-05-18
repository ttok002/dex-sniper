import { parseUnits } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import { exit } from 'process';
import { wait } from '../../src/helpers/general';
import { prepare, prettyPrint, printTxResponse } from '../../src/helpers/print';
import { getProvider } from '../../src/helpers/providers';
import { getSigner } from '../../src/helpers/signers';
import { isResponseFrom, isResponsePending } from '../../src/helpers/transactions';
import { TxTracker } from '../../src/tracking/TxTracker';

task(
  'time:reactToPending',
  'Whenever the given address sends a transaction, react by self-sending 1 wei. Useful to time reaction speed.'
)
  .addParam('account', 'The account that will send (and receive) the monies')
  .addParam(
    'addressToMonitor',
    "Address to monitor. If qual to 'account', make sure you set a low enough value for nMax to avoid infinite loops."
  )
  .addOptionalParam(
    'nMax',
    'Stop listening after nMax transactions (to avoid infinite loops)',
    1,
    types.int
  )
  .addOptionalParam('gasLimit', 'Max gas to use in the reaction', 0, types.int)
  .addOptionalParam('maxFeePerGas', 'Max gwei to pay per unit of gas', 0.0, types.float)
  .addOptionalParam('maxPriorityFeePerGas', 'Max gwei for the miner tip', 0.0, types.float)
  .addOptionalParam(
    'fastNonce',
    'Keep track of nonce internally for faster performance. Do not sign txs while the script is running, lest you mess the nonce count',
    false,
    types.boolean
  )
  .setAction(
    async (
      { account, addressToMonitor, nMax, gasLimit, maxFeePerGas, maxPriorityFeePerGas, fastNonce },
      hre
    ) => {
      // Transaction logger
      const txTracker = new TxTracker();
      // Counter of outbound transactions
      let n = 0;
      /**
       * Function to print summary of in & out transactions
       */
      async function printReport() {
        const txsToKeep = await TxTracker.fetchReceipts(
          txTracker.getTxsByTag(['valid', 'out']),
          provider
        );
        prettyPrint(
          'Transactions summary',
          txsToKeep.map((tx) => [
            tx.hash,
            `${tx.blockNumber} timings=[${txTracker.formatTimings(tx.id)}] tags=[${tx.meta.tags}] `,
          ])
        );
      }
      // Print summary on exit
      process.on('SIGINT', async () => {
        await printReport();
        exit(1);
      });
      // Get signer
      const provider = getProvider(hre);
      const signer = getSigner(hre, account, provider);
      const self = await signer.getAddress();
      // Get initial nonce
      let nonce: number;
      if (fastNonce) {
        nonce = await signer.getTransactionCount();
        prettyPrint('Initial nonce set', prepare({ nonce }));
      }
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
        if (isResponseFrom(inboundTx, addressToMonitor) !== true) {
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
          provider.removeAllListeners();
          return;
        }
        // Transaction is valid!
        txTracker.addTag(inboundTxLogId, 'valid');
        printTxResponse(inboundTx, 'Received tx!', [['iteration', n]]);
        // React immediately by sending 1 gwei
        prettyPrint(`Reacting to ${inboundTxHash.substring(0, 7)}...`, [
          ['iteration', n],
          ['nonce', nonce],
        ]);
        const outboundTxLogId = txTracker.add('', [
          'out',
          `triggered by ${inboundTxHash.substring(0, 7)}`,
        ]);
        const outboundTx = await signer.sendTransaction({
          to: self,
          value: 1,
          gasLimit: gasLimit ? gasLimit : undefined,
          nonce: fastNonce ? nonce : undefined,
          maxFeePerGas: maxFeePerGas ? parseUnits(maxFeePerGas + '', 'gwei') : undefined,
          maxPriorityFeePerGas: maxPriorityFeePerGas
            ? parseUnits(maxPriorityFeePerGas + '', 'gwei')
            : undefined,
        });
        // Update tracker with tx timing & hash
        txTracker.addTiming(outboundTxLogId, 'sent');
        txTracker.update(outboundTxLogId, outboundTx.hash);
        // Increment nonce
        if (fastNonce) {
          nonce += 1;
        }
        printTxResponse(outboundTx, `Reaction to ${inboundTxHash.substring(0, 7)}`);
        // Print report after last tx
        if (n == nMax) {
          await printReport();
          exit(1);
        }
      });
      return wait();
    }
  );
