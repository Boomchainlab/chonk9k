import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from "@/hooks/use-toast";

interface ChonkWalletContextType {
  account: string;
  provider: ethers.BrowserProvider | null;
  isConnecting: boolean;
  chainId: number | null;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const ChonkWalletContext = createContext<ChonkWalletContextType>({
  account: '',
  provider: null,
  isConnecting: false,
  chainId: null,
  balance: '',
  connectWallet: async () => {},
  disconnectWallet: () => {}
});

export const useChonkWallet = () => useContext(ChonkWalletContext);

interface ChonkWalletProviderProps {
  children: ReactNode;
}

export const ChonkWalletProvider = ({ children }: ChonkWalletProviderProps) => {
  const [account, setAccount] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>('');
  const { toast } = useToast();

  // Check for existing connection
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await ethProvider.listAccounts();
          
          if (accounts.length > 0) {
            setProvider(ethProvider);
            setAccount(accounts[0].address);
            updateWalletInfo(accounts[0].address, ethProvider);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          if (provider) {
            updateWalletInfo(accounts[0], provider);
          }
        } else {
          disconnectWallet();
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        setChainId(parseInt(chainIdHex, 16));
        window.location.reload();
      };

      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      }

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [provider]);

  const updateWalletInfo = async (walletAddress: string, provider: ethers.BrowserProvider) => {
    try {
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));

      const balance = await provider.getBalance(walletAddress);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error updating wallet info:", error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "No Ethereum Wallet Found",
        description: "Please install MetaMask or another Ethereum wallet provider.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsConnecting(true);
      
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await ethProvider.send("eth_requestAccounts", []);
      
      setProvider(ethProvider);
      setAccount(accounts[0]);
      
      await updateWalletInfo(accounts[0], ethProvider);
      
      toast({
        title: "Chonk Wallet Connected",
        description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "There was an error connecting to your wallet.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setProvider(null);
    setChainId(null);
    setBalance('');
    
    toast({
      title: "Wallet Disconnected",
      description: "Your Chonk wallet has been disconnected.",
      variant: "default"
    });
  };

  return (
    <ChonkWalletContext.Provider
      value={{
        account,
        provider,
        isConnecting,
        chainId,
        balance,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </ChonkWalletContext.Provider>
  );
};
