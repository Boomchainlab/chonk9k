# EVM Token Deployment Instructions

## Preparation

1. Make sure you have Node.js and npm installed
2. Install necessary dependencies:
   ```bash
   npm install ethers@6.x hardhat @nomicfoundation/hardhat-toolbox dotenv
   ```
3. Create a `.env` file with your private key and provider URLs:
   ```
   PRIVATE_KEY=your_wallet_private_key
   ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_project_id
   BASE_RPC_URL=https://mainnet.base.org
   ETHERSCAN_API_KEY=your_etherscan_api_key
   COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
   ```

## Deploying to Ethereum Mainnet

```javascript
async function deployToEthereum() {
  console.log("Deploying CHONK9K token to Ethereum Mainnet...");
  
  const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const balance = await provider.getBalance(wallet.address);
  console.log(`Wallet address: ${wallet.address}`);
  console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);
  
  // Check for sufficient balance
  if (balance < ethers.parseEther("0.1")) {
    console.error("Insufficient ETH for deployment. Need at least 0.1 ETH.");
    process.exit(1);
  }
  
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  
  console.log("Deploying contract...");
  const contract = await factory.deploy();
  console.log("Transaction hash:", contract.deploymentTransaction().hash);
  
  await contract.deploymentTransaction().wait(1);
  
  const contractAddress = await contract.getAddress();
  console.log(`CHONK9K contract deployed to Ethereum: ${contractAddress}`);
  
  return contractAddress;
}
```

## Deploying to Base Mainnet

```javascript
async function deployToBase() {
  console.log("Deploying CHONK9K token to Base Mainnet...");
  
  const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const balance = await provider.getBalance(wallet.address);
  console.log(`Wallet address: ${wallet.address}`);
  console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);
  
  // Check for sufficient balance
  if (balance < ethers.parseEther("0.05")) {
    console.error("Insufficient ETH for deployment. Need at least 0.05 ETH.");
    process.exit(1);
  }
  
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  
  console.log("Deploying contract...");
  const contract = await factory.deploy();
  console.log("Transaction hash:", contract.deploymentTransaction().hash);
  
  await contract.deploymentTransaction().wait(1);
  
  const contractAddress = await contract.getAddress();
  console.log(`CHONK9K contract deployed to Base: ${contractAddress}`);
  
  return contractAddress;
}
```

## Verifying Contract on Etherscan/Basescan

```javascript
async function verifyContract(network, contractAddress) {
  const networkName = network === 'ethereum' ? 'mainnet' : 'base';
  console.log(`Verifying contract on ${networkName}scan...`);
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
      network: networkName,
    });
    console.log(`Contract verified successfully on ${networkName}scan`);
  } catch (error) {
    console.error(`Error verifying contract:`, error);
  }
}
```

## Current Deployed Addresses

- Ethereum Mainnet: `0xc9000b7D00C40nK900090009000Ch0nKPu4p`
- Base Mainnet: `0x9c0000b7D00000cH0000nK9000K90000b000se`
- Solana Mainnet: `ugNM58uye7VX2Pjkf2gEhS6HuEWoZpwN86EyaDWNVsd`

> Note: The Ethereum and Base addresses above are placeholder/demo addresses.
> To get real contract addresses, you'll need to deploy the contracts with actual ETH for gas fees.
