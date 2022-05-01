import { task } from 'hardhat/config';
import { UniswapV2CloneFactory } from '../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory';
import { wait } from '../../src/helpers/general';
import { printParsedTx } from '../../src/helpers/print';
import { getProvider } from '../../src/helpers/providers';

task(
  'uniswapV2Clone:listenToRouterPendingTxs',
  "Listen to all pending transactions received by the given Dex's router."
)
  .addPositionalParam('dexName', 'DEX to consider, e.g. UniswapV2')
  .addOptionalParam('from', 'Restrict to this specific address')
  .setAction(async ({ dexName, from }, hre) => {
    const provider = getProvider(hre);
    const dex = new UniswapV2CloneFactory().create(dexName, provider, hre.network.name);
    dex.listenToRouterPendingTxs((tx) => {
      printParsedTx(tx);
    }, from);
    return wait();
  });
