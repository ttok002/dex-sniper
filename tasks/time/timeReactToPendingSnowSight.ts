import { keccak256, parseUnits } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import { exit } from 'process';
import { wait } from '../../src/helpers/general';
import { prepare, prettyPrint, printTxResponse } from '../../src/helpers/print';
import { getProvider } from '../../src/helpers/providers';
import { getSigner } from '../../src/helpers/signers';
import { isResponseFrom, isResponsePending } from '../../src/helpers/transactions';
import { TxTracker } from '../../src/tracking/TxTracker';
import WebSocket from 'ws';
import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
import logger, { debug } from '../../src/common/logger';
import axios from 'axios';

task(
  'time:reactToPendingSnowSight',
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
  .addOptionalParam('timeoutInMs', 'Timeout for the TX propagator', 500, types.int)
  .setAction(
    async (
      {
        account,
        addressToMonitor,
        nMax,
        gasLimit,
        maxFeePerGas,
        maxPriorityFeePerGas,
        fastNonce,
        timeoutInMs,
      },
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
            `${tx.blockNumber} timings=[${txTracker.formatTimings(tx.id)}] tags=[${tx.tags}] `,
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
      // Initialize SnowSight websocket
      // https://docs.snowsight.chainsight.dev/snowsight/services/mempool-stream/ethers.js
      const ssKey = 'Sign this message to authenticate your wallet with Snowsight.';
      const ssSignedKey = await signer.signMessage(ssKey);
      const ssWs = new WebSocket('ws://mempool-stream.snowsight.chainsight.dev:8589');
      ssWs.on('open', () => {
        debug(`> SnowSight Websocket open`);
        ssWs.send(JSON.stringify({ signed_key: ssSignedKey, include_finalized: false }));
      });
      // Listen to tx
      ssWs.on('message', async (data: string) => {
        // Log & fetch pending transaction
        const inboundTx = JSON.parse(data) as TransactionResponse;
        if ((inboundTx as any).status) {
          debug(`> SnowSight Websocket authentication: ${(inboundTx as any).status}`);
        }
        const inboundTxHash = inboundTx.hash;
        const inboundTxLogId = txTracker.add(inboundTxHash, ['in']);
        if (!inboundTx) {
          prettyPrint('Empty pending transaction!');
          return;
        }
        // Consider only txs from address
        if (isResponseFrom(inboundTx, addressToMonitor) !== true) {
          return;
        }
        // Increase processed transactions counter
        n += 1;
        // Avoid falling in an unpleasant infinite loop
        if (n > nMax) {
          ssWs.terminate();
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
        // Build and sign transaction
        const txRequest: TransactionRequest = {
          from: self,
          to: self,
          nonce: fastNonce ? nonce : await signer.getTransactionCount(),
          value: 1,
          maxFeePerGas: maxFeePerGas
            ? parseUnits(maxFeePerGas + '', 'gwei')
            : parseUnits('200', 'gwei'), // TODO: Estimate from latest block
          maxPriorityFeePerGas: maxPriorityFeePerGas
            ? parseUnits(maxPriorityFeePerGas + '', 'gwei')
            : parseUnits('2.5', 'gwei'),
          gasLimit: 26000,
          chainId: 43114,
          type: 2,
        };
        const outboundTxLogId = txTracker.add('', [
          'out',
          `triggered by ${inboundTxHash.substring(0, 7)}`,
        ]);
        // Send TX using the propagator
        const signedTx = await signer.signTransaction(txRequest);
        const packet = { signed_key: ssSignedKey, raw_tx: signedTx };
        let ssResponse;
        try {
          ssResponse = await axios({
            method: 'post',
            url: 'http://tx-propagator.snowsight.chainsight.dev:8081',
            timeout: timeoutInMs,
            data: JSON.stringify(packet),
          });
        } catch (error) {
          prettyPrint(`SnowSight error!`, [
            ['error name', (error as Error).name],
            ['error message', (error as Error).message],
            ['triggered by', inboundTxHash.substring(0, 7)],
          ]);
          txTracker.addTiming(outboundTxLogId, 'errored');
          return;
        }
        // Update tracker with tx timing & hash
        const outboundTxHash = keccak256(signedTx);
        txTracker.addTiming(outboundTxLogId, 'sent');
        txTracker.update(outboundTxLogId, outboundTxHash);
        // Increment nonce
        if (fastNonce) {
          nonce += 1;
        }
        prettyPrint(`Reaction to ${inboundTxHash.substring(0, 7)}`, [
          ['hash', outboundTxHash],
          ['Signed TX', `${signedTx.substring(0, 10)}...`],
          ['SnowSight status', ssResponse.status],
          ['SnowSight response', JSON.stringify(ssResponse.data)],
        ]);
        // Print report after last tx
        if (n == nMax) {
          await printReport();
          exit(1);
        }
      });
      return wait();
    }
  );
