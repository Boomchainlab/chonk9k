
import { ethers } from "hardhat";

async function main() {
  const CHONK9K = await ethers.getContractFactory("CHONK9K");
  const token = await CHONK9K.deploy();
  await token.waitForDeployment();
  
  console.log("CHONK9K deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
