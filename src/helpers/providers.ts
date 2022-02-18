import { WebSocketProvider } from "@ethersproject/providers/src.ts/index";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getenv } from "../common/dotenv";

/**
 * Return an HTTP provider given the HRE.
 */
export function getHttpProvider(
  hre: HardhatRuntimeEnvironment
): JsonRpcProvider {
  // @ts-ignore
  const url = hre.network.config.url;
  return new hre.ethers.providers.JsonRpcProvider(url);
}

/**
 * Return a Websocket provider given the HRE; the Websocket
 * URL needs to be configured in .env.
 *
 * This function is needed until Hardhat implements the
 * feature natively (see https://github.com/nomiclabs/hardhat/issues/2391)
 */
export function getWebsocketProvider(
  hre: HardhatRuntimeEnvironment
): WebSocketProvider {
  // @ts-ignore
  const url = getWebsocketUrl(hre.network.name);
  return new hre.ethers.providers.WebSocketProvider(url);
}

/**
 * Return the first signer for the given network
 */
export function getWebsocketSigner(hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const account = hre.network.config.accounts[0];
  const wallet = new hre.ethers.Wallet(account);
  const provider = getWebsocketProvider(hre);
  return wallet.connect(provider);
}

/**
 * Return the Websocket node URL for the given network, as
 * specified in .env
 */
export function getWebsocketUrl(network: string): string {
  let url: string;
  switch (network) {
    case "ethereum":
      url = getenv("ETHEREUM_WS_URL");
      break;
    case "avalanche":
      url = getenv("AVALANCHE_WS_URL");
      break;
    default:
      throw new Error(`Network ${network} not recognized`);
  }
  if (!url) {
    throw new Error(`Missing Websocket URL for network '${network}'`);
  }
  return url;
}
