import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, X, ExternalLink, CopyCheck, Copy, RefreshCw } from 'lucide-react';
import ChonkTokenLogo from './ChonkTokenLogo';
import { CONTRACT_ADDRESSES } from '@shared/constants';

interface TokenBalanceTrackerProps {
  className?: string;
}

interface WalletBalance {
  address: string;
  balance: string;
  network: 'solana' | 'ethereum' | 'bsc' | 'base';
  nickname?: string;
  lastUpdated: Date;
}

const TokenBalanceTracker: React.FC<TokenBalanceTrackerProps> = ({ 
  className = ''
}) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletNickname, setWalletNickname] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<'solana' | 'ethereum' | 'bsc' | 'base'>('solana');
  const [isLoading, setIsLoading] = useState(false);
  const [wallets, setWallets] = useState<WalletBalance[]>([
    {
      address: '5e7Z2cWkQKYWDvpaApCxmGZi1M2pHmxyKijJxbCfrkUy',
      balance: '38750000',
      network: 'solana',
      nickname: 'Treasury',
      lastUpdated: new Date()
    },
    {
      address: '2Lp2SGS9AKYVKCorizjzJLPHn4swatnbvEQ2UB2bKorJy',
      balance: '48500000',
      network: 'solana',
      nickname: 'Team Wallet',
      lastUpdated: new Date()
    },
    {
      address: '0x3A7e2eECf7338A98bB21b696D8EeF3224344fd33',
      balance: '18750000',
      network: 'ethereum',
      nickname: 'ETH Treasury',
      lastUpdated: new Date()
    }
  ]);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  
  // Add a new wallet to track
  const handleAddWallet = () => {
    if (!walletAddress.trim()) return;
    
    setIsLoading(true);
    
    // Simulate fetching balance from blockchain
    setTimeout(() => {
      // Generate a random balance between 100 and 10,000,000
      const randomBalance = Math.floor(Math.random() * 10000000) + 100;
      
      const newWallet: WalletBalance = {
        address: walletAddress,
        balance: randomBalance.toString(),
        network: selectedNetwork,
        nickname: walletNickname || undefined,
        lastUpdated: new Date()
      };
      
      setWallets(prev => [...prev, newWallet]);
      setWalletAddress('');
      setWalletNickname('');
      setIsLoading(false);
    }, 1500);
  };
  
  // Remove a wallet from tracking
  const handleRemoveWallet = (address: string) => {
    setWallets(prev => prev.filter(wallet => wallet.address !== address));
  };
  
  // Refresh a specific wallet balance
  const handleRefreshWallet = (address: string) => {
    setWallets(prev => prev.map(wallet => {
      if (wallet.address === address) {
        // Simulate updated balance (±10%)
        const currentBalance = parseFloat(wallet.balance);
        const fluctuation = (Math.random() * 0.2) - 0.1; // -10% to +10%
        const newBalance = Math.max(0, currentBalance * (1 + fluctuation));
        
        return {
          ...wallet,
          balance: Math.floor(newBalance).toString(),
          lastUpdated: new Date()
        };
      }
      return wallet;
    }));
  };
  
  // Handle copying address to clipboard
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
      .then(() => {
        setCopiedAddress(address);
        setTimeout(() => setCopiedAddress(null), 2000);
      })
      .catch(err => console.error('Could not copy address:', err));
  };
  
  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Format balance with commas
  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toFixed(2);
    }
  };
  
  // Get explorer URL based on network
  const getExplorerUrl = (address: string, network: 'solana' | 'ethereum' | 'bsc' | 'base') => {
    switch (network) {
      case 'solana':
        return `https://solscan.io/address/${address}`;
      case 'ethereum':
        return `https://etherscan.io/address/${address}`;
      case 'bsc':
        return `https://bscscan.com/address/${address}`;
      case 'base':
        return `https://basescan.org/address/${address}`;
      default:
        return '#';
    }
  };
  
  // Get network icon
  const getNetworkIcon = (network: 'solana' | 'ethereum' | 'bsc' | 'base') => {
    return `/images/networks/${network}.svg`;
  };
  
  // Calculate total balance across all wallets
  const calculateTotalBalance = () => {
    return wallets.reduce((total, wallet) => total + parseFloat(wallet.balance), 0);
  };
  
  return (
    <Card className={`bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3">
        <CardTitle className="text-lg font-bold text-white flex items-center">
          <Wallet className="mr-2 h-5 w-5 text-[#ff00ff]" />
          CHONK9K Balance Tracker
        </CardTitle>
        <CardDescription className="text-gray-400">
          Track CHONK9K balances across multiple wallets and chains
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* Add Wallet Form */}
        <div className="bg-black/30 p-3 rounded-lg border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-white text-sm">Add Wallet to Track</h4>
            
            <div className="flex space-x-1">
              {['solana', 'ethereum', 'bsc', 'base'].map((network) => (
                <button
                  key={network}
                  onClick={() => setSelectedNetwork(network as any)}
                  className={`p-1 rounded-md transition-colors ${selectedNetwork === network ? 
                    'bg-[#ff00ff]/30 text-white' : 
                    'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                  title={`${network.charAt(0).toUpperCase() + network.slice(1)} Network`}
                >
                  <img 
                    src={`/images/networks/${network}.svg`} 
                    alt={network} 
                    className="w-5 h-5"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/networks/default.svg';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Input
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter wallet address"
              className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 flex-1"
            />
            <Input
              value={walletNickname}
              onChange={(e) => setWalletNickname(e.target.value)}
              placeholder="Nickname (optional)"
              className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 sm:w-1/3"
            />
            <Button
              onClick={handleAddWallet}
              disabled={isLoading || !walletAddress.trim()}
              className="bg-[#ff00ff] hover:bg-[#ff00ff]/80 text-white sm:w-auto"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </span>
              ) : (
                <span className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Wallets List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-white text-sm">Tracked Wallets</h4>
            <Badge className="bg-[#00e0ff]/20 border-[#00e0ff]/30 text-[#00e0ff]">
              Total: {formatBalance(calculateTotalBalance().toString())} CHONK9K
            </Badge>
          </div>
          
          {wallets.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              No wallets added yet. Add a wallet to start tracking.
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {wallets.map((wallet, index) => (
                <div 
                  key={index} 
                  className="bg-black/40 p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <img 
                        src={getNetworkIcon(wallet.network)} 
                        alt={wallet.network}
                        className="w-5 h-5 mr-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/networks/default.svg';
                        }}
                      />
                      <div>
                        <div className="flex items-center">
                          <span className="text-white text-sm font-mono">
                            {formatAddress(wallet.address)}
                          </span>
                          <button 
                            onClick={() => handleCopyAddress(wallet.address)}
                            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors ml-1"
                          >
                            {copiedAddress === wallet.address ? (
                              <CopyCheck className="h-3.5 w-3.5 text-green-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <a 
                            href={getExplorerUrl(wallet.address, wallet.network)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                        {wallet.nickname && (
                          <div className="text-gray-400 text-xs">{wallet.nickname}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleRefreshWallet(wallet.address)}
                        className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800 transition-colors"
                        title="Refresh balance"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleRemoveWallet(wallet.address)}
                        className="text-gray-400 hover:text-red-400 p-1 rounded-md hover:bg-gray-800 transition-colors"
                        title="Remove wallet"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-black/30 p-2 rounded-lg">
                    <ChonkTokenLogo size={24} useAnimation={false} className="mr-2" />
                    <div>
                      <div className="text-[#00e0ff] font-medium">
                        {formatBalance(wallet.balance)} CHONK9K
                      </div>
                      <div className="text-gray-500 text-xs">
                        Updated: {wallet.lastUpdated.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Contract Info */}
        <div className="mt-4 bg-black/20 p-3 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white text-sm flex items-center">
              <ChonkTokenLogo size={16} useAnimation={false} className="mr-2" />
              Token Contract
            </h4>
            <Badge variant="outline" className="bg-black/50 border-[#00e0ff]/50 text-[#00e0ff]">
              {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs bg-black/30 p-2 rounded-lg">
            <span className="text-gray-400 font-mono overflow-hidden text-ellipsis">
              {selectedNetwork === 'solana' && CONTRACT_ADDRESSES.SOLANA_TOKEN}
              {selectedNetwork === 'ethereum' && CONTRACT_ADDRESSES.ETH_TOKEN}
              {selectedNetwork === 'bsc' && CONTRACT_ADDRESSES.BSC_TOKEN}
              {selectedNetwork === 'base' && CONTRACT_ADDRESSES.BASE_TOKEN}
            </span>
            <div className="flex">
              <button 
                onClick={() => {
                  const addr = 
                    selectedNetwork === 'solana' ? CONTRACT_ADDRESSES.SOLANA_TOKEN :
                    selectedNetwork === 'ethereum' ? CONTRACT_ADDRESSES.ETH_TOKEN :
                    selectedNetwork === 'bsc' ? CONTRACT_ADDRESSES.BSC_TOKEN :
                    CONTRACT_ADDRESSES.BASE_TOKEN;
                  handleCopyAddress(addr);
                }}
                className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenBalanceTracker;