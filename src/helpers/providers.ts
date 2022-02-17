import { WebSocketProvider } from "@ethersproject/providers/src.ts/index";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * Return a Websocket provider given the HRE.
 *
 * This function is needed until Hardhat implements the
 * feature natively (see https://github.com/nomiclabs/hardhat/issues/2391)
 */
export function getWebsocketProvider(
  hre: HardhatRuntimeEnvironment
): WebSocketProvider {
  // @ts-ignore
  const url = hre.network.config.url;
  return new hre.ethers.providers.WebSocketProvider(url);
}

/**
 * Return the first signer provider for the given
 * network
 */
export function getWebsocketSigner(hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const account = hre.network.config.accounts[0];
  const wallet = new hre.ethers.Wallet(account);
  const provider = getWebsocketProvider(hre);
  return wallet.connect(provider);
}
