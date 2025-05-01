#!/bin/bash

echo "Starting CHONK9K token deployment process..."

# Deploy to Ethereum (Base)
echo "\n\n===== Deploying to Ethereum (Base) =====\n"
cd "$(dirname "$0")"
npx hardhat run scripts/deploy.ts --network base
echo "\nDeployment to Base network complete."

# Optional: Deploy to Base Testnet
if [ "$1" == "--testnet" ]; then
  echo "\n\n===== Deploying to Base Testnet (Sepolia) =====\n"
  npx hardhat run scripts/deploy.ts --network baseSepolia
  echo "\nDeployment to Base Testnet complete."
fi

# Deploy to Solana
echo "\n\n===== Deploying to Solana =====\n"
npx tsx scripts/deploy-solana.ts
echo "\nDeployment to Solana complete."

echo "\n===== All deployments completed! =====\n"
echo "You can now verify the contracts on their respective explorers."
