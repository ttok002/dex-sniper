import { task } from 'hardhat/config';
import { wait } from '../../src/helpers/general';
import { getProvider } from '../../src/helpers/providers';

task(
  'time:timeGetPendingTransaction',
  'Print the time it takes to fetch a pending transaction'
).setAction(async (taskArgs, hre) => {
  const provider = getProvider(hre);
  provider.on('pending', async (txHash) => {
    console.time(txHash);
    await provider.getTransaction(txHash);
    console.timeEnd(txHash);
  });
  return wait();
});
