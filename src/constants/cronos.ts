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
  USDC: {
    label: "USDC",
    address: "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
    digits: 6,
  },
  USDT: {
    label: "USDT",
    address: "0x66e428c3f67a68878562e79A0234c1F83c208770",
    digits: 6,
  },
};

export const PAIRS_MADMEERKAT: Record<string, Pair> = {
  MMF_WCRO: {
    label: "MMF-WCRO",
    address: "0xba452a1c0875d33a440259b1ea4dca8f5d86d9ae",
    token0: ERC20.MMF,
    token1: ERC20.WCRO,
  },
  CRO_USDC: {
    label: "CRO-USDC",
    address: "0xa68466208F1A3Eb21650320D2520ee8eBA5ba623",
    token0: ERC20.WCRO,
    token1: ERC20.USDC,
  },
};
