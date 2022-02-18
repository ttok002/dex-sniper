import { UniswapV2Clone } from "./UniswapV2Clone";

export class MadMeerkat extends UniswapV2Clone {
  supportedNetworks: string[] = ["cronos"];
  routerAddress = "0x145677FC4d9b8F19B5D56d1820c48e0443049a30";
  factoryAddress = "0xd590cC180601AEcD6eeADD9B7f2B7611519544f4";
  routerAbi = require("./abi/madMeerkat/router.json");
  pairAbi = require("./abi/madMeerkat/pair.json");
  factoryAbi = require("./abi/madMeerkat/factory.json");
}
