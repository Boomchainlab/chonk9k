
import { writeFileSync } from 'fs';
import { config } from 'dotenv';

async function main() {
  // Base Mainnet
  process.env.PRIVATE_KEY = '0x21fa1bf8dc9793971382c89776e623f9177e4e30b24537d1b2f9383dc46a00c6';
  process.env.BASE_RPC_URL = 'https://mainnet.base.org';
  
  // Base Sepolia (Testnet)
  process.env.BASE_TESTNET_RPC_URL = 'https://sepolia.base.org';
  
  const envContent = `PRIVATE_KEY=${process.env.PRIVATE_KEY}
BASE_RPC_URL=${process.env.BASE_RPC_URL}
BASE_TESTNET_RPC_URL=${process.env.BASE_TESTNET_RPC_URL}`;

  writeFileSync('.env', envContent);
  console.log('Environment variables set up successfully!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
