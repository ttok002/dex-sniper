import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import './tasks/index';
import { getenv } from './src/common/dotenv';
import { getNetworkAccounts } from './src/common/config';

/**
 * Configuration for Harhat
 * Go to https://hardhat.org/config/ to learn more
 */
const config: HardhatUserConfig = {
  networks: {
    avalanche: {
      url: getenv('AVALANCHE_URL'),
      accounts: getNetworkAccounts('avalanche').map((a) => a.key),
      chainId: 43114,
    },
    avalancheValidator: {
      url: getenv('AVALANCHE_VALIDATOR_URL'),
      accounts: getNetworkAccounts('avalanche').map((a) => a.key),
      chainId: 43114,
    },
    ethereum: {
      url: getenv('ETHEREUM_URL'),
      accounts: getNetworkAccounts('ethereum').map((a) => a.key),
    },
    cronos: {
      url: getenv('CRONOS_URL'),
      accounts: getNetworkAccounts('cronos').map((a) => a.key),
      chainId: 25,
    },
  },
};

export default config;
