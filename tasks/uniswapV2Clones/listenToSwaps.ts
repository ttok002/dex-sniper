import { task } from 'hardhat/config';
import { UniswapV2CloneFactory } from '../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory';
import { wait } from '../../src/helpers/general';
import { printSwapEvent } from '../../src/helpers/print';
import { getProvider } from '../../src/helpers/providers';

task('uniswapV2Clone:listenToSwaps', 'Listen to Swap events on the given Dex and pair.')
  .addPositionalParam('dexName', 'DEX to consider, e.g. UniswapV2')
  .addPositionalParam('pair', 'Pair to spy')
  .setAction(async ({ dexName, pair }, hre) => {
    const provider = getProvider(hre);
    const dex = new UniswapV2CloneFactory().create(dexName, provider, hre.network.name);
    dex.listenToSwap(pair, printSwapEvent);
    return wait();
  });
