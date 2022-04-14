import { ethers } from 'ethers';
import { task, types } from 'hardhat/config';
import { UniswapV2CloneFactory } from '../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory';
import { getProvider } from '../../src/helpers/providers';

task('uniswapV2Clone:getReserves', 'Print the reserves of the given liquidity pair.')
  .addPositionalParam('dexName', 'DEX to consider, e.g. UniswapV2')
  .addPositionalParam('pair', 'Address of the pair to analyze')
  .addOptionalParam('digits0', '1st token digits', 18, types.int)
  .addOptionalParam('digits1', '2nd token digits', 18, types.int)
  .setAction(async ({ dexName, pair, digits0, digits1 }, hre) => {
    const provider = getProvider(hre);
    const dex = new UniswapV2CloneFactory().create(dexName, provider, hre.network.name);
    const reserves = await dex.getReserves(pair);
    console.log('>>> RESERVES IN WEI');
    console.log(`_reserve0 = ${reserves[0]}`);
    console.log(`_reserve1 = ${reserves[1]}`);
    console.log('>>> RESERVES IN ETH');
    console.log(`_reserve0 = ${ethers.utils.formatUnits(reserves[0], digits0)}`);
    console.log(`_reserve1 = ${ethers.utils.formatUnits(reserves[1], digits1)}`);
    console.log('>>> LAST SWAP');
    console.log(`_blockTimestampLast = ${reserves[2]}`);
  });
