#!/bin/bash

if [ -z "$1" ]; then
  echo "Error: Please provide the contract address to verify."
  echo "Usage: ./verify-contracts.sh <contract-address> [--testnet]"
  exit 1
fi

CONTRACT_ADDRESS=$1
NETWORK="base"

if [ "$2" == "--testnet" ]; then
  NETWORK="baseSepolia"
  echo "Verifying contract on Base Testnet (Sepolia)..."
else
  echo "Verifying contract on Base Mainnet..."
fi

echo "Contract address: $CONTRACT_ADDRESS"
echo "Network: $NETWORK"

npx hardhat verify --network $NETWORK $CONTRACT_ADDRESS

if [ $? -eq 0 ]; then
  echo "\nVerification successful! ✅"
else
  echo "\nVerification failed. Please check the contract address and try again."
fi
