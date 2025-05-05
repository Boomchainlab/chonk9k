import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { CONTRACT_ADDRESSES } from '@shared/constants';
import { useToast } from '@/hooks/use-toast';
import WalletConnectingOverlay from '@/components/WalletConnectingOverlay';

type ChainType = 'evm' | 'solana';
type WalletType = 'metamask' | 'phantom' | 'coinbase' | 'solflare' | 'okx' | 'jupiter' | 'raydium' | 'orca' | 'wen' | 'bitverse' | 'warpcast' | 'frame' | 'rainbow';

interface WalletAccount {
  address: string;
  chainType: ChainType;
  chainId?: string;
  balance?: string;
  walletType: WalletType;
}

interface WalletContextType {
  account: WalletAccount | null;
  connectWallet: (walletType: WalletType, chainType: ChainType) => Promise<boolean>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  connectingWallet: WalletType | null;
  getTokenBalance: (chainType: ChainType) => Promise<string>;
  isConnected: boolean;
  walletIcon: string | null;
}

const defaultContext: WalletContextType = {
  account: null,
  connectWallet: async () => false,
  disconnectWallet: () => {},
  isConnecting: false,
  connectingWallet: null,
  getTokenBalance: async () => '0',
  isConnected: false,
  walletIcon: null,
};

const WalletContext = createContext<WalletContextType>(defaultContext);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<WalletType | null>(null);
  const [walletIcon, setWalletIcon] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for stored wallet connection on mount
  useEffect(() => {
    const savedAccount = localStorage.getItem('chonk9k_wallet_account');
    const savedIcon = localStorage.getItem('chonk9k_wallet_icon');
    
    if (savedAccount) {
      try {
        setAccount(JSON.parse(savedAccount));
        setWalletIcon(savedIcon);
      } catch (e) {
        console.error('Error parsing saved wallet:', e);
        localStorage.removeItem('chonk9k_wallet_account');
        localStorage.removeItem('chonk9k_wallet_icon');
      }
    }
  }, []);

  // Get the appropriate logo for the selected wallet
  const getWalletIcon = (walletType: WalletType): string => {
    // Path to wallet icons - use SVG format
    return `/images/wallets/${walletType.toLowerCase()}.svg`;
  };

  // Generate a simulated address for demo purposes
  const generateAddress = (chainType: ChainType): string => {
    if (chainType === 'evm') {
      return '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    } else {
      // Solana-style address
      return Array(44).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    }
  };

  const connectWallet = async (walletType: WalletType, chainType: ChainType): Promise<boolean> => {
    console.log(`Attempting to connect wallet: ${walletType} on chain: ${chainType}`);
    setIsConnecting(true);
    setConnectingWallet(walletType);
    
    try {
      // In a real implementation, this would connect to an actual wallet
      // For demonstration, we'll simulate a successful connection
      console.log('Starting wallet connection simulation...');
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate an address based on chain type
      const address = generateAddress(chainType);
      console.log('Generated address:', address);
      
      // Get the chain ID (for EVM chains)
      const chainId = chainType === 'evm' ? '0x1' : undefined;
      
      // Create the wallet account object
      const walletAccount: WalletAccount = {
        address,
        chainType,
        chainId,
        walletType,
        balance: '0.0'
      };
      console.log('Created wallet account:', walletAccount);
      
      // Save the wallet icon
      const icon = getWalletIcon(walletType);
      console.log('Wallet icon path:', icon);
      setWalletIcon(icon);
      
      // Update state
      setAccount(walletAccount);
      
      // Save to local storage
      localStorage.setItem('chonk9k_wallet_account', JSON.stringify(walletAccount));
      localStorage.setItem('chonk9k_wallet_icon', icon);
      console.log('Saved wallet data to localStorage');
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${walletType} on ${chainType === 'evm' ? 'Base' : 'Solana'} network.`,
      });
      
      console.log(`Connected to ${walletType} wallet:`, address);
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${walletType}. Please try again.`,
        variant: "destructive"
      });
      return false;
    } finally {
      setTimeout(() => {
        setIsConnecting(false);
        setConnectingWallet(null);
        console.log('Wallet connection attempt completed');
      }, 2000); // Add a slight delay before removing overlay for a smoother transition
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setWalletIcon(null);
    localStorage.removeItem('chonk9k_wallet_account');
    localStorage.removeItem('chonk9k_wallet_icon');
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };
  
  const getTokenBalance = async (chainType: ChainType): Promise<string> => {
    if (!account) return '0';
    
    // Mock token balance retrieval
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return random balance between 100 and 10000
      const randomBalance = Math.floor(Math.random() * 9900 + 100);
      return randomBalance.toString();
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return '0';
    }
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        connectWallet,
        disconnectWallet,
        isConnecting,
        connectingWallet,
        getTokenBalance,
        isConnected: !!account,
        walletIcon,
      }}
    >
      {children}
      {isConnecting && connectingWallet && (
        <WalletConnectingOverlay 
          isVisible={isConnecting} 
          walletType={connectingWallet} 
        />
      )}
    </WalletContext.Provider>
  );
}

export function useChonkWallet() {
  return useContext(WalletContext);
}