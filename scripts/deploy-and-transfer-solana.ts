import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';
import { IDL } from '../contracts/solana/chonk9k';
import fs from 'fs';

// Define the target recipient address - this is also being used as the deployer address based on your request
const TARGET_ADDRESS = "2Lp2SGS9AKYVKCorizjzJLPHn4swatnbvEQ2UB2bKorJy";
const TRANSFER_AMOUNT = 1000; // Amount to transfer (will be multiplied by 10^decimals)

async function main() {
  console.log("Starting Solana token deployment and transfer process...");
  
  // Use mainnet if specified, otherwise default to devnet
  const isMainnet = process.env.SOLANA_NETWORK === 'mainnet';
  const endpoint = isMainnet 
    ? clusterApiUrl('mainnet-beta') 
    : "https://api.devnet.solana.com";
  
  console.log(`Connecting to Solana ${isMainnet ? 'mainnet' : 'devnet'} at ${endpoint}`);
  const connection = new Connection(endpoint, 'confirmed');

  // Parse the wallet private key
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
      console.log("Successfully loaded wallet from SOLANA_PRIVATE_KEY");
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
  
  console.log("Wallet public key:", wallet.publicKey.toString());
  
  // Check wallet balance
  const balance = await connection.getBalance(wallet.publicKey);
  console.log(`Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  
  if (balance < 0.05 * LAMPORTS_PER_SOL) {
    console.warn("Warning: Low wallet balance. You may need more SOL to complete this transaction.");
  }
  
  // Setup anchor provider
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  
  // Generate a new program ID for this deployment
  console.log("Generating a new program ID for this deployment...");
  const programKeypair = Keypair.generate();
  const programId = programKeypair.publicKey;
  console.log("Generated Solana Program ID:", programId.toString());
  
  // @ts-ignore - Type error with anchor package
  const program = new Program(IDL, programId, provider);

  try {
    // Generate keypair for the token mint
    const mint = Keypair.generate();
    console.log("Generated mint address:", mint.publicKey.toString());
    
    // Parse the recipient public key
    let recipientPublicKey;
    try {
      recipientPublicKey = new PublicKey(TARGET_ADDRESS);
      console.log("Recipient address:", recipientPublicKey.toString());
    } catch (error) {
      console.error("Invalid recipient address:", error);
      return;
    }
    
    // Initialize the token
    console.log("Initializing token...");
    const tx = await program.methods
      .initialize()
      .accounts({
        mint: mint.publicKey,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([mint])
      .rpc();

    console.log("CHONK9K Solana token deployed to:", mint.publicKey.toString());
    console.log("Deployment transaction signature:", tx);
    
    // Create token accounts and transfer tokens
    console.log("\nPreparing to transfer tokens to recipient...");
    
    // Get the associated token account for the sender
    const senderTokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      wallet.publicKey
    );
    
    // Get the associated token account for the recipient
    const recipientTokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      recipientPublicKey
    );
    
    console.log("Sender token account:", senderTokenAccount.toString());
    console.log("Recipient token account:", recipientTokenAccount.toString());
    
    // Create ATA for recipient if it doesn't exist
    console.log("Creating recipient token account if needed...");
    
    try {
      // Create recipient's token account if it doesn't exist
      const createRecipientAccountIx = createAssociatedTokenAccountInstruction(
        wallet.publicKey, // payer
        recipientTokenAccount, // associated token account
        recipientPublicKey, // owner
        mint.publicKey // mint
      );
      
      // Transfer CHONK9K tokens from sender to recipient
      // The program should have minted tokens to the wallet address during initialization
      const transferIx = createTransferInstruction(
        senderTokenAccount, // source
        recipientTokenAccount, // destination
        wallet.publicKey, // owner
        TRANSFER_AMOUNT * (10 ** 9) // amount (with 9 decimals)
      );
      
      // Send transaction with both instructions
      const transferTx = await provider.sendAndConfirm(
        new anchor.web3.Transaction().add(createRecipientAccountIx, transferIx),
        []
      );
      
      console.log("Transfer transaction signature:", transferTx);
      console.log(`Successfully transferred ${TRANSFER_AMOUNT} CHONK9K tokens to ${TARGET_ADDRESS}`);
    } catch (error) {
      console.error("Error during token transfer:", error);
    }
    
    // Save the deployed token information to a file
    const tokenInfo = {
      network: isMainnet ? "mainnet-beta" : "devnet",
      programId: programId.toString(),
      tokenAddress: mint.publicKey.toString(),
      recipientAddress: TARGET_ADDRESS,
      transferAmount: TRANSFER_AMOUNT,
      deploymentTx: tx,
    };
    
    fs.writeFileSync("solana-token-address.json", JSON.stringify(tokenInfo, null, 2));
    console.log("Token information saved to solana-token-address.json");
    
    // Also update the constants.ts file with the new token address
    console.log("\nUpdating shared constants with new token address...");
    const constantsPath = "./shared/constants.ts";
    let constantsFile = fs.readFileSync(constantsPath, 'utf8');
    
    // Replace the Solana token address in constants.ts
    constantsFile = constantsFile.replace(
      /SOLANA: \{[\s\S]*?CHONK9K: "(.*?)"[\s\S]*?\}/,
      `SOLANA: {
    CHONK9K: "${mint.publicKey.toString()}"
  }`
    );
    
    fs.writeFileSync(constantsPath, constantsFile);
    console.log("Updated SOLANA.CHONK9K address in constants.ts");
    console.log("\nToken deployment and transfer complete!");
    
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
