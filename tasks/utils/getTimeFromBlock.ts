import { task, types } from 'hardhat/config';
import { getProvider } from '../../src/helpers/providers';
import moment from 'moment';

task('utils:getTimeFromBlock', 'Given a block number, return its timestamp and its time')
  .addPositionalParam('blockNumber', 'Number of the block', undefined, types.int)
  .setAction(async ({ blockNumber }, hre) => {
    const provider = getProvider(hre);
    const timestamp = (await provider.getBlock(blockNumber)).timestamp;
    const formatteDate = moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss');
    console.log(`Timestamp = ${timestamp}`);
    console.log(`Formatted = ${formatteDate}`);
  });
