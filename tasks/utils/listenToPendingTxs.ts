import { WebSocketProvider } from '@ethersproject/providers';
import { task } from 'hardhat/config';
import { wait } from '../../src/helpers/general';
import { getProvider } from '../../src/helpers/providers';
import { isResponseFrom } from '../../src/helpers/transactions';

task(
  'utils:listenToPendingTxs',
  'Stream all pending transactions as they arrive to the node; use with a WS connection and a validator node'
)
  .addOptionalParam('from', 'Restrict to this specific address')
  .setAction(async ({ from }, hre) => {
    const provider = getProvider(hre) as WebSocketProvider;
    provider.on('pending', async (txHash) => {
      const res = await provider.getTransaction(txHash);
      // Pick only txs from the sender
      if (from && !isResponseFrom(res, from)) {
        return;
      }
      console.log(res);
    });
    return wait();
  });
