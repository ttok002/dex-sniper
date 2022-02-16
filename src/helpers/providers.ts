import { NetworkName } from "../common/types";
import { WebSocketProvider } from "@ethersproject/providers/src.ts/index";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * Return a Websocket provider given the HRE.
 *
 * This function is needed until Hardhat implements the
 * feature natively (see https://github.com/nomiclabs/hardhat/issues/2391)
 */
export function getWebsocketProvider(
  networkName: NetworkName, // used to double check we are in the right network
  hre: HardhatRuntimeEnvironment
): WebSocketProvider {
  const c = getNetworkConfig(networkName, hre);
  // @ts-ignore
  const url = c.url;
  return new hre.ethers.providers.WebSocketProvider(url);
}

/**
 * Return the first signer provider for the given
 * network
 */
export function getWebsocketSigner(
  networkName: NetworkName,
  hre: HardhatRuntimeEnvironment
) {
  const c = getNetworkConfig(networkName, hre);
  // @ts-ignore
  const account = c.accounts[0];
  const wallet = new hre.ethers.Wallet(account);
  const provider = getWebsocketProvider(networkName, hre);
  return wallet.connect(provider);
}

/**
 * Making sure the script/task is run with the given network
 * (--network option), and return the network configuration.
 */
function getNetworkConfig(
  networkName: NetworkName,
  { network }: HardhatRuntimeEnvironment
) {
  if (network.name !== networkName) {
    throw new Error(`This task must be run with ---network ${networkName}`);
  }
  return network.config;
}
