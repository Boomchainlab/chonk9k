# CHONK9K Token Deployment Guide

This guide provides step-by-step instructions for deploying the CHONK9K token on both Base and Solana blockchains.

## Prerequisites

Ensure you have the following environment variables set:

- `PRIVATE_KEY`: Your Ethereum private key (for Base deployment)
- `BASE_RPC_URL`: Base mainnet RPC URL
- `BASE_TESTNET_RPC_URL`: Base Sepolia testnet RPC URL  
- `ETHERSCAN_API_KEY`: API key for contract verification
- `SOLANA_PRIVATE_KEY`: Your Solana private key (Base58 encoded)
- `SOLANA_PROGRAM_ID`: Your Solana program ID

## Base Blockchain Deployment

### Step 1: Install Dependencies

```bash
npm install @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-verify @openzeppelin/contracts
```

### Step 2: Prepare Hardhat Configuration

Create a file named `hardhat.config.cjs` with the following content:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    base: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    baseSepolia: {
      url: process.env.BASE_TESTNET_RPC_URL || "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
};
```

### Step 3: Deploy to Base Testnet

Create a file named `deploy.cjs` in the `scripts` directory with the following content:

```javascript
const { ethers } = require("hardhat");

async function main() {
  console.log(`Deploying CHONK9K token...`);
  
  // Get the contract factory
  const CHONK9K = await ethers.getContractFactory("CHONK9K");
  
  // Deploy the contract
  const token = await CHONK9K.deploy();
  
  // Wait for deployment to finish
  await token.waitForDeployment();
  
  // Get the deployed address
  const tokenAddress = await token.getAddress();
  
  console.log(`CHONK9K token deployed to: ${tokenAddress}`);
  console.log(`To verify this contract run: npx hardhat verify --network baseSepolia ${tokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Run the deployment script:

```bash
npx hardhat run scripts/deploy.cjs --network baseSepolia
```

### Step 4: Verify the Contract on BaseScan

After deployment, verify the contract using the command provided in the output:

```bash
npx hardhat verify --network baseSepolia CONTRACT_ADDRESS
```

Replace `CONTRACT_ADDRESS` with the actual deployed address.

## Solana Blockchain Deployment

### Step 1: Install Dependencies

```bash
npm install @solana/web3.js @solana/spl-token @coral-xyz/anchor
```

### Step 2: Create Program IDL

Create a file named `chonk9k.cjs` in the `contracts/solana` directory with the following content:

```javascript
const IDL = {
  version: "0.1.0",
  name: "chonk9k_solana",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "mint",
          isMut: true,
          isSigner: true,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
};

module.exports = { IDL };
```

### Step 3: Create Solana Deployment Script

Create a file named `deploy-solana.js` in the `scripts` directory with the following content:

```javascript
import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { IDL } = require("../contracts/solana/chonk9k.cjs");

async function main() {
  try {
    const connection = new web3.Connection("https://api.devnet.solana.com");
    console.log("Connected to Solana devnet");
    
    // Parse the private key (Base58 encoded)
    let walletKeypair;
    if (process.env.SOLANA_PRIVATE_KEY) {
      try {
        walletKeypair = Keypair.fromSecretKey(
          Buffer.from(anchor.utils.bytes.bs58.decode(process.env.SOLANA_PRIVATE_KEY))
        );
        console.log("Using provided wallet keypair");
      } catch (e) {
        console.error("Error parsing Solana private key:", e);
        walletKeypair = Keypair.generate();
        console.log("Generated new wallet keypair");
      }
    } else {
      walletKeypair = Keypair.generate();
      console.log("Generated new wallet keypair");
    }
    
    const wallet = new anchor.Wallet(walletKeypair);
    console.log("Wallet public key:", wallet.publicKey.toString());
    
    // Set up provider
    const provider = new anchor.AnchorProvider(
      connection, 
      wallet, 
      { commitment: "processed" }
    );
    
    // Parse or generate program ID
    let programId;
    if (process.env.SOLANA_PROGRAM_ID) {
      try {
        programId = new PublicKey(process.env.SOLANA_PROGRAM_ID);
        console.log("Using provided program ID:", programId.toString());
      } catch (e) {
        console.error("Error parsing program ID:", e);
        const programKeypair = Keypair.generate();
        programId = programKeypair.publicKey;
        console.log("Generated new program ID:", programId.toString());
      }
    } else {
      const programKeypair = Keypair.generate();
      programId = programKeypair.publicKey;
      console.log("Generated new program ID:", programId.toString());
    }
    
    // Create program instance
    const program = new Program(IDL, programId, provider);
    
    // Deploy token
    const mint = Keypair.generate();
    console.log("Generated mint address:", mint.publicKey.toString());
    
    console.log("Deploying token...");
    const tx = await program.methods
      .initialize()
      .accounts({
        mint: mint.publicKey,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([mint])
      .rpc();
    
    console.log("Token deployed successfully!");
    console.log("Token mint address:", mint.publicKey.toString());
    console.log("Transaction signature:", tx);
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main();
```

Run the Solana deployment script:

```bash
node --experimental-modules scripts/deploy-solana.js
```

## Recommended Approach for Deployment

Due to the complexity of setting up the environment correctly, we recommend using the Hardhat framework for Base deployment and the Solana CLI for Solana deployment.

### Base Deployment (Alternative)

1. Create a temporary directory outside your project
2. Set up a new Hardhat project: `npx hardhat init`
3. Copy your CHONK9K.sol contract to the new project
4. Install dependencies: `npm install @openzeppelin/contracts`
5. Update hardhat.config.js with your network settings
6. Deploy using: `npx hardhat run scripts/deploy.js --network baseSepolia`

### Solana Deployment (Alternative)

1. Install Solana CLI tools
2. Create a token using: `spl-token create-token`
3. Create an account: `spl-token create-account TOKEN_ADDRESS`
4. Mint tokens: `spl-token mint TOKEN_ADDRESS AMOUNT`

## Important Notes

- Always deploy to testnet first before mainnet
- Verify you have sufficient funds in your wallet before deployment
- Back up your private keys securely
- Verify the contract source code after deployment for transparency
