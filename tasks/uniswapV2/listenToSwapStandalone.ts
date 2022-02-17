/**
 * Listen to swaps on Uniswap.
 */

import { task } from "hardhat/config";
import { getWebsocketProvider } from "../../src/helpers/providers";
import { wait } from "../../src/helpers/general";

task("uniswapV2:listenToSwapStandalone", "Listen to swaps on Uniswap.")
  .addOptionalPositionalParam(
    "pair",
    "Pair to spy, default is USDC-ETH",
    "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc" // USDC-ETH pair
  )
  .setAction(async ({ pair }, hre) => {
    // CONFIG
    const { ethers } = hre;
    const addresses = {
      pool: pair,
    };

    // ACCOUNT
    const provider = getWebsocketProvider(hre);

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
      provider
    );

    // EXEC
    pool.on(
      "Swap",
      async (sender, amount0In, amount1In, amount0Out, amount1Out, to, tx) => {
        console.log(new Date());
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
      }
    );
    return wait();
  });
