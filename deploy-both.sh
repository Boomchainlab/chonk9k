#!/bin/bash

echo "Starting CHONK9K token deployment process..."

# Deploy to Base (testnet for safety) - uncomment base for mainnet
echo "\n\n===== Deploying to Base Testnet =====\n"
npx ts-node --esm scripts/deploy.ts --network baseSepolia
echo "\nDeployment to Base Testnet complete."

# Deploy to Solana
echo "\n\n===== Deploying to Solana =====\n"
npx tsx scripts/deploy-solana.ts
echo "\nDeployment to Solana complete."

echo "\n===== All deployments completed! =====\n"
echo "You can now verify the contracts on their respective explorers."
