import { Pair, Token } from "./types";

export const ERC20: Record<string, Token> = {
  MMF: {
    label: "MMF",
    address: "0x97749c9b61f878a880dfe312d2594ae07aed7656",
    digits: 18,
  },
  WCRO: {
    label: "WCRO",
    address: "0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23",
    digits: 18,
  },
  SINGLE: {
    label: "SINGLE",
    address: "0x0804702a4e749d39a35fde73d1df0b1f1d6b8347",
    digits: 18,
  },
};

export const PAIRS_MADMEERKAT: Record<string, Pair> = {
  MMF_WCRO: {
    label: "MMF-WCRO",
    address: "0xba452a1c0875d33a440259b1ea4dca8f5d86d9ae",
    token0: ERC20.MMF,
    token1: ERC20.WCRO,
  },
};
