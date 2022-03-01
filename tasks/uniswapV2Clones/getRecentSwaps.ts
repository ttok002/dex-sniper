import { task, types } from 'hardhat/config';
import { UniswapV2CloneFactory } from '../../src/dexes/uniswapV2Clones/UniswapV2CloneFactory';
import { getProvider } from '../../src/helpers/providers';
import { getMostRecentBlocksRange } from '../../src/helpers/blocks';
// @ts-ignore
import ObjectsToCsv from 'objects-to-csv';
import { getSwapRecordStat } from '../../src/helpers/swaps';

task('uniswapV2Clone:getRecentSwaps', 'Get recent swaps for the given pair')
  .addPositionalParam('dexName', 'DEX to consider, e.g. UniswapV2')
  .addPositionalParam('pair', 'Address of the pair to analyze')
  .addOptionalParam(
    'nblocks',
    'Number of blocks to get, you can use negative values to find earlier blocks',
    '10'
  )
  .addOptionalParam('csv', 'Dump table to given file in CSV format')
  .addOptionalParam('digits0', '1st token digits', 18, types.int)
  .addOptionalParam('digits1', '2nd token digits', 18, types.int)
  .addOptionalParam(
    'maintoken',
    'Token you are more interested in; it will be shown first (0 or 1)',
    0,
    types.int
  )
  .setAction(async ({ dexName, pair, nblocks, csv, digits0, digits1, maintoken }, hre) => {
    const provider = getProvider(hre);
    const dex = new UniswapV2CloneFactory().create(dexName, provider, hre.network.name);
    const [fromBlock, toBlock] = await getMostRecentBlocksRange(nblocks, provider);
    const swapsHistory = await dex.getSwapHistory(pair, fromBlock, toBlock);
    const swaps = swapsHistory.map((e) => getSwapRecordStat(e, digits0, digits1, maintoken));
    if (!csv) {
      console.log(swaps);
      return;
    }
    const csvFile = new ObjectsToCsv(swaps);
    await csvFile.toDisk(csv);
    console.log(`Output saved to file ${csv}`);
  });
