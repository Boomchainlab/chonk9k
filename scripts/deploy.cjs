const { ethers, network } = require("hardhat");

async function main() {
  console.log(`Deploying CHONK9K token to ${network.name}...`);
  
  // Get the contract factory
  const CHONK9K = await ethers.getContractFactory("CHONK9K");
  
  // Deploy the contract
  const token = await CHONK9K.deploy();
  
  // Wait for deployment to finish
  await token.waitForDeployment();
  
  // Get the deployed address
  const tokenAddress = await token.getAddress();
  
  console.log(`CHONK9K token deployed to: ${tokenAddress} on network: ${network.name}`);
  console.log(`To verify this contract run: npx hardhat verify --network ${network.name} ${tokenAddress}`);
  
  return { tokenAddress, network: network.name };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
