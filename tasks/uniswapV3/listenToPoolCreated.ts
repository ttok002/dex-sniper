/**
 * Listen to newly created pairs on Uniswap V3.
 *
 * Source: https://www.youtube.com/watch?v=a5at-FEyITQ
 */

import { task } from 'hardhat/config';
import { wait } from '../../src/helpers/general';
import { getProvider } from '../../src/helpers/providers';

task('uniswapV3:listenToPoolCreated', 'Listen to newly created pairs on Uniswap V3.').setAction(
  async (taskArgs, hre) => {
    // CONFIG
    const { ethers } = hre;
    const addresses = {
      factory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
    };

    // ACCOUNT
    const provider = getProvider(hre);

    // CONTRACTS
    const factory = new ethers.Contract(
      addresses.factory,
      [
        'event PoolCreated(address indexed token0, address indexed token1, uint24 fee, int24 tickSpacing, address pool)',
      ],
      provider
    );

    // EXEC
    console.log(new Date());
    factory.on('PoolCreated', async (token0, token1, fee, tickSpacing, pool) => {
      console.log(`
      New pool detected
      =================
      token0: ${token0}
      token1: ${token1}
      fee: ${fee}
      tickSpacing: ${tickSpacing}
      pool: ${pool}
    `);
    });
    return wait();
  }
);
