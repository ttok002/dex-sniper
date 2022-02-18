export interface Token {
  label: string;
  address: string;
  digits: number;
}

export interface Pair {
  label: string;
  address: string;
  creationBlock?: number;
  token0: Token;
  token1: Token;
}
