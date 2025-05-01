import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface WalletContextType {
  account: string | null;
  chainId: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
}

const defaultContext: WalletContextType = {
  account: null,
  chainId: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
};

const WalletContext = createContext<WalletContextType>(defaultContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check for stored wallet connection on mount
  useEffect(() => {
    const savedAccount = localStorage.getItem('chonk9k_wallet_address');
    const savedChainId = localStorage.getItem('chonk9k_chain_id');
    
    if (savedAccount) {
      setAccount(savedAccount);
      setChainId(savedChainId);
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // In a real implementation, this would connect to an actual wallet
      // For demonstration, we'll simulate a successful connection
      
      // Simulating delay for connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a random wallet address for simulation
      const mockAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      const mockChainId = '0x1'; // Ethereum mainnet
      
      setAccount(mockAddress);
      setChainId(mockChainId);
      
      // Save to local storage
      localStorage.setItem('chonk9k_wallet_address', mockAddress);
      localStorage.setItem('chonk9k_chain_id', mockChainId);
      
      console.log('Connected to wallet:', mockAddress);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    localStorage.removeItem('chonk9k_wallet_address');
    localStorage.removeItem('chonk9k_chain_id');
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        connectWallet,
        disconnectWallet,
        isConnecting,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useChonkWallet = () => useContext(WalletContext);
