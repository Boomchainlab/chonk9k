import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as tenderly from "@tenderly/hardhat-tenderly";

tenderly.setup({ automaticVerifications: true });

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    virtual_base: {
      url: "https://virtual.base.rpc.tenderly.co/b59ae481-fabe-4740-a778-da0414929c79",
      chainId: 9999001,
      currency: "VETH"
    },
  },
  tenderly: {
    project: "chonk9k",
    username: "boomchainlab",
  },
};

export default config;
