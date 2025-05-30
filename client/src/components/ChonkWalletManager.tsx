import { useState, useEffect } from 'react';
import { useChonkWallet } from '@/hooks/useChonkWallet';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AnimatedChonkCharacter from './AnimatedChonkCharacter';
import { Badge } from "@/components/ui/badge";
import { ethers } from 'ethers';

const networkNames: { [key: number]: string } = {
  1: "Ethereum Mainnet",
  56: "Binance Smart Chain",
  137: "Polygon",
  8453: "Base",
  84532: "Base Sepolia"
};

const ChonkWalletManager = () => {
  const { account, provider, isConnecting, chainId, balance, connectWallet, disconnectWallet } = useChonkWallet();
  const [chonkBalance, setChonkBalance] = useState<string>('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  // Function to fetch CHONK9K token balance
  useEffect(() => {
    const fetchChonkBalance = async () => {
      if (!account || !provider || !chainId) return;
      
      // Mock fetching CHONK9K balance - in real app, we would use the actual contract address
      setIsLoadingBalance(true);
      try {
        // This is where we would normally check the balance from the contract
        // For now, we'll simulate it with a random amount
        setTimeout(() => {
          // Set a random number of tokens between 100 and 10,000
          const randomBalance = (Math.random() * 9900 + 100).toFixed(2);
          setChonkBalance(randomBalance);
          setIsLoadingBalance(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching CHONK9K balance:", error);
        setChonkBalance('0');
        setIsLoadingBalance(false);
      }
    };

    if (account && provider) {
      fetchChonkBalance();
    }
  }, [account, provider, chainId]);

  const copyAddressToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getNetworkName = (id: number | null) => {
    if (!id) return "Unknown Network";
    return networkNames[id] || `Chain ID: ${id}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-pink-500/20 bg-gradient-to-b from-background to-muted/50">
      <CardHeader className="pb-0">
        <CardTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
          {account ? 'Your Chonk Wallet' : 'Connect Chonk Wallet'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        <div className="flex justify-center p-4">
          <AnimatedChonkCharacter />
        </div>
        
        {account ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Address:</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={copyAddressToClipboard}>
                    {formatAddress(account)}
                    {copiedAddress ? ' ✓' : ''}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network:</span>
                <Badge variant="outline" className={chainId === 8453 || chainId === 84532 ? 'bg-green-500/10 text-green-500' : ''}>
                  {getNetworkName(chainId)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ETH Balance:</span>
                <Badge variant="outline">
                  {balance ? parseFloat(balance).toFixed(4) : '0'} ETH
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">CHONK9K Balance:</span>
                {isLoadingBalance ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <Badge variant="secondary" className="bg-pink-500/20 text-pink-500">
                    {chonkBalance} CHONK
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 text-muted-foreground text-sm">
            <p>Connect your wallet to access your CHONK9K tokens and interact with the platform.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {account ? (
          <Button 
            variant="destructive" 
            onClick={disconnectWallet} 
            className="w-full hover:bg-red-600 transition-colors"
          >
            Disconnect Wallet
          </Button>
        ) : (
          <Button 
            variant="default" 
            onClick={connectWallet} 
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 transition-opacity"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ChonkWalletManager;
