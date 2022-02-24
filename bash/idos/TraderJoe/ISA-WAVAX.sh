#! /usr/bin/env bash

##
# Get stats from ISA IDO; pair is ISA-WAVAX.
#
# Execute from the main project folder
##

nBlocks=${1-"3600"}
mainToken=0
dex="TraderJoe"
network="avalanche"
pair="0x9155f441ffdfa81b13e385bfac6b3825c05184ee"
outputDir="output/Avalanche/TraderJoe/ISA-WAVAX"

# Get swaps and mints since pair creation
blockFirstSwap="9242098"
blockFirstMint="9242098"
mdir -p $outputDir
hh uniswapV2Clone:getSwaps ${dex} ${pair} --fromblock ${blockFirstSwap} --nblocks "${nBlocks}" --network ${network} --maintoken $mainToken --csv "${outputDir}/swaps-first-${nBlocks}_blocks.csv"
hh uniswapV2Clone:getMints ${dex} ${pair} --fromblock ${blockFirstMint} --nblocks "${nBlocks}" --network ${network} --maintoken $mainToken --csv "${outputDir}/mints-first-${nBlocks}_blocks.csv"

