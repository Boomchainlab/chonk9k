
import { ethers } from "hardhat";

async function main() {
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // Replace this with the address from step 1
  
  const CHONK9K = await ethers.getContractFactory("CHONK9K");
  const token = await CHONK9K.attach(contractAddress);

  console.log("CHONK9K Token Details:");
  console.log("Name:", await token.name());
  console.log("Symbol:", await token.symbol());
  console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
  console.log("Burn Fee:", (await token.BURN_FEE()).toString());
  console.log("Dev Fee:", (await token.DEV_FEE()).toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
