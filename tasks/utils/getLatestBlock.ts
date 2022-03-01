import { task } from 'hardhat/config';
import { getProvider } from '../../src/helpers/providers';

task('utils:getLatestBlock', 'Print to screen the latest block').setAction(
  async (taskArgs, hre) => {
    const provider = getProvider(hre);
    const block = await provider.getBlock('latest');
    console.log(block);
  }
);
