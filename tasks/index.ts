/**
 * Import here the tasks you want to be callable
 * throught the Hardhat CLI
 */

// General purposes tasks
import "./uniswapV2Clones/getRecentSwaps";
import "./uniswapV2Clones/getRecentPairCreations";
import "./uniswapV2Clones/getPairCreationTx";
import "./uniswapV2Clones/getFirstSwaps";
import "./uniswapV2Clones/getFirstMints";
import "./uniswapV2Clones/getRecentMints";
import "./uniswapV2Clones/listenToSwaps";
import "./uniswapV2Clones/listenToMints";
import "./uniswapV2Clones/listenToBurns";
import "./uniswapV2Clones/listenToPairCreated";

// DEX-specific tasks
import "./uniswapV2/listenToPairCreated";
import "./uniswapV2/listenToSwap";
import "./uniswapV2/listenToSwapStandalone";
import "./uniswapV3/listenToPoolCreated";
import "./traderJoe/listenToSwap";
import "./traderJoe/listenToSwapStandalone";
import "./traderJoe/getRecentSwaps";
