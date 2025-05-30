import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ethers } from 'ethers';

// Animation frames for Chonk9k character
const animationFrames = [
  "(^._.^)",
  "(^.o.^)",
  "(^O_O^)",
  "(^o.o^)",
  "(^-.-^)"
];

interface ChonkWalletConnectProps {
  onConnect?: (account: string, provider: ethers.BrowserProvider) => void;
}

const ChonkWalletConnect: React.FC<ChonkWalletConnectProps> = ({ onConnect }) => {
  const [account, setAccount] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const { toast } = useToast();

  // Animation effect
  useEffect(() => {
    let interval: number;
    
    if (isConnecting) {
      interval = window.setInterval(() => {
        setFrameIndex((prevIndex) => (prevIndex + 1) % animationFrames.length);
      }, 200);
    } else {
      setFrameIndex(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnecting]);

  // Effect to check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await ethProvider.listAccounts();
          
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
            setProvider(ethProvider);
            if (onConnect) onConnect(accounts[0].address, ethProvider);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, [onConnect]);

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
      
      if (onConnect) onConnect(accounts[0], ethProvider);
      
      toast({
        title: "Wallet Connected",
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
    setAccount("");
    setProvider(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
      variant: "default"
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-4xl font-mono animate-pulse" style={{ animationDuration: isConnecting ? '0.5s' : '2s' }}>
        {isConnecting ? animationFrames[frameIndex] : "(^._.^)"}
      </div>
      
      <div className="relative">
        {account ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
            </p>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={disconnectWallet}
              className="animate-bounce hover:animate-none"
            >
              Disconnect Chonk Wallet
            </Button>
          </div>
        ) : (
          <Button 
            variant="default" 
            onClick={connectWallet} 
            disabled={isConnecting}
            className={isConnecting ? "animate-bounce bg-gradient-to-r from-pink-500 to-purple-500" : "bg-gradient-to-r from-pink-500 to-purple-500"}
          >
            {isConnecting ? "Connecting..." : "Connect Chonk Wallet"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChonkWalletConnect;
