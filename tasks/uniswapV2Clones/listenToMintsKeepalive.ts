import { task } from 'hardhat/config';
import { UniswapV2CloneFactory } from '../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory';
import { wait } from '../../src/helpers/general';
import { printMintEvent } from '../../src/helpers/print';
import { startConnection } from '../../src/helpers/providers';

task(
  'uniswapV2Clone:listenToMintsKeepalive',
  'Listen to Mint events (add liquidity) on the given Dex and pair. If the websocket connection drops (e.g. due to inactivity), the task will try to reconnect.'
)
  .addPositionalParam('dexName', 'DEX to consider, e.g. UniswapV2')
  .addPositionalParam('pair', 'Pair to spy')
  .setAction(async ({ dexName, pair }, hre) => {
    startConnection(hre, (hre, provider) => {
      const dex = new UniswapV2CloneFactory().create(dexName, provider, hre.network.name);
      dex.listenToMint(pair, printMintEvent);
    });
    return wait();
  });
