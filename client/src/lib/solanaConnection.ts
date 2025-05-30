import { Connection, clusterApiUrl } from '@solana/web3.js';

// QuickNode endpoint for enhanced reliability
const QUICKNODE_ENDPOINT = 'https://necessary-warmhearted-water.solana-mainnet.quiknode.pro/bda0096f492c87a8be28bacba0f44ccb313e4f12/';

// Fallback to public endpoint if QuickNode fails
const FALLBACK_ENDPOINT = clusterApiUrl('mainnet-beta');

/**
 * Creates a Solana connection using QuickNode with fallback to public endpoints
 * Using QuickNode provides better reliability and higher rate limits
 */
export function getSolanaConnection(): Connection {
  try {
    return new Connection(QUICKNODE_ENDPOINT, 'confirmed');
  } catch (error) {
    console.warn('Failed to connect to QuickNode, falling back to public endpoint', error);
    return new Connection(FALLBACK_ENDPOINT, 'confirmed');
  }
}

/**
 * Gets the current Solana slot (latest block)
 * Useful for checking connection health
 */
export async function getCurrentSlot(): Promise<number> {
  const connection = getSolanaConnection();
  try {
    return await connection.getSlot();
  } catch (error) {
    console.error('Failed to get current slot:', error);
    throw error;
  }
}

/**
 * Gets the current Solana block time
 * @returns The current block time in seconds since Unix epoch
 */
export async function getCurrentBlockTime(): Promise<number | null> {
  const connection = getSolanaConnection();
  try {
    const slot = await connection.getSlot();
    return await connection.getBlockTime(slot);
  } catch (error) {
    console.error('Failed to get current block time:', error);
    return null;
  }
}

/**
 * CHONK9K token address on Solana
 */
export const CHONK9K_TOKEN_ADDRESS = '51ey1T4UCFwb8poVBwyiLwwi1KdNTrZ8rSg7kBRmqray';

/**
 * Gets the CHONK9K token account for a given wallet address
 */
export async function getChonk9kBalance(walletAddress: string): Promise<number> {
  const connection = getSolanaConnection();
  try {
    // Implementation depends on whether the token is an SPL token or uses another standard
    // This is a placeholder for the actual implementation
    return 0;
  } catch (error) {
    console.error('Failed to get CHONK9K balance:', error);
    return 0;
  }
}
