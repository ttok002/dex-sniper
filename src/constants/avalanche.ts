import { Pair, Token } from './types';

export const ERC20: Record<string, Token> = {
  USDCE: {
    label: 'USDC.e',
    address: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
    digits: 6,
  },
  WAVAX: {
    label: 'WAVAX',
    address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    digits: 18,
  },
  HEC: {
    label: 'HEC Heroes chained',
    address: '0xc7f4debc8072e23fe9259a5c0398326d8efb7f5c',
    digits: 18,
  },
  DFIAT: {
    label: 'DFIAT Defiato',
    address: '0xafe3d2a31231230875dee1fa1eef14a412443d22',
    digits: 18,
  },
  ISA: {
    label: 'ISA',
    address: '0x3EeFb18003D033661f84e48360eBeCD181A84709',
    digits: 18,
  },
};

export const PAIRS_TRADERJOE: Record<string, Pair> = {
  USDCE_WAVAX: {
    label: 'USDC.e-WAVAX',
    address: '0xa389f9430876455c36478deea9769b7ca4e3ddb1',
    token0: ERC20.USDCE,
    token1: ERC20.WAVAX,
  },
  WAVAX_HEC: {
    label: 'WAVAX-HEC',
    address: '0x4dc5291cdc7ad03342994e35d0ccc76de065a566',
    token0: ERC20.WAVAX,
    token1: ERC20.HEC,
    creationBlock: 9663491,
    firstSwapBlock: 9780566,
    firstMintBlock: 9780566,
  },
  WAVAX_DFIAT: {
    label: 'WAVAX-DFIAT',
    address: '0x4dc5291cdc7ad03342994e35d0ccc76de065a566',
    token0: ERC20.WAVAX,
    token1: ERC20.DFIAT,
  },
  ISA_WAVAX: {
    label: 'ISA-WAVAX',
    address: '0x9155f441ffdfa81b13e385bfac6b3825c05184ee',
    token0: ERC20.ISA,
    token1: ERC20.WAVAX,
    creationBlock: 9228111,
  },
};
