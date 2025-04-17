
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Keypair } from '@solana/web3.js';
import { IDL } from '../contracts/solana/chonk9k';

async function main() {
  const connection = new anchor.web3.Connection("https://api.devnet.solana.com");
  const wallet = new anchor.Wallet(Keypair.generate());
  
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "processed",
  });
  
  const programId = new PublicKey("YOUR_PROGRAM_ID");
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
