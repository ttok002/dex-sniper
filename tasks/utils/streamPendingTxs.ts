import { WebSocketProvider } from '@ethersproject/providers';
import { task } from 'hardhat/config';
import { wait } from '../../src/helpers/general';
import { getProvider } from '../../src/helpers/providers';

task(
  'utils:streamPendingTxs',
  'Stream all pending transactions as they arrive to the node; best used with a WS connection on a full/validator node'
).setAction(async ({}, hre) => {
  const provider = getProvider(hre) as WebSocketProvider;
  provider.on('pending', (tx) => {
    provider.getTransaction(tx).then(function (transaction) {
      console.log(transaction);
    });
  });
  return wait();
});