/**
 * Import here the tasks you want to be callable
 * throught the Hardhat CLI
 */

// DEX utilities
import './uniswapV2Clones/getPairAddress';
import './uniswapV2Clones/getAmountsOut';
import './uniswapV2Clones/getReserves';
import './uniswapV2Clones/swap';

// Dex listening
import './uniswapV2Clones/listenToSwaps';
import './uniswapV2Clones/listenToMints';
import './uniswapV2Clones/listenToMintsKeepalive';
import './uniswapV2Clones/listenToBurns';
import './uniswapV2Clones/listenToPairCreated';
import './uniswapV2Clones/listenToRouterPendingTxs';

// Dex history
import './uniswapV2Clones/getRecentSwaps';
import './uniswapV2Clones/getRecentPairCreations';
import './uniswapV2Clones/getPairCreationTx';
import './uniswapV2Clones/getSwaps';
import './uniswapV2Clones/getMints';
import './uniswapV2Clones/getRecentMints';

// Dex sniping
import './uniswapV2Clones/snipeMints';

// Generic utilities
import './utils/approveTokenSpending';
import './utils/getTimeFromBlock';
import './utils/getBlockFromTime';
import './utils/getLatestBlock';
import './utils/getNonce';
import './utils/listenToPendingTxs';
import './utils/listenToPendingContractTxs';
import './utils/sendEth';
import './utils/printConfig';

// Timings
import './time/timeGetProvider';
import './time/timeGetLatestBlock';
import './time/timeGetPendingTransaction';
import './time/timeReactToPending';
import './time/timeReactToPendingSnowSight';
import './time/timeGetNonce';

// SnowSight
import './snowSight/mempoolStream';
