require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    tenderlyMainnet: {
      url: process.env.TENDERLY_MAINNET_RPC_URL,
      accounts: [process.env.PRIVATE_KEY].filter(Boolean),
    },
    // Other network configs as needed
  },
};
