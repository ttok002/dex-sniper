/**
 * Listen to swaps on the USDC-ETH V2 pair on Uniswap.
 */

import { getenv } from "../../src/common/dotenv";
import { task } from "hardhat/config";

task(
  "uniswapV2:listenToSwap",
  "Listen to swaps on the USDC-ETH V2 pair on Uniswap."
).setAction(async (taskArgs, { ethers }) => {
  // CONFIG
  const addresses = {
    // USDC-ETH Pair
    pool: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
  };

  // ACCOUNT
  const wallet = new ethers.Wallet(getenv("USER_PRIVATE_KEY"));
  const provider = new ethers.providers.WebSocketProvider(
    getenv("ETHEREUM_WEB3_PROVIDER_URI")
  );
  const account = wallet.connect(provider);

  // CONTRACTS
  const pool = new ethers.Contract(
    addresses.pool,
    [
      "event Mint(address indexed sender, uint amount0, uint amount1)",
      "event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)",
      "event Sync(uint112 reserve0, uint112 reserve1)",
      "event Transfer(address indexed from, address indexed to, uint value)",
      "event Approval(address indexed owner, address indexed spender, uint value)",
    ],
    account
  );

  // EXEC
  return new Promise((resolve, reject) => {
    pool.on(
      "Swap",
      async (sender, amount0In, amount1In, amount0Out, amount1Out, to, tx) => {
        console.log(`
          New swap detected
          =================
          sender: ${sender}
          amount0In: ${ethers.utils.formatUnits(amount0In, 6)}
          amount1In: ${ethers.utils.formatUnits(amount1In)}
          amount0Out: ${ethers.utils.formatUnits(amount0Out, 6)}
          amount1Out: ${ethers.utils.formatUnits(amount1Out)}
          to: ${to}
          block: ${tx.blockNumber}
        `);
        resolve(null);
      }
    );
  });
});
