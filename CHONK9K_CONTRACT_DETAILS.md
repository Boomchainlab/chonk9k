# $CHONK9K Token Contract Details

## Solana Token Information

### Basic Information

- **Contract Address**: `atqLmwzsQ7oMX4aMPjCn3seH5c3Ep4bztg3p3hWJsgJ`
- **Token Type**: Solana Program Library (SPL) Token
- **Total Supply**: 9,000,000,000 (9 billion) CHONK9K
- **Decimals**: 9
- **Freeze Authority**: None (Cannot freeze user tokens)
- **Mint Authority**: Owner Wallet (Used for initial minting only)

### Deployment Details

- **Network**: Solana Mainnet (mainnet-beta)
- **Deployment Date**: May 1, 2025
- **Deployment Transaction**: Pending Solana Explorer confirmation
- **Token Owner**: `2Lp2SGS9AKYVKCorizjzJLPHn4swatnbvEQ2UB2bKorJy`

### Explorer Links

- **Solscan**: [https://solscan.io/token/atqLmwzsQ7oMX4aMPjCn3seH5c3Ep4bztg3p3hWJsgJ](https://solscan.io/token/atqLmwzsQ7oMX4aMPjCn3seH5c3Ep4bztg3p3hWJsgJ)
- **Solana Explorer**: [https://explorer.solana.com/address/atqLmwzsQ7oMX4aMPjCn3seH5c3Ep4bztg3p3hWJsgJ](https://explorer.solana.com/address/atqLmwzsQ7oMX4aMPjCn3seH5c3Ep4bztg3p3hWJsgJ)

## Technical Implementation

The $CHONK9K token is implemented as a standard SPL token on the Solana blockchain. The SPL Token program is Solana's equivalent to Ethereum's ERC-20 standard but with some important differences and advantages:

### SPL Token Program

The SPL Token program is a native Solana program that allows users to create, mint, and manage tokens on the Solana blockchain. Unlike Ethereum's ERC-20 standard which requires developers to deploy their own smart contract, Solana's SPL Token program is a built-in feature of the Solana blockchain.

### Key Features

1. **High Performance**: Benefit from Solana's high-speed, low-cost transactions (65,000+ TPS capability)
2. **Low Transaction Fees**: Extremely low transaction costs compared to Ethereum-based tokens
3. **Fast Finality**: Transactions are confirmed in seconds
4. **Scalability**: Can handle millions of users without congestion

### Token Standard Advantages

- **Associated Token Accounts**: Users don't need to manually create token accounts to receive tokens
- **Atomic Transfers**: Multiple token transfers can be executed as a single atomic transaction
- **Metadata Support**: On-chain metadata for token information

## Deployment Process

The token was deployed with the following process:

1. **Creating a new SPL Token**: Using the `spl-token create-token` command
2. **Minting Initial Supply**: 9 billion tokens minted using `spl-token mint` 
3. **Distribution**: Initial tokens added to the project wallet at `2Lp2SGS9AKYVKCorizjzJLPHn4swatnbvEQ2UB2bKorJy`

## Token Economics

### Distribution

- **Community & Airdrop**: 70% (6.3 billion CHONK9K)
- **Liquidity Provision**: 15% (1.35 billion CHONK9K)
- **Team & Development**: 10% (900 million CHONK9K)
- **Marketing**: 5% (450 million CHONK9K)

### Transaction Fees

On-chain transaction fees:
- **Solana Network Fee**: ~0.000005 SOL per transaction (regardless of amount)

Off-chain/DEX fees when trading:
- **Buy Fee**: 1% (managed through DEX integration)
- **Sell Fee**: 1% (managed through DEX integration)
- **DEX LP Fee**: 0.3% (standard Raydium/Jupiter fee)

### Fee Allocation

Collected fees are distributed as follows:
- **Development Fund**: 40%
- **Marketing Initiatives**: 30%
- **Buyback & Burn Program**: 30% (reduces total supply over time)

## Additional Information

### Security Considerations

SPL Tokens have several security advantages:

1. **No Custom Code**: Using the standard SPL Token program eliminates smart contract vulnerabilities
2. **Separation of Authority**: Mint authority can be disabled after initial supply distribution
3. **On-chain Validation**: All token operations are validated by the Solana runtime

### Liquidity & Trading

The $CHONK9K token is available for trading on the following platforms:

- **Raydium**: [https://raydium.io/swap/?inputCurrency=sol&outputCurrency=atqLmwzsQ7oMX4aMPjCn3seH5c3Ep4bztg3p3hWJsgJ](https://raydium.io/swap/?inputCurrency=sol&outputCurrency=atqLmwzsQ7oMX4aMPjCn3seH5c3Ep4bztg3p3hWJsgJ)
- **Jupiter Aggregator**: [https://jup.ag/swap/SOL-atqLmwzsQ7oMX4aMPjCn3seH5c3Ep4bztg3p3hWJsgJ](https://jup.ag/swap/SOL-atqLmwzsQ7oMX4aMPjCn3seH5c3Ep4bztg3p3hWJsgJ)

## Code Sample: Deployment Script

```typescript
// deploy-spl-token.ts - Simplified version
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import * as fs from "fs";

async function main() {
  // Connect to mainnet
  const connection = new web3.Connection(
    web3.clusterApiUrl("mainnet-beta"),
    "confirmed"
  );

  // Load or create keypair for token creation
  const keypair = web3.Keypair.fromSecretKey(
    Buffer.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY!))
  );

  console.log("Creating SPL Token on mainnet...");
  
  // Create token with 9 decimals
  const tokenMint = await token.createMint(
    connection,
    keypair,
    keypair.publicKey,  // Mint authority
    null,               // Freeze authority (none)
    9                   // Decimals
  );

  console.log(`Token created: ${tokenMint.toBase58()}`);

  // Create associated token account for the owner
  const ownerTokenAccount = await token.getOrCreateAssociatedTokenAccount(
    connection,
    keypair,
    tokenMint,
    keypair.publicKey
  );

  // Mint the full supply to the owner account
  const totalSupply = 9_000_000_000;
  const mintAmount = totalSupply * 10**9; // Adjusted for 9 decimals
  
  console.log(`Minting ${totalSupply} tokens to owner account...`);
  const mintTx = await token.mintTo(
    connection,
    keypair,
    tokenMint,
    ownerTokenAccount.address,
    keypair,
    mintAmount
  );

  console.log(`Mint transaction: ${mintTx}`);
  
  // Save the token information
  const tokenInfo = {
    network: "mainnet-beta",
    tokenMint: tokenMint.toBase58(),
    recipientAddress: keypair.publicKey.toBase58(),
    transferAmount: totalSupply.toString(),
    totalSupply: totalSupply.toString(),
    decimals: 9,
    mintTx: mintTx,
  };

  fs.writeFileSync(
    "solana-token-address.json",
    JSON.stringify(tokenInfo, null, 2)
  );

  console.log("Token deployment completed successfully!");
}

main();
```

## Future Enhancements

Potential future enhancements for the $CHONK9K token ecosystem:

1. **Token Metadata Program Integration**: Add on-chain metadata including token image, website, and other details
2. **NFT Integration**: Special NFTs that provide token holder benefits
3. **DAO Governance**: Community voting and proposal system
4. **Staking Program**: Custom SPL staking program for token rewards
5. **Cross-chain Bridges**: Wrappers for $CHONK9K on other blockchains