# DEX Sniper

Snipe liquidity on popular decentralized exchanges.

# Quickstart

1. Run `npx hardhat` to see the available bots and scripts
2. Copy the _.env.example_ file to _.env_ and customize the latter
3. Run one of the commands, for example `npx hardhat uniswapV2:listenToSwap`

# Contracts

### Uniswap v2 - Ethereum

- Uniswap V2: Router 2 > [Etherscan](https://etherscan.io/address/0x7a250d5630b4cf539739df2c5dacb4c659f2488d#code), [Github](https://github.com/Uniswap/v2-periphery/blob/master/contracts/UniswapV2Router02.sol)
- Uniswap V2: Factory > [Etherscan](https://etherscan.io/address/0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f#code),
- Uniswap V2: Pool > [Etherscan](https://etherscan.io/address/0xB9Cfc842824709F11f0127cB86b3C9E440BD6819#code), [Github](https://github.com/Uniswap/v2-core/blob/master/contracts/interfaces/IUniswapV2Pair.sol)
- Uniswap V2: Library > [Github](https://github.com/Uniswap/v2-periphery/blob/master/contracts/libraries/UniswapV2Library.sol), [Documentation](https://docs.uniswap.org/protocol/V2/reference/smart-contracts/library)
- Uniswap V2: USDC-ETH Pool > [Etherscan](https://etherscan.io/address/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc#code), [Info](https://v2.info.uniswap.org/pair/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc)
- Uniswap V2: USDC-ETH Pool token > [Etherscan](https://etherscan.io/token/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc)

The contract addresses of Uniswap V2's pairs can be found on their [Info Site](https://v2.info.uniswap.org/pairs):

- [USDC-ETH V2 Pair](https://etherscan.io/address/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc#code)
- [ETH-USDT V2 Pair](https://etherscan.io/address/0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852#code)

### Uniswap v3 - Ethereum

- [Uniswap V3: Factory](https://etherscan.io/address/0x1f98431c8ad98523631ae4a59f267346ea31f984#code)

### Pancakeswap - BSC

- [PancakeSwap: Router v2](https://bscscan.com/address/0x10ed43c718714eb63d5aa57b78b54704e256024e#code)

### Trader Joe - Avalanche

Trader Joe's contracts are listed on the [official docs](https://docs.traderjoexyz.com/main/security-and-contracts/contracts):

- [JoeRouter02](https://snowtrace.io/address/0x60ae616a2155ee3d9a68541ba4544862310933d4#code)
- [JoeFactory](https://snowtrace.io/address/0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10)
- [JoeToken](https://snowtrace.io/address/0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd)

The contract addresses of Trader Joe's pairs can be found on their [Analytics Page](https://analytics.traderjoexyz.com/pairs):

- [USDC.e-WAVAX Pair](https://snowtrace.io/address/0xa389f9430876455c36478deea9769b7ca4e3ddb1#code)
- [AVAX-TUS Pair](https://snowtrace.io/address/0x565d20bd591b00ead0c927e4b6d7dd8a33b0b319#code)

# To do

- Optimize: compute gas manually?
- Nonce: make sure the nonce is correctly update if the transaction fails (or maybe simply update it with on-chain data?)
- Debug: printSwapReceipt should include swapped amounts from event
- Refactor: how to simplify tasks with common args?
- Optimize: batch requests? https://github.com/ethers-io/ethers.js/issues/892
- Docs: Provide examples on how to run tasks
- Tooling: Provide easy way to input addresses from CLI (preload tickers in ENV?)
- Tooling: Use Hardhat typechain mechanism to automatically generate types for event args

# Done

- Optimize: continuous listening for snipes
- Fast Nonce: increment "manually" nonce after succesfull tx
- Optimize: input nonce manually? Yes!
- Logging requests
- Snipe liquidity
- Swap task
- In order to snipe should we listen to add liquidity or pair creation? > Add liquidity first
- Listen to add and remove liquidity (mint and burn) in DEX class
- Listen to pair creation method in DEX class
- Script to track first N swaps for the given pair
- DEX classes: UniswapV2 and TraderJoe
- Listen to Trader Joe's pair creations
- Sort out .env
- Use Hardhat signers in scripts instead of relying on dotenv
- Migrate project to Hardhat & move scripts to tasks
