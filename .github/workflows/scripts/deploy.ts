import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("Account balance:", balance.toString());

  // Replace "MyContract" with your contract name
  const MyContract = await ethers.getContractFactory("MyContract");
  const myContract = await MyContract.deploy();

  console.log("Contract deployed to address:", myContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
