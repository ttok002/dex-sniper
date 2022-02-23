import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { URL } from "url";

/**
 * Return either an HTTP Provider or a WebSocket provider
 * depending on the network URL given to Hardhat.
 */
export function getProvider(hre: HardhatRuntimeEnvironment): Provider {
  // @ts-ignore
  const url = new URL(hre.network.config.url);
  console.log(`Node: ${url}`);
  switch (url.protocol) {
    case "http:":
    case "https:":
      return new hre.ethers.providers.JsonRpcProvider(url.href);
    case "wss:":
      return new hre.ethers.providers.WebSocketProvider(url.href);
    default:
      throw new Error(`Network URL not valid: '${url.href}'`);
  }
}

/**
 * Return a wallet able to sign transactions, using
 * the first private key provided for the current network
 */
export function getSigner(
  hre: HardhatRuntimeEnvironment,
  provider?: Provider
): Signer {
  if (!provider) {
    provider = getProvider(hre);
  }
  // @ts-ignore
  const keyOfFirstAccount = hre.network.config.accounts[0] as string;
  return new hre.ethers.Wallet(keyOfFirstAccount, provider);
}
