import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Using QuickNode endpoint
const QUICKNODE_RPC = "https://necessary-warmhearted-water.solana-mainnet.quiknode.pro/bda0096f492c87a8be28bacba0f44ccb313e4f12/";
// Backup endpoint
const BACKUP_RPC = "https://api.mainnet-beta.solana.com";
// The CHONK9K token address
const CHONK9K_TOKEN_ADDRESS = "51ey1T4UCFwb8poVBwyiLwwi1KdNTrZ8rSg7kBRmqray";
// Token owner address
const TOKEN_OWNER_ADDRESS = "2Lp2SGS9AKYVKCorizjzJLPHn4swatnbvEQ2UB2bKorJy";
// Solana Token Program
const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

async function testConnection(rpcUrl, label) {
  console.log(`\n=== Testing ${label} RPC Connection ===`);
  try {
    const startTime = Date.now();
    const connection = new Connection(rpcUrl, 'confirmed');
    
    console.log("Getting current slot...");
    const slot = await connection.getSlot();
    console.log(`Current Slot: ${slot}`);
    
    console.log("Getting latest blockhash...");
    const { blockhash } = await connection.getLatestBlockhash();
    console.log(`Recent Block Hash: ${blockhash}`);
    
    console.log("Getting transaction count...");
    const txCount = await connection.getTransactionCount();
    console.log(`Transaction Count: ${txCount}`);
    
    console.log("Getting SOL balance for token owner...");
    const balance = await connection.getBalance(new PublicKey(TOKEN_OWNER_ADDRESS));
    console.log(`SOL Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    
    console.log("Getting token accounts for token owner...");
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      new PublicKey(TOKEN_OWNER_ADDRESS),
      { programId: new PublicKey(TOKEN_PROGRAM_ID) }
    );
    
    console.log(`Found ${tokenAccounts.value.length} token accounts`);
    
    // Look for CHONK9K token account
    const chonk9kAccount = tokenAccounts.value.find(item => 
      item.account.data.parsed.info.mint === CHONK9K_TOKEN_ADDRESS
    );
    
    if (chonk9kAccount) {
      console.log(`Found CHONK9K token account!`);
      console.log(`CHONK9K Balance: ${chonk9kAccount.account.data.parsed.info.tokenAmount.uiAmount}`);
    } else {
      console.log(`No CHONK9K token account found for this address`);
    }
    
    const endTime = Date.now();
    console.log(`Total query time: ${endTime - startTime}ms`);
    
    return true;
  } catch (error) {
    console.error(`Error testing ${label} connection:`, error);
    return false;
  }
}

async function main() {
  console.log("CHONK9K Solana Connection Test");
  console.log("==============================");
  
  // First try QuickNode
  const quickNodeSuccess = await testConnection(QUICKNODE_RPC, "QuickNode");
  
  // If QuickNode fails, try the backup
  if (!quickNodeSuccess) {
    console.log("\n⚠️ QuickNode connection failed, trying backup...");
    await testConnection(BACKUP_RPC, "Backup");
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
