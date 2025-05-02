import { getSolanaConnection } from '../client/src/lib/solanaTokenService';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Chonk9k token and owner addresses
const CHONK9K_TOKEN_ADDRESS = "51ey1T4UCFwb8poVBwyiLwwi1KdNTrZ8rSg7kBRmqray";
const TOKEN_OWNER_ADDRESS = "2Lp2SGS9AKYVKCorizjzJLPHn4swatnbvEQ2UB2bKorJy";

async function testSolanaService() {
  try {
    console.log("Testing enhanced Solana connection service...");
    const connection = getSolanaConnection();
    
    console.log("Connection created successfully");
    
    // Test basic RPC operations
    console.log("Testing RPC operations...");
    const slot = await connection.getSlot();
    console.log(`Current slot: ${slot}`);
    
    const blockHeight = await connection.getBlockHeight();
    console.log(`Current block height: ${blockHeight}`);
    
    // Run more advanced tests if needed
    
    console.log("All tests passed successfully!");
  } catch (error) {
    console.error("Error testing Solana service:", error);
  }
}

testSolanaService().catch(console.error);
