import { task } from 'hardhat/config';
import { getProvider } from '../../src/helpers/providers';

task('utils:getNonce', 'Get nonce (number of txs) of current wallet')
  .addPositionalParam('address')
  .setAction(async ({ address }, hre) => {
    let nonce;
    const provider = getProvider(hre);
    nonce = await provider.getTransactionCount(address);
    console.log(nonce);
  });
