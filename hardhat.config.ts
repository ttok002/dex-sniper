import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import './tasks/index';
import { getenv } from './src/common/dotenv';
import { parseAccounts } from './src/helpers/signers';

/**
 * Configuration for Harhat
 * Go to https://hardhat.org/config/ to learn more
 */
const config: HardhatUserConfig = {
  networks: {
    avalanche: {
      url: getenv('AVALANCHE_URL'),
      accounts: parseAccounts('avalanche'),
      chainId: 43114,
    },
    avalancheValidator: {
      url: getenv('AVALANCHE_VALIDATOR_URL'),
      accounts: parseAccounts('avalanche'),
      chainId: 43114,
    },
    ethereum: {
      url: getenv('ETHEREUM_URL'),
      accounts: parseAccounts('ethereum'),
    },
    cronos: {
      url: getenv('CRONOS_URL'),
      accounts: parseAccounts('cronos'),
      chainId: 25,
    },
  },
};

export default config;
