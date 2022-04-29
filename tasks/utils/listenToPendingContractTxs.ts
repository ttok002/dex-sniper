import { task } from 'hardhat/config';
import { wait } from '../../src/helpers/general';
import { getProvider } from '../../src/helpers/providers';

task(
  'utils:listenToPendingContractTxs',
  'Stream all pending transactions to the given contract; use with a WS connection and a validator node'
)
  .addPositionalParam('contractAddress', 'Address of smart contract to spy')
  .addOptionalParam('from', 'Restrict to this specific interacting address')
  .setAction(async ({ contractAddress, from }, hre) => {
    const provider = getProvider(hre);
    provider.on('pending', async (txHash) => {
      const tx = await provider.getTransaction(txHash);
      if (tx['to']?.toLowerCase() === contractAddress.toLowerCase()) {
        if (!from || tx.from.toLowerCase() === from.toLowerCase()) {
          console.log(tx);
        }
      }
    });
    return wait();
  });
