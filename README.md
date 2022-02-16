# DEX Sniper

Snipe liquidity on popular decentralized exchanges.

# Quickstart

1. Run `npx hardhat` to see the available bots and scripts
2. Copy the *.env.example* file to *.env* and customize the latter
3. Run one of the commands, for example `npx hardhat uniswapV2:listenToSwap`

# Contracts

### Uniswap v2 - Ethereum

* Uniswap V2: Router 2 > [Etherscan](https://etherscan.io/address/0x7a250d5630b4cf539739df2c5dacb4c659f2488d#code), [Github](https://github.com/Uniswap/v2-periphery/blob/master/contracts/UniswapV2Router02.sol)
* Uniswap V2: Factory > [Etherscan](https://etherscan.io/address/0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f#code),
* Uniswap V2: Pool > [Etherscan](https://etherscan.io/address/0xB9Cfc842824709F11f0127cB86b3C9E440BD6819#code), [Github](https://github.com/Uniswap/v2-core/blob/master/contracts/interfaces/IUniswapV2Pair.sol)
* Uniswap V2: USDC-ETH Pool > [Etherscan](https://etherscan.io/address/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc#code), [Info](https://v2.info.uniswap.org/pair/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc)
* Uniswap V2: USDC-ETH Pool token > [Etherscan](https://etherscan.io/token/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc)

### Uniswap v3 - Ethereum

* [Uniswap V3: Factory](https://etherscan.io/address/0x1f98431c8ad98523631ae4a59f267346ea31f984#code)

### Pancakeswap - BSC

* [PancakeSwap: Router v2](https://bscscan.com/address/0x10ed43c718714eb63d5aa57b78b54704e256024e#code)

### Trader Joe - Avalanche

Trader Joe's contracts are listed on the [official docs](https://docs.traderjoexyz.com/main/security-and-contracts/contracts):

* [JoeRouter02](https://snowtrace.io/address/0x60ae616a2155ee3d9a68541ba4544862310933d4#code)
* [JoeFactory](https://snowtrace.io/address/0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10)
* [JoeToken](https://snowtrace.io/address/0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd)

# To do

* Listen to Trader Joe's pair creations
* Place contract ABIs in artifacts folder

# Done

* Sort out .env
* Use Hardhat signers in scripts instead of relying on dotenv 
* Migrate project to Hardhat & move scripts to tasks