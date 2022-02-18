import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "./tasks/index";
import { getenv } from "./src/common/dotenv";

/**
 * Configuration for Harhat
 * Go to https://hardhat.org/config/ to learn more
 */
const config: HardhatUserConfig = {
  networks: {
    avalanche: {
      url: getenv("AVALANCHE_URL"),
      accounts: getenv("AVALANCHE_PRIVATE_KEY")
        ? [getenv("AVALANCHE_PRIVATE_KEY")]
        : [],
      chainId: 43114,
    },
    ethereum: {
      url: getenv("ETHEREUM_URL"),
      accounts: getenv("ETHEREUM_PRIVATE_KEY")
        ? [getenv("ETHEREUM_PRIVATE_KEY")]
        : [],
    },
    cronos: {
      url: getenv("CRONOS_URL"),
      accounts: getenv("CRONOS_PRIVATE_KEY")
        ? [getenv("CRONOS_PRIVATE_KEY")]
        : [],
      chainId: 25,
    },
  },
};

export default config;
