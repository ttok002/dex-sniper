import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { URL } from 'url';
import { logger, LOGGING, onProviderDebug } from '../common/logger';

/**
 * Return either an HTTP Provider or a WebSocket provider
 * depending on the network URL given to Hardhat.
 */
export function getProvider({ network, ethers }: HardhatRuntimeEnvironment): Provider {
  const url = new URL((network as any).config.url);
  logger.debug(`> Node: ${url}`);
  let provider: Provider;
  switch (url.protocol) {
    case 'http:':
    case 'https:':
      provider = new ethers.providers.JsonRpcProvider(url.href);
      break;
    case 'wss:':
      provider = new ethers.providers.WebSocketProvider(url.href);
      break;
    default:
      throw new Error(`Network URL not valid: '${url.href}'`);
  }
  // Debug
  if (LOGGING) {
    provider.on('debug', onProviderDebug);
  }
  return provider;
}

/**
 * Return a wallet able to sign transactions, using
 * the first private key provided for the current network
 */
export function getSigner(hre: HardhatRuntimeEnvironment, provider?: Provider): Signer {
  if (!provider) {
    provider = getProvider(hre);
  }
  const { network, ethers } = hre;
  const keyOfFirstAccount = (network as any).config.accounts[0] as string;
  return new ethers.Wallet(keyOfFirstAccount, provider);
}
