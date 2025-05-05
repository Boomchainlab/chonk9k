// Type definitions for wallet-related functionality

// Supported blockchain types
export type ChainType = 'evm' | 'solana';

// Supported wallet types
export type WalletType = 'metamask' | 'phantom' | 'coinbase' | 'solflare' | 'okx' | 'jupiter' | 'raydium' | 'orca' | 'wen' | 'bitverse' | 'warpcast' | 'frame' | 'rainbow';

// Wallet account interface
export interface WalletAccount {
  address: string;
  chainType: ChainType;
  chainId?: string;
  balance?: string;
  walletType: WalletType;
}

// Wallet option interface for wallet selection
export interface WalletOption {
  id: WalletType;
  name: string;
  logo: string;
  type: 'wallet' | 'aggregator';
  chainSupport: ChainType[];
  description?: string;
  popular?: boolean;
}
