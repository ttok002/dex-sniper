/**
 * Listen to newly created pairs on Uniswap V3.
 *
 * Source: https://www.youtube.com/watch?v=a5at-FEyITQ
 */

import { getenv } from "../../src/common/dotenv";
import { task } from "hardhat/config";

task(
  "uniswapV3:listenToPoolCreated",
  "Listen to newly created pairs on Uniswap V3."
).setAction(async (taskArgs, { ethers }) => {
  // CONFIG
  const addresses = {
    factory: "0x1f98431c8ad98523631ae4a59f267346ea31f984",
  };

  // ACCOUNT
  const wallet = new ethers.Wallet(getenv("USER_PRIVATE_KEY"));
  const provider = new ethers.providers.WebSocketProvider(
    getenv("ETHEREUM_WEB3_PROVIDER_URI")
  );
  const account = wallet.connect(provider);

  // CONTRACTS
  const factory = new ethers.Contract(
    addresses.factory,
    [
      "event PoolCreated(address indexed token0, address indexed token1, uint24 fee, int24 tickSpacing, address pool)",
    ],
    account
  );

  // EXEC
  return new Promise((resolve, reject) => {
    factory.on(
      "PoolCreated",
      async (token0, token1, fee, tickSpacing, pool) => {
        console.log(`
          New pool detected
          =================
          token0: ${token0}
          token1: ${token1}
          fee: ${fee}
          tickSpacing: ${tickSpacing}
          pool: ${pool}
        `);
        resolve(null);
      }
    );
  });
});
