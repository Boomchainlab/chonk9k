#!/bin/bash

if [ -z "$1" ]; then
  echo "Error: Missing contract address."
  echo "Usage: ./verify-contract.sh <contract-address> [network]"
  exit 1
fi

CONTRACT_ADDRESS=$1
NETWORK=${2:-baseSepolia}

echo "Verifying CHONK9K token contract at $CONTRACT_ADDRESS on $NETWORK"

# Check for hardhat config
if [ ! -f "hardhat.config.cjs" ]; then
  echo "Error: hardhat.config.cjs not found."
  echo "Please make sure you're in the correct directory and have set up Hardhat."
  exit 1
fi

# Verify using hardhat
npx hardhat verify --network $NETWORK $CONTRACT_ADDRESS

RESULT=$?
if [ $RESULT -eq 0 ]; then
  echo "\nVerification successful! ✅"
  
  if [ "$NETWORK" == "baseSepolia" ]; then
    echo "View your contract at: https://sepolia.basescan.org/address/$CONTRACT_ADDRESS"
  elif [ "$NETWORK" == "base" ]; then
    echo "View your contract at: https://basescan.org/address/$CONTRACT_ADDRESS"
  fi
else
  echo "\nVerification failed. Please check the contract address and try again."
fi
