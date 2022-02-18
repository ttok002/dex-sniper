import { Provider } from "@ethersproject/providers";
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
      throw new Error(`Network URL is not correct, check .env > '${url.href}'`);
  }
}
