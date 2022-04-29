import { task } from 'hardhat/config';
import { UniswapV2CloneFactory } from '../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory';
import { wait } from '../../src/helpers/general';
import { printMintEvent } from '../../src/helpers/print';
import { getProvider } from '../../src/helpers/providers';

task(
  'uniswapV2Clone:listenToPendingAddLiquidity',
  "Listen to all addLiquidity transactions on the given Dex's router."
)
  .addPositionalParam('dexName', 'DEX to consider, e.g. UniswapV2')
  .setAction(async ({ dexName }, hre) => {
    const provider = getProvider(hre);
    const dex = new UniswapV2CloneFactory().create(dexName, provider, hre.network.name);
    dex.listenToPendingAddLiquidity(console.log);
    return wait();
  });
