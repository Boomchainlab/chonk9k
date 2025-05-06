import { ethers } from "ethers";
import fs from "fs";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Get contract ABI from compiled artifacts
const contractJson = require("../artifacts/contracts/CHONK9K.sol/CHONK9K.json");
const abi = contractJson.abi;
const bytecode = contractJson.bytecode;

async function main() {
  console.log("Deploying CHONK9K token contract...");
  
  // Load private key from environment
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("No private key found in environment variables!");
    process.exit(1);
  }
  
  // Connect to Base testnet
  const rpcUrl = process.env.BASE_TESTNET_RPC_URL || "https://sepolia.base.org";
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  
  try {
    // Check wallet balance
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet address: ${wallet.address}`);
    console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);
    
    if (balance === 0n) {
      console.error("Wallet has no ETH for gas. Please fund your wallet.");
      process.exit(1);
    }
    
    // Deploy the contract
    console.log("Creating contract factory...");
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    
    console.log("Deploying contract...");
    const contract = await factory.deploy();
    console.log("Waiting for deployment transaction to be mined...");
    await contract.deploymentTransaction().wait(1);
    
    const contractAddress = await contract.getAddress();
    console.log(`CHONK9K contract deployed to: ${contractAddress}`);
    
    // Save contract address to a file
    fs.writeFileSync(
      "contract-address.json",
      JSON.stringify({ address: contractAddress, network: "baseSepolia" }, null, 2)
    );
    
    return { address: contractAddress, network: "baseSepolia" };
  } catch (error) {
    console.error("Error deploying contract:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
