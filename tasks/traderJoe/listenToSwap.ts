/**
 * Listen to swaps on Trader Joe
 */

import { task } from "hardhat/config";
import { wait } from "../../src/helpers/general";
import { getWebsocketProvider } from "../../src/helpers/providers";

task("traderJoe:listenToSwap", "Listen to swaps on Trader Joe.").setAction(
  async (taskArgs, hre) => {
    // CONFIG
    const { ethers } = hre;
    const addresses = {
      router: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
    };

    // ACCOUNT
    const provider = getWebsocketProvider("avalanche", hre);

    // CONTRACTS
    const router = new ethers.Contract(
      addresses.router,
      [
        "event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to)",
      ],
      provider
    );

    // EXEC
    router.on(
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
    wait();
  }
);
