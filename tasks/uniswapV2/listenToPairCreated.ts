/**
 * Listen to newly created pairs on Uniswap V2.
 *
 * Thanks to Eat the Blocks for the original code,
 * which I have adapted here.
 *
 * Source: https://www.youtube.com/watch?v=a5at-FEyITQ
 */

import { getenv } from "../../src/common/dotenv";
import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task(
  "uniswapV2:listenToPairCreated",
  "Listen to newly created pairs on Uniswap V2."
).setAction(async (taskArgs, { ethers }) => {
  // CONFIG
  const addresses = {
    factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
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
      "event PairCreated(address indexed token0, address indexed token1, address pair, uint)",
    ],
    account
  );

  // EXEC
  return new Promise((resolve, reject) => {
    factory.on("PairCreated", async (token0, token1, pairAddress) => {
      console.log(`
        New pair detected
        =================
        token0: ${token0}
        token1: ${token1}
        pairAddress: ${pairAddress}
      `);
      resolve(null);
    });
  });
});
