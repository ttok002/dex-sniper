#! /usr/bin/env bash

##
# Get stats from ISA IDO; pair is ISA-WAVAX.
#
# Execute from the main project folder
##

nBlocks=${1-"3600"}
mainToken=1
dex="TraderJoe"
network="avalanche"
pair="0x9155f441ffdfa81b13e385bfac6b3825c05184ee"
blockFirstSwap="9317978"
blockFirstMint="9317978"
outputDir="output/Avalanche/TraderJoe/ISA-WAVAX"

# getSwaps
hh uniswapV2Clone:getSwaps ${dex} ${pair} --fromblock ${blockFirstSwap} --nblocks "${nBlocks}" --network ${network} --maintoken $mainToken --csv "${outputDir}/swaps-first-${nBlocks}_blocks.csv"

# getMints
hh uniswapV2Clone:getMints ${dex} ${pair} --fromblock ${blockFirstMint} --nblocks "${nBlocks}" --network ${network} --maintoken $mainToken --csv "${outputDir}/mints-first-${nBlocks}_blocks.csv"
