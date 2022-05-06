import { Provider } from '@ethersproject/providers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { URL } from 'url';
import { logger, LOGGING, onProviderDebug } from '../common/logger';
import { WebSocketProvider } from '@ethersproject/providers';
import { getenv } from '../common/dotenv';
import { getSafeUrl } from './general';

/**
 * Return either an HTTP Provider or a WebSocket provider
 * depending on the network URL given to Hardhat.
 */
export function getProvider({ network, ethers }: HardhatRuntimeEnvironment): Provider {
  const url = new URL((network as any).config.url);
  logger.debug(`> Node: ${getSafeUrl(url)}`);
  let provider: Provider;
  switch (url.protocol) {
    case 'http:':
    case 'https:':
      provider = new ethers.providers.JsonRpcProvider({
        url: url.href,
        user: getenv('BASICAUTH_USER'),
        password: getenv('BASICAUTH_PASSWORD'),
      });
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
 * Start a keep-alive WebSocket connection in Hardhat.
 *
 * Usage:
 *
 *   startConnection(hre, async (hre, provider) => {
 *     // Your code here
 *   }
 *
 * Source: https://github.com/ethers-io/ethers.js/issues/1053#issuecomment-808736570
 */
export function startConnection(
  hre: HardhatRuntimeEnvironment,
  onOpen: (hre: HardhatRuntimeEnvironment, p: WebSocketProvider) => void,
  expectedPongBack: number = 15000,
  keepAliveCheckInterval: number = 7500
): void {
  const provider: WebSocketProvider = getProvider(hre) as WebSocketProvider;

  let pingTimeout: NodeJS.Timeout;
  let keepAliveInterval: NodeJS.Timeout;

  provider._websocket.on('open', () => {
    keepAliveInterval = setInterval(() => {
      logger.debug('> Checking if the connection is alive, sending a ping');
      provider._websocket.ping();
      // Delay should be equal to the interval at which your server
      // sends out pings plus a conservative assumption of the latency.
      pingTimeout = setTimeout(() => {
        provider._websocket.terminate();
      }, expectedPongBack);
    }, keepAliveCheckInterval);

    onOpen(hre, provider);
  });

  provider._websocket.on('close', () => {
    logger.warn('> WARNING: The websocket connection was closed');
    clearInterval(keepAliveInterval);
    clearTimeout(pingTimeout);
    startConnection(hre, onOpen);
  });

  provider._websocket.on('pong', () => {
    logger.debug('> Received pong, so connection is alive, clearing the timeout');
    clearInterval(pingTimeout);
  });
}
