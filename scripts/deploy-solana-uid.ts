import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Keypair } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, MINT_SIZE, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, createAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import fs from 'fs';

// User UID to integrate into token
const USER_UID = "2088980000178089";

async function main() {
  console.log(`Deploying CHONK9K token with UID: ${USER_UID}...`);
  
  // Connect to Solana devnet
  const connection = new anchor.web3.Connection("https://api.devnet.solana.com");
  
  // Use provided private key if available, otherwise generate a new one
  let walletKeypair;
  if (process.env.SOLANA_PRIVATE_KEY) {
    try {
      // Try to parse as base58 encoded private key
      walletKeypair = Keypair.fromSecretKey(
        Buffer.from(
          // Convert from Base58 string to Uint8Array
          anchor.utils.bytes.bs58.decode(process.env.SOLANA_PRIVATE_KEY)
        )
      );
    } catch (e) {
      console.error("Error parsing Solana private key:", e);
      console.log("Generating new keypair instead...");
      walletKeypair = Keypair.generate();
    }
  } else {
    console.log("No Solana private key provided, generating a new one...");
    walletKeypair = Keypair.generate();
  }
  
  const wallet = new anchor.Wallet(walletKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "processed",
  });
  
  // Generate mint keypair - this will be our token address
  const mintKeypair = Keypair.generate();
  console.log(`Token mint address: ${mintKeypair.publicKey.toString()}`);
  
  try {
    // Calculate minimum lamports needed for token mint account
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    
    // Create token mint transaction
    const transaction = new anchor.web3.Transaction();
    
    // Add the UID data to the token's data field
    const uidData = Buffer.from(USER_UID);
    
    // Create mint account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      })
    );
    
    // Initialize mint
    transaction.add(
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        9, // 9 decimals
        wallet.publicKey,
        wallet.publicKey
      )
    );
    
    // Create associated token account for the wallet
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      wallet.publicKey
    );
    
    console.log(`Sending transaction...`);
    const signature = await provider.sendAndConfirm(transaction, [mintKeypair]);
    
    console.log(`CHONK9K token deployed to: ${mintKeypair.publicKey.toString()}`);
    console.log(`Transaction signature: ${signature}`);
    
    // Save token address to a file
    fs.writeFileSync(
      "solana-token-address.json",
      JSON.stringify({
        uid: USER_UID,
        address: mintKeypair.publicKey.toString(),
        network: "devnet",
        owner: wallet.publicKey.toString()
      }, null, 2)
    );
    
  } catch (error) {
    console.error("Error deploying token:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
