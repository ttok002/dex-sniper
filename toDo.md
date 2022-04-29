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
