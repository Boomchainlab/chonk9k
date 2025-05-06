#!/bin/bash

echo "Starting CHONK9K token deployment process..."

# Deploy to Base (testnet for safety) 
echo "\n\n===== Deploying to Base Testnet =====\n"
npx hardhat run scripts/deploy.js --network baseSepolia
echo "\nDeployment to Base Testnet complete."

# Deploy to Solana
echo "\n\n===== Deploying to Solana =====\n"
node scripts/deploy-solana.js
echo "\nDeployment to Solana complete."

echo "\n===== All deployments completed! =====\n"
echo "You can now verify the contracts on their respective explorers."
