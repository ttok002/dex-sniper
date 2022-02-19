#! /usr/bin/env bash

##
# Execute from the main project folder
##

nBlocks=${1-"3600"}
dex="TraderJoe"
network="avalanche"
pair="0x4dc5291cdc7ad03342994e35d0ccc76de065a566"
blockFirstSwap="9780566"
blockFirstMint="9780566"
outputDir="output/Avalanche/TraderJoe/WAVAX-HEC"

# getSwaps
hh uniswapV2Clone:getSwaps ${dex} ${pair} --fromblock ${blockFirstSwap} --nblocks "${nBlocks}" --network ${network} --csv "${outputDir}/swaps-first-${nBlocks}_blocks.csv"

# getMints
hh uniswapV2Clone:getMints ${dex} ${pair} --fromblock ${blockFirstMint} --nblocks "${nBlocks}" --network ${network} --csv "${outputDir}/mints-first-${nBlocks}_blocks.csv"
