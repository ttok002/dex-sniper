# DEX Sniper

Snipe liquidity on popular decentralized exchanges.

# Quickstart

1. Make sure you have Node.js v16, or install it with [`nvm`](https://github.com/nvm-sh/nvm#installing-and-updating).
1. Clone the project somewhere: `git clone https://github.com/coccoinomane/dex-sniper.git`.
1. Run `npm install` in the project's directory.
1. Copy _.env.example_ in _.env._.
1. Configure _.env_.
1. Run `npx hardhat` to see the available commands.

# Examples

### - Listen to swaps

Print the swaps on the TraderJoe USDC.e-WAVAX pair as they happen:

```bash
npx hardhat uniswapV2Clone:listenToSwaps TraderJoe 0xa389f9430876455c36478deea9769b7ca4e3ddb1  --network avalanche
```

You can add a `--from` parameter to restrict to a specific interacting address.

### - Listen to pending txs

```bash
npx hardhat utils:listenToPendingTxs --from <wallet address> --network avalanche
```
