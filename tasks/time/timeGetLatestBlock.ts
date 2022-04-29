import { task } from 'hardhat/config';
import { getProvider } from '../../src/helpers/providers';

task('time:getLatestBlock', 'Print the time it takes to fetch the latest block').setAction(
  async (taskArgs, hre) => {
    const provider = getProvider(hre);
    console.time();
    await provider.getBlock('latest');
    console.timeEnd();
  }
);
