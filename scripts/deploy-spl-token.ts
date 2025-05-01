import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';
import { Connection, Keypair, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as anchor from "@coral-xyz/anchor";
import fs from 'fs';

// Define the target address
const TARGET_ADDRESS = "2Lp2SGS9AKYVKCorizjzJLPHn4swatnbvEQ2UB2bKorJy";
const TRANSFER_AMOUNT = 1000; // Amount to transfer
const TOKEN_DECIMALS = 9; // CHONK9K uses 9 decimals

async function main() {
  console.log("Starting SPL token deployment process...");
  
  // Use mainnet for deployment
  const isMainnet = true; // Force mainnet deployment
  const endpoint = clusterApiUrl('mainnet-beta');
  
  console.log("⚠️ DEPLOYING TO MAINNET - REAL FUNDS WILL BE USED ⚠️");
    
  console.log(`Connecting to Solana ${isMainnet ? 'mainnet' : 'devnet'} at ${endpoint}`);
  const connection = new Connection(endpoint, 'confirmed');

  // Get the wallet private key
  let walletKeypair;
  if (process.env.SOLANA_PRIVATE_KEY) {
    try {
      // Parse as base58 encoded private key
      walletKeypair = Keypair.fromSecretKey(
        Buffer.from(
          anchor.utils.bytes.bs58.decode(process.env.SOLANA_PRIVATE_KEY)
        )
      );
      console.log("Successfully loaded wallet from SOLANA_PRIVATE_KEY");
    } catch (e) {
      console.error("Error parsing Solana private key:", e);
      walletKeypair = Keypair.generate();
      console.log("Generated new keypair instead");
    }
  } else {
    console.log("No Solana private key provided, generating a new one...");
    walletKeypair = Keypair.generate();
  }
  
  console.log("Wallet public key:", walletKeypair.publicKey.toString());
  
  // Check wallet balance - need more SOL for mainnet
  const balance = await connection.getBalance(walletKeypair.publicKey);
  const requiredBalance = isMainnet ? 0.5 : 0.05; // Higher requirement for mainnet
  console.log(`Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  
  if (balance < requiredBalance * LAMPORTS_PER_SOL) {
    console.error(`Error: Insufficient wallet balance for ${isMainnet ? 'mainnet' : 'devnet'} deployment.`);
    console.error(`Required minimum balance: ${requiredBalance} SOL, current balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    console.error(`Please fund the wallet address (${walletKeypair.publicKey.toString()}) with more SOL to continue.`);
    process.exit(1);
  } else {
    console.log(`Wallet has sufficient balance for token deployment.`);
  }
  
  try {
    // Create a new token mint
    console.log("Creating new token mint...");
    const mintKeyPair = Keypair.generate();
    
    console.log("Mint public key (token address):", mintKeyPair.publicKey.toString());
    
    // Create the token mint
    const mint = await createMint(
      connection,
      walletKeypair,
      walletKeypair.publicKey,
      walletKeypair.publicKey,
      TOKEN_DECIMALS
    );
    
    console.log("Token mint created successfully:", mint.toString());
    
    // Create an associated token account for the sender
    console.log("Creating token account for sender...");
    const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      walletKeypair,
      mint,
      walletKeypair.publicKey
    );
    
    // Mint tokens to the sender
    console.log("Minting tokens to sender...");
    const mintAmount = BigInt(9_000_000_000) * BigInt(10 ** TOKEN_DECIMALS); // 9 billion tokens with 9 decimals
    
    const mintTx = await mintTo(
      connection,
      walletKeypair,
      mint,
      senderTokenAccount.address,
      walletKeypair,
      mintAmount
    );
    
    console.log("Tokens minted successfully. Transaction:", mintTx);
    
    // Transfer tokens to the target address if it's different from the deployer
    let transferTx = "N/A - Same wallet";
    
    if (TARGET_ADDRESS && TARGET_ADDRESS !== walletKeypair.publicKey.toString()) {
      console.log(`Transferring tokens to target address: ${TARGET_ADDRESS}...`);
      
      try {
        // Create a PublicKey from the target address string
        const targetPublicKey = new PublicKey(TARGET_ADDRESS);
        
        // Create an associated token account for the target
        console.log("Creating token account for recipient...");
        const targetTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          walletKeypair,
          mint,
          targetPublicKey
        );
        
        // Calculate the transfer amount (all tokens)
        const transferAmount = mintAmount; // Transfer all tokens
        
        // Transfer the tokens
        transferTx = await transfer(
          connection,
          walletKeypair,
          senderTokenAccount.address,
          targetTokenAccount.address,
          walletKeypair.publicKey,
          transferAmount
        );
        
        console.log(`Successfully transferred ${9_000_000_000} CHONK9K tokens to ${TARGET_ADDRESS}`);
      } catch (error) {
        console.error("Error transferring tokens to target address:", error);
        console.log(`The address ${walletKeypair.publicKey.toString()} still holds ${9_000_000_000} CHONK9K tokens.`);
      }
    } else {
      console.log("Current wallet address is being used as both deployer and recipient.");
      console.log(`The address ${walletKeypair.publicKey.toString()} now holds ${9_000_000_000} CHONK9K tokens.`);
    }
    
    console.log("Tokens transferred successfully. Transaction:", transferTx);
    
    // Save the token information to a file
    const tokenInfo = {
      network: isMainnet ? "mainnet-beta" : "devnet",
      tokenMint: mint.toString(),
      recipientAddress: TARGET_ADDRESS,
      transferAmount: TRANSFER_AMOUNT,
      totalSupply: (9_000_000_000).toString(),
      decimals: TOKEN_DECIMALS,
      mintTx: mintTx,
      transferTx: transferTx
    };
    
    fs.writeFileSync("solana-token-address.json", JSON.stringify(tokenInfo, null, 2));
    console.log("Token information saved to solana-token-address.json");
    
    // Update the constants.ts file with the new token address
    console.log("\nUpdating shared constants with new token address...");
    const constantsPath = "./shared/constants.ts";
    let constantsFile = fs.readFileSync(constantsPath, 'utf8');
    
    // Replace the Solana token address in constants.ts
    constantsFile = constantsFile.replace(
      /SOLANA: \{[\s\S]*?CHONK9K: "(.*?)"[\s\S]*?\}/,
      `SOLANA: {
    CHONK9K: "${mint.toString()}"
  }`
    );
    
    fs.writeFileSync(constantsPath, constantsFile);
    console.log("Updated SOLANA.CHONK9K address in constants.ts");
    console.log("\nToken deployment and transfer complete!");
    
  } catch (error) {
    console.error("Error during token deployment:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
