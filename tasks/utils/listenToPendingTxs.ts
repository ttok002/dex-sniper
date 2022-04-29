import { WebSocketProvider } from '@ethersproject/providers';
import { task } from 'hardhat/config';
import { wait } from '../../src/helpers/general';
import { getProvider } from '../../src/helpers/providers';

task(
  'utils:listenToPendingTxs',
  'Stream all pending transactions as they arrive to the node; use with a WS connection and a validator node'
)
  .addOptionalParam('from', 'Restrict to this specific address')
  .setAction(async ({ from }, hre) => {
    const provider = getProvider(hre) as WebSocketProvider;
    provider.on('pending', async (txHash) => {
      const tx = await provider.getTransaction(txHash);
      if (!from || tx.from.toLowerCase() === from.toLowerCase()) {
        console.log(tx);
      }
    });
    return wait();
  });
