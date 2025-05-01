const anchor = require("@coral-xyz/anchor");
const { Program } = require("@coral-xyz/anchor");
const { PublicKey, SystemProgram, Keypair } = require('@solana/web3.js');
const { IDL } = require("../contracts/solana/chonk9k");

async function main() {
  const connection = new anchor.web3.Connection("https://api.devnet.solana.com");
  
  // Try different formats for the private key
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
  console.log("Using wallet address:", wallet.publicKey.toString());
  
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "processed",
  });
  
  let programId;
  try {
    // Check if SOLANA_PROGRAM_ID is provided and valid
    if (process.env.SOLANA_PROGRAM_ID && process.env.SOLANA_PROGRAM_ID.trim() !== "") {
      programId = new PublicKey(process.env.SOLANA_PROGRAM_ID);
      console.log("Using provided Solana Program ID:", programId.toString());
    } else {
      // Generate a new program ID if none is provided
      const programKeypair = Keypair.generate();
      programId = programKeypair.publicKey;
      console.log("Generated new Solana Program ID:", programId.toString());
      console.log("Save this program ID for future reference!");
    }
  } catch (error) {
    console.error("Invalid Solana Program ID, generating a new one...");
    const programKeypair = Keypair.generate();
    programId = programKeypair.publicKey;
    console.log("Generated new Solana Program ID:", programId.toString());
  }
  
  try {
    // Create a program interface
    const program = new Program(IDL, programId, provider);
    
    // Generate a keypair for the mint account
    const mint = Keypair.generate();
    console.log("Generated mint address:", mint.publicKey.toString());
    
    // Call the initialize method on the program
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
    return { mintAddress: mint.publicKey.toString(), transaction: tx };
  } catch (error) {
    console.error("Error deploying contract:", error);
    return { error: error.message };
  }
}

main()
  .then((result) => {
    console.log("Deployment complete", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
