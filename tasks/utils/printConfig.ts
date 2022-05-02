import { task } from 'hardhat/config';
import { accounts } from '../../src/common/config';
import { prepare, prettyPrint } from '../../src/helpers/print';

task(
  'utils:printConfig',
  'Print the configuration passed in .env. THIS WILL PRINT PRIVATE KEYS!'
).setAction(async (taskArgs, hre) => {
  accounts.forEach((a, i) => prettyPrint(`Account ${i + 1}`, prepare(a)));
});
