
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Keypair } from '@solana/web3.js';
import { IDL } from '../contracts/solana/chonk9k';

async function main() {
  const connection = new anchor.web3.Connection("https://api.devnet.solana.com");
  // Use provided private key if available, otherwise generate a new one
  // Try different formats for the private key
  let walletKeypair;
  if (process.env.SOLANA_PRIVATE_KEY) {
    try {
      // Try to parse as base58 encoded private key
      walletKeypair = Keypair.fromSecretKey(
        Buffer.from(
          // Convert from Base58 string to Uint8Array
          // This assumes the private key is in Base58 format (common for Solana)
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
  
  const programId = new PublicKey(process.env.SOLANA_PROGRAM_ID || "");
  // @ts-ignore - Type error with anchor package
  const program = new Program(IDL, programId, provider);

  try {
    const mint = Keypair.generate();
    const tx = await program.methods
      .initialize()
      .accounts({
        mint: mint.publicKey,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([mint])
      .rpc();

    console.log("CHONK9K Solana deployed to:", mint.publicKey.toString());
    console.log("Transaction signature:", tx);
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
