// Import buffer polyfill first
import './buffer-polyfill';
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { CONTRACT_ADDRESSES, RPC_URLS } from '@shared/constants';

export const CHONK9K_TOKEN_ADDRESS = CONTRACT_ADDRESSES.SOLANA.CHONK9K;
export const RAYDIUM_LIQUIDITY_PROGRAM_ID = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
export const ORCA_WHIRLPOOL_PROGRAM_ID = 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc';

// Configure RPC URL based on environment
const SOLANA_RPC_URL = clusterApiUrl('mainnet-beta');

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
  extensions?: Record<string, any>;
}

export interface LiquidityPool {
  id: string;
  baseMint: string;
  quoteMint: string;
  lpMint: string;
  baseVault: string;
  quoteVault: string;
  baseDecimals: number;
  quoteDecimals: number;
  lpDecimals: number;
  version: number;
  programId: string;
  authority: string;
  openOrders: string;
  targetOrders: string;
  baseAmount: number;
  quoteAmount: number;
  lpSupply: number;
  basePrice: number;
  quotePrice: number;
}

export interface SwapRoute {
  platform: string;
  inputAmount: number;
  outputAmount: number;
  priceImpact: number;
  platformFee: number;
  routeSteps: number;
  bestRoute: boolean;
}

// Initialize Solana connection
export const getSolanaConnection = () => {
  return new Connection(SOLANA_RPC_URL, 'confirmed');
};

// Get token information for Chonk9k
export const getChonk9kTokenInfo = async (): Promise<TokenInfo> => {
  // In a real application, this would fetch from Solana token registry
  // For demo purposes, we'll return hardcoded data
  return {
    address: CHONK9K_TOKEN_ADDRESS,
    symbol: 'CHONK9K',
    name: 'Chonk9k Token',
    decimals: 9,
    logoURI: '/logo.png',
    tags: ['meme', 'defi'],
  };
};

// Get liquidity pools for Chonk9k
export const getChonk9kLiquidityPools = async (): Promise<LiquidityPool[]> => {
  try {
    // In a real application, this would fetch from Raydium API
    // Using a placeholder for demonstration
    const pools: LiquidityPool[] = [
      {
        id: 'raydium_chonk9k_usdc',
        baseMint: CHONK9K_TOKEN_ADDRESS,
        quoteMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC on Solana
        lpMint: 'CHONK9kUSDCLP111111111111111111111111111111',
        baseVault: 'CHONK9kBaseVault1111111111111111111111111111',
        quoteVault: 'CHONK9kQuoteVault111111111111111111111111111',
        baseDecimals: 9,
        quoteDecimals: 6,
        lpDecimals: 9,
        version: 4,
        programId: RAYDIUM_LIQUIDITY_PROGRAM_ID,
        authority: 'DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump',
        openOrders: 'CHONK9kOpenOrders1111111111111111111111111111',
        targetOrders: 'CHONK9kTargetOrders11111111111111111111111111',
        baseAmount: 1000000000, // 1 billion tokens
        quoteAmount: 100000000, // 100 USDC
        lpSupply: 500000000,
        basePrice: 0.0001, // $0.0001 per CHONK9K
        quotePrice: 1.0, // $1 per USDC
      },
      {
        id: 'raydium_chonk9k_sol',
        baseMint: CHONK9K_TOKEN_ADDRESS,
        quoteMint: 'So11111111111111111111111111111111111111112', // SOL
        lpMint: 'CHONK9kSOLLP11111111111111111111111111111111',
        baseVault: 'CHONK9kSolBaseVault111111111111111111111111111',
        quoteVault: 'CHONK9kSolQuoteVault11111111111111111111111111',
        baseDecimals: 9,
        quoteDecimals: 9,
        lpDecimals: 9,
        version: 4,
        programId: RAYDIUM_LIQUIDITY_PROGRAM_ID,
        authority: 'DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump',
        openOrders: 'CHONK9kSolOpenOrders111111111111111111111111111',
        targetOrders: 'CHONK9kSolTargetOrders1111111111111111111111111',
        baseAmount: 2000000000, // 2 billion tokens
        quoteAmount: 10000000000, // 10 SOL
        lpSupply: 700000000,
        basePrice: 0.0001, // $0.0001 per CHONK9K
        quotePrice: 100.0, // $100 per SOL
      }
    ];
    
    return pools;
  } catch (error) {
    console.error('Error fetching Chonk9k liquidity pools:', error);
    throw error;
  }
};

// Get best swap routes for Chonk9k
export const getChonk9kSwapRoutes = async (inputAmount: number): Promise<SwapRoute[]> => {
  try {
    // In a real application, this would query different aggregators
    // For now, returning simulated routes
    const routes: SwapRoute[] = [
      {
        platform: 'Jupiter',
        inputAmount,
        outputAmount: inputAmount * 0.0001, // simulated price
        priceImpact: 0.15,
        platformFee: 0.3,
        routeSteps: 1,
        bestRoute: true
      },
      {
        platform: 'Raydium',
        inputAmount,
        outputAmount: inputAmount * 0.000099, // slightly worse price
        priceImpact: 0.25,
        platformFee: 0.25,
        routeSteps: 1,
        bestRoute: false
      },
      {
        platform: 'Orca',
        inputAmount,
        outputAmount: inputAmount * 0.000098, // slightly worse price
        priceImpact: 0.3,
        platformFee: 0.3,
        routeSteps: 1,
        bestRoute: false
      }
    ];
    
    return routes;
  } catch (error) {
    console.error('Error getting swap routes:', error);
    throw error;
  }
};

// Add liquidity to Raydium pool
export const addLiquidityToRaydium = async (
  tokenAmount: number,
  pairedTokenAmount: number,
  pairedTokenMint: string,
  slippage: number = 0.5, // Default slippage tolerance 0.5%
  wallet: any // Wallet adapter
): Promise<string> => {
  try {
    // This would call Raydium's addLiquidity instruction in a real app
    // For demo purposes, we're returning a simulated transaction signature
    console.log(`Adding liquidity: ${tokenAmount} CHONK9K + ${pairedTokenAmount} of token ${pairedTokenMint}`);
    
    // Simulate successful transaction
    const signature = 'TransactionSimulated' + Math.random().toString(36).substr(2, 9);
    
    return signature;
  } catch (error) {
    console.error('Error adding liquidity to Raydium:', error);
    throw error;
  }
};

// Get Chonk9k token balance
export const getChonk9kBalance = async (walletAddress: string): Promise<number | null> => {
  try {
    const connection = getSolanaConnection();
    const publicKey = new PublicKey(walletAddress);
    const mintPubkey = new PublicKey(CHONK9K_TOKEN_ADDRESS);
    
    // Get the associated token address for this wallet and token
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPubkey,
      publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    
    try {
      // Get token account balance
      const tokenAccount = await connection.getTokenAccountBalance(associatedTokenAddress);
      return tokenAccount.value.uiAmount || 0;
    } catch (e) {
      // Token account might not exist yet
      console.log('Token account may not exist yet:', e);
      return 0;
    }
  } catch (error) {
    console.error('Error fetching CHONK9K balance:', error);
    return null;
  }
};

// Get wallet SOL balance
export const getSolBalance = async (walletAddress: string): Promise<number | null> => {
  try {
    const connection = getSolanaConnection();
    const publicKey = new PublicKey(walletAddress);
    
    const solBalance = await connection.getBalance(publicKey);
    return solBalance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching SOL balance:', error);
    return null;
  }
};

// Transfer tokens to a specified address
export const transferTokens = async (
  recipientAddress: string,
  amount: number = 1000, // Default to 1000 CHONK9K tokens
): Promise<{ success: boolean; message: string; txId?: string }> => {
  try {
    // This is a simulation since we don't have access to the private key
    console.log(`Transferring ${amount} CHONK9K tokens to ${recipientAddress}`);
    
    // In a real app, we would create and sign a transaction
    // For now, just simulate a successful transfer
    const txId = 'simulatedTx' + Date.now().toString();
    
    return {
      success: true,
      message: `Successfully sent ${amount} CHONK9K tokens to ${recipientAddress}`,
      txId
    };
  } catch (error) {
    console.error('Error transferring tokens:', error);
    return {
      success: false,
      message: 'Failed to transfer tokens: ' + (error as Error).message
    };
  }
};

// Check if a wallet is eligible to add liquidity
export const checkLiquidityEligibility = async (walletAddress: string): Promise<{
  eligible: boolean;
  chonk9kBalance: number | null;
  solBalance: number | null;
  message: string;
}> => {
  try {
    const chonk9kBalance = await getChonk9kBalance(walletAddress);
    const solBalance = await getSolBalance(walletAddress);
    
    if (chonk9kBalance === null || solBalance === null) {
      return {
        eligible: false,
        chonk9kBalance,
        solBalance,
        message: 'Error checking balances. Please try again.'
      };
    }
    
    if (chonk9kBalance === 0) {
      return {
        eligible: false,
        chonk9kBalance,
        solBalance,
        message: 'You have 0 CHONK9K tokens. Liquidity addition not possible.'
      };
    }
    
    if (solBalance < 0.01) {
      return {
        eligible: false,
        chonk9kBalance,
        solBalance,
        message: 'Insufficient SOL for transaction fees. Please add more SOL.'
      };
    }
    
    return {
      eligible: true,
      chonk9kBalance,
      solBalance,
      message: 'You are ready to add liquidity on Raydium or Orca.'
    };
  } catch (error) {
    console.error('Error checking liquidity eligibility:', error);
    return {
      eligible: false,
      chonk9kBalance: null,
      solBalance: null,
      message: 'Error checking eligibility. Please try again.'
    };
  }
};
