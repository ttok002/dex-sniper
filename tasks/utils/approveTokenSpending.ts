import { task, types } from 'hardhat/config';
import { printTxReceipt } from '../../src/helpers/print';
import { MAX_UINT256 } from '../../src/constants/general';
import { getSigner } from '../../src/helpers/signers';

task('utils:approveTokenSpending', 'Approve spending for the given ERC20 token')
  .addParam('account', "Who's approving the spending")
  .addPositionalParam('tokenAddress', 'Address of the token to approve spending for')
  .addPositionalParam('spenderAddress', 'Address allowed to spend the token (e.g. a DEX router)')
  .addOptionalPositionalParam('amount', 'Amount to approve, in Wei; default is infinite', undefined)
  .setAction(async ({ account, tokenAddress, spenderAddress, amount }, hre) => {
    const token = new hre.ethers.Contract(
      tokenAddress,
      ['function approve(address spender, uint256 amount)'],
      getSigner(hre, account)
    );
    if (!amount) {
      amount = MAX_UINT256;
    }
    const tx = await token.approve(spenderAddress, amount);
    printTxReceipt(await tx.wait());
  });
