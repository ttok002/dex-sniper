import { task } from 'hardhat/config';
import { wait } from '../../src/helpers/general';
import { getProvider } from '../../src/helpers/providers';
import { isResponseFrom, isResponseTo } from '../../src/helpers/transactions';

task(
  'utils:listenToPendingContractTxs',
  'Stream all pending transactions to the given contract; use with a WS connection and a validator node'
)
  .addPositionalParam('contractAddress', 'Address of smart contract to spy')
  .addOptionalParam('from', 'Restrict to this specific interacting address')
  .setAction(async ({ contractAddress, from }, hre) => {
    const provider = getProvider(hre);
    provider.on('pending', async (txHash) => {
      const res = await provider.getTransaction(txHash);
      // Pick only txs to the contract
      if (!isResponseTo(res, contractAddress)) {
        return;
      }
      // Optionally filter by sender
      if (from && !isResponseFrom(res, from)) {
        return;
      }
      console.log(res);
    });
    return wait();
  });
