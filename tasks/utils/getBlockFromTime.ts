import { task, types } from "hardhat/config";
import { getBlockFromDate } from "../../src/helpers/dates";
import { getProvider } from "../../src/helpers/providers";
import moment from "moment";

task(
  "utils:getBlockFromTime",
  "Print to screen the first block after the given timestamp"
)
  .addPositionalParam(
    "timestamp",
    "UNIX timestamp, in seconds",
    undefined,
    types.int
  )
  .setAction(async ({ timestamp }, hre) => {
    const provider = getProvider(hre);
    const block = await getBlockFromDate(moment.unix(timestamp), provider);
    console.log(block);
  });
