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
  creationTx?: string;
  creationBlock?: number;
  firstSwapBlock?: number;
  firstMintBlock?: number;
}

export interface Contract {
  label: string;
  address: string;
}
