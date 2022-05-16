import { task } from 'hardhat/config';
import WebSocket from 'ws';
import { wait } from '../../src/helpers/general';
import { getSigner } from '../../src/helpers/signers';

task(
  'snowSight:mempoolStream',
  'Stream pending transactions from SnowSight. Docs: https://snowsight.chainsight.dev/'
)
  .addParam('account', 'The account to use; must have paid on SnowSight')
  .setAction(async ({ account }, hre) => {
    // Authenticate with SnowSight
    const signer = getSigner(hre, account);
    const signedKey = await signer.signMessage(
      'Sign this message to authenticate your wallet with Snowsight.'
    );

    // Open websocket
    const ws = new WebSocket('ws://mempool-stream.snowsight.chainsight.dev:8589');
    ws.on('open', () => {
      console.log('Snowsight::open');
      ws.send(JSON.stringify({ signed_key: signedKey, include_finalized: true }));
    });

    // Stream pending transactions
    ws.on('message', async (data: string) => {
      const txResponse = JSON.parse(data);
      if (txResponse.status) {
        console.log(`Snowsight::authentication: ${txResponse.status}`);
      }
      console.log(txResponse);
    });

    return wait();
  });
