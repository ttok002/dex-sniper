import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { URL } from 'url';
import { logger, LOGGING, onProviderDebug } from '../common/logger';
import Web3WsProvider from 'web3-providers-ws';
import { WebSocketProvider } from '@ethersproject/providers';

/**
 * Return either an HTTP Provider or a WebSocket provider
 * depending on the network URL given to Hardhat.
 *
 * If you use a websocket, set useWeb3WsProvider=true' to use a
 * Web3 websocket provider with keep-alive support and automatic
 * reconnect > https://www.npmjs.com/package/web3-providers-ws
 * Credits to jophish for this solution:
 * https://github.com/ethers-io/ethers.js/issues/1053#issuecomment-1068211154
 */
export function getProvider(
  { network, ethers }: HardhatRuntimeEnvironment,
  useWeb3WsProvider: boolean = false
): Provider {
  const url = new URL((network as any).config.url);
  logger.debug(`> Node: ${url}`);
  let provider: Provider;
  switch (url.protocol) {
    case 'http:':
    case 'https:':
      provider = new ethers.providers.JsonRpcProvider(url.href);
      break;
    case 'wss:':
      if (useWeb3WsProvider) {
        provider = new ethers.providers.Web3Provider(
          new (Web3WsProvider as any)(url.href, {
            // TODO: Not sure the keepalive config applies here...
            // Client configs > https://github.com/theturtle32/WebSocket-Node/blob/v1.0.31/docs/WebSocketClient.md#client-config-options
            // Server configs > https://github.com/theturtle32/WebSocket-Node/blob/v1.0.31/docs/WebSocketServer.md#server-config-options
            clientConfig: {
              keepalive: true,
              keepaliveInterval: 60000, // ms
            },
            reconnect: {
              auto: true,
              delay: 1000, // ms
              maxAttempts: 5,
              onTimeout: false,
            },
          })
        );
      } else {
        provider = new ethers.providers.WebSocketProvider(url.href);
      }
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

/**
 * Start a keep-alive WebSocket connection
 *
 * https://github.com/ethers-io/ethers.js/issues/1053#issuecomment-808736570
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
      logger.debug('Checking if the connection is alive, sending a ping');
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
    logger.warn('The websocket connection was closed');
    clearInterval(keepAliveInterval);
    clearTimeout(pingTimeout);
    startConnection(hre, onOpen);
  });

  provider._websocket.on('pong', () => {
    logger.debug('Received pong, so connection is alive, clearing the timeout');
    clearInterval(pingTimeout);
  });
}
