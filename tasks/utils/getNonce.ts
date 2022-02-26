import { task } from "hardhat/config";
import { getProvider, getSigner } from "../../src/helpers/providers";

task("utils:getNonce", "Get nonce (number of txs) of current wallet")
  .addOptionalPositionalParam("address")
  .setAction(async ({ address }, hre) => {
    let nonce;
    if (address) {
      const provider = getProvider(hre);
      nonce = await provider.getTransactionCount(address);
    } else {
      const signer = getSigner(hre);
      nonce = await signer.getTransactionCount();
    }
    console.log(nonce);
  });
