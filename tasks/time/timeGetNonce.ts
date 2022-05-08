import { task } from 'hardhat/config';
import { getProvider } from '../../src/helpers/providers';

task('time:getNonce', 'Print the time it takes to fetch the transaction count')
  .addPositionalParam('address')
  .setAction(async ({ address }, hre) => {
    let nonce;
    const provider = getProvider(hre);
    console.time();
    nonce = await provider.getTransactionCount(address);
    console.timeEnd();
    console.log(nonce);
  });
