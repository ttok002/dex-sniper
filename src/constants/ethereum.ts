import { Pair, Token } from './types';

export const ERC20: Record<string, Token> = {
  USDC: {
    label: 'USDC',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    digits: 6,
  },
  WETH: {
    label: 'WETH',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    digits: 18,
  },
};

export const PAIRS_UNISWAPV2: Record<string, Pair> = {
  USDC_WETH: {
    label: 'USDC-WETH',
    address: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
    creationBlock: 10008355,
    token0: ERC20.USDC,
    token1: ERC20.WETH,
  },
};
