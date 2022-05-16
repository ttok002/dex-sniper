import { task } from 'hardhat/config';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { getSigner } from '../../src/helpers/signers';
import axios from 'axios';
import { parseUnits } from 'ethers/lib/utils';

task(
  'snowSight:propagateTx',
  'Send an example TX (self-send 1 wei) through the SnowSight transaction propagator. Docs: https://docs.snowsight.chainsight.dev/snowsight/services/transaction-propagator'
)
  .addParam('account', 'The account to use; must have paid on SnowSight')
  .setAction(async ({ account }, hre) => {
    // Authenticate with SnowSight
    const signer = getSigner(hre, account);
    const signedKey = await signer.signMessage(
      'Sign this message to authenticate your wallet with Snowsight.'
    );

    // Build and sign transaction
    const txRequest: TransactionRequest = {
      from: await signer.getAddress(),
      to: await signer.getAddress(),
      nonce: await signer.getTransactionCount(),
      value: 1,
      maxFeePerGas: parseUnits('200', 'gwei'),
      maxPriorityFeePerGas: parseUnits('2.5', 'gwei'),
      gasLimit: 26000,
      chainId: 43114,
      type: 2,
    };
    console.log('>>> TX TO BE SENT');
    console.log(txRequest);

    // Send TX using the propagator
    const signedTx = await signer.signTransaction(txRequest);
    const packet = { signed_key: signedKey, raw_tx: signedTx };
    return axios
      .post('http://tx-propagator.snowsight.chainsight.dev:8081', JSON.stringify(packet))
      .then((res) => {
        console.log('>>> STATUS');
        console.log(res.status);
        console.log('>>> HEADERS');
        console.log(res.headers);
        console.log('>>> DATA');
        console.log(res.data);
      });
  });
