import { task } from 'hardhat/config';
import { wait } from '../../src/helpers/general';
import { getProvider } from '../../src/helpers/providers';

task(
  'utils:listenToPendingContractTxs',
  'Stream all pending transactions to the given contract; use with a WS connection and a validator node'
)
  .addPositionalParam('contractAddress', 'Address of smart contract to spy')
  .setAction(async ({ contractAddress }, hre) => {
    const provider = getProvider(hre);
    provider.on('pending', async (txHash) => {
      const tx = await provider.getTransaction(txHash);
      if (tx != null && tx['to']?.toLowerCase() == contractAddress.toLowerCase()) {
        console.log(tx);
      }
    });
    return wait();
  });
