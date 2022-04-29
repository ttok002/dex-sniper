import { task } from 'hardhat/config';
import { getProvider } from '../../src/helpers/providers';

task('time:getProvider', 'Print the time it takes to initialize the provider').setAction(
  async (taskArgs, hre) => {
    console.time();
    getProvider(hre);
    console.timeEnd();
  }
);
