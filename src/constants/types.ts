export interface Token {
  label: string;
  address: string;
  digits: number;
}

export interface Pair {
  label: string;
  address: string;
  token0: Token;
  token1: Token;
  creationBlock?: number;
  firstSwapBlock?: number;
  firstMintBlock?: number;
}
