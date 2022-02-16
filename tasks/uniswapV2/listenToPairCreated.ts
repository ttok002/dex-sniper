/**
 * Listen to newly created pairs on Uniswap V2.
 *
 * Thanks to Eat the Blocks for the original code,
 * which I have adapted here.
 *
 * Source: https://www.youtube.com/watch?v=a5at-FEyITQ
 */

import { task } from "hardhat/config";
import { wait } from "../../src/helpers/general";
import { getWebsocketProvider } from "../../src/helpers/providers";

task(
  "uniswapV2:listenToPairCreated",
  "Listen to newly created pairs on Uniswap V2."
).setAction(async (taskArgs, hre) => {
  const { ethers } = hre;
  // CONFIG
  const addresses = {
    factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  };

  // ACCOUNT
  const provider = getWebsocketProvider("ethereum", hre);

  // CONTRACTS
  const factory = new ethers.Contract(
    addresses.factory,
    [
      "event PairCreated(address indexed token0, address indexed token1, address pair, uint)",
    ],
    provider
  );

  // EXEC
  factory.on("PairCreated", async (token0, token1, pairAddress) => {
    console.log(new Date());
    console.log(`
      New pair detected
      =================
      token0: ${token0}
      token1: ${token1}
      pairAddress: ${pairAddress}
    `);
  });
  return wait();
});
