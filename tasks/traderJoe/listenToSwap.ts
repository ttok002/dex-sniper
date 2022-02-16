/**
 * Listen to swaps on Trader Joe
 */

import { task } from "hardhat/config";
import { wait } from "../../src/helpers/general";
import { getWebsocketProvider } from "../../src/helpers/providers";

task("traderJoe:listenToSwap", "Listen to swaps on Trader Joe.")
  .addOptionalPositionalParam(
    "pair",
    "Pair to spy, default is USDC.e-WAVAX",
    "0xa389f9430876455c36478deea9769b7ca4e3ddb1" // USDC.e-WAVAX pair
  )
  .setAction(async ({ pair }, hre) => {
    // CONFIG
    const { ethers } = hre;
    const addresses = {
      pool: pair,
    };

    // ACCOUNT
    const provider = getWebsocketProvider("avalanche", hre);

    // CONTRACTS
    const pool = new ethers.Contract(
      addresses.pool,
      [
        "event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to)",
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
