
import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x21fa1bf8dc9793971382c89776e623f9177e4e30b24537d1b2f9383dc46a00c6";
  
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
