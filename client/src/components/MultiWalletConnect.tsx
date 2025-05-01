import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useChonkWallet } from '@/hooks/useChonkWallet';
import { CONTRACT_ADDRESSES } from '@shared/constants';
import { Loader2, Check, Copy, Power, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type ChainType = 'evm' | 'solana';
type WalletType = 'metamask' | 'phantom' | 'coinbase' | 'solflare' | 'okx' | 'jupiter' | 'raydium' | 'orca' | 'wen' | 'bitverse';

interface WalletOption {
  id: WalletType;
  name: string;
  logo: string;
  type: 'wallet' | 'aggregator';
  chainSupport: ChainType[];
  description?: string;
  popular?: boolean;
}

const walletOptions: WalletOption[] = [
  { 
    id: 'metamask', 
    name: 'MetaMask', 
    logo: '/images/wallets/metamask.svg', 
    type: 'wallet', 
    chainSupport: ['evm'],
    description: 'Connect to your MetaMask wallet',
    popular: true
  },
  { 
    id: 'coinbase', 
    name: 'Coinbase', 
    logo: '/images/wallets/coinbase.svg', 
    type: 'wallet', 
    chainSupport: ['evm', 'solana'],
    description: 'Connect to Coinbase Wallet',
    popular: true
  },
  { 
    id: 'phantom', 
    name: 'Phantom', 
    logo: '/images/wallets/phantom.svg', 
    type: 'wallet', 
    chainSupport: ['solana', 'evm'],
    description: 'Connect to your Phantom wallet',
    popular: true
  },
  { 
    id: 'solflare', 
    name: 'Solflare', 
    logo: '/images/wallets/solflare.svg', 
    type: 'wallet', 
    chainSupport: ['solana'],
    description: "Solana's non-custodial wallet"
  },
  { 
    id: 'bitverse', 
    name: 'Bitverse', 
    logo: '/images/wallets/bitverse.svg', 
    type: 'wallet', 
    chainSupport: ['evm', 'solana'],
    description: 'Multi-chain Crypto Wallet',
    popular: true
  },
  { 
    id: 'okx', 
    name: 'OKX', 
    logo: '/images/wallets/okx.svg', 
    type: 'wallet', 
    chainSupport: ['evm', 'solana'],
    description: 'OKX multi-chain wallet'
  },
  { 
    id: 'jupiter', 
    name: 'Jupiter', 
    logo: '/images/wallets/jupiter.svg', 
    type: 'aggregator', 
    chainSupport: ['solana'],
    description: "Solana's liquidity aggregator",
    popular: true
  },
  { 
    id: 'raydium', 
    name: 'Raydium', 
    logo: '/images/wallets/raydium.svg', 
    type: 'aggregator', 
    chainSupport: ['solana'],
    description: 'AMM and liquidity provider on Solana'
  },
  { 
    id: 'orca', 
    name: 'Orca', 
    logo: '/images/wallets/orca.svg', 
    type: 'aggregator', 
    chainSupport: ['solana'],
    description: 'Trade on Solana with low fees'
  },
  { 
    id: 'wen', 
    name: 'Wen', 
    logo: '/images/wallets/wen.svg', 
    type: 'aggregator', 
    chainSupport: ['solana'],
    description: 'Consumer crypto wallet by Drift Protocol'
  }
];

interface MultiWalletConnectProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const MultiWalletConnect: React.FC<MultiWalletConnectProps> = ({ 
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const { connectWallet, account, isConnecting, disconnectWallet, walletIcon, getTokenBalance } = useChonkWallet();
  const [selectedChain, setSelectedChain] = useState<ChainType>('evm');
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Update token balance when account changes
  useEffect(() => {
    if (account) {
      updateTokenBalance();
    } else {
      setTokenBalance(null);
    }
  }, [account]);

  const updateTokenBalance = async () => {
    if (!account) return;
    
    setIsLoadingBalance(true);
    try {
      const balance = await getTokenBalance(account.chainType);
      setTokenBalance(balance);
    } catch (error) {
      console.error('Error fetching token balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleWalletConnect = async (wallet: WalletOption) => {
    const success = await connectWallet(wallet.id, selectedChain);
    if (success) {
      setOpen(false);
    }
  };
  
  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
    }
  };

  const getTokenSymbol = () => {
    return selectedChain === 'evm' ? 'CHONK9K' : 'CHONK9K';
  };

  const getTokenAddress = () => {
    return selectedChain === 'evm' 
      ? CONTRACT_ADDRESSES.BASE.CHONK9K // Base address
      : CONTRACT_ADDRESSES.SOLANA.CHONK9K; // Solana address
  };

  // Render connected wallet UI
  const renderConnectedWallet = () => {
    if (!account) return null;
    
    return (
      <div className="space-y-6 py-4">
        <div className="flex items-center justify-center space-x-3">
          {walletIcon && (
            <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center p-1 border border-gray-800">
              <div 
                className="w-full h-full bg-center bg-no-repeat bg-contain" 
                style={{ backgroundImage: `url(${walletIcon})` }}
              />
            </div>
          )}
          <div>
            <h3 className="font-medium text-white">
              {account.walletType.charAt(0).toUpperCase() + account.walletType.slice(1)}
            </h3>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <span>{account.address.substring(0, 6)}...{account.address.substring(account.address.length - 4)}</span>
              <button 
                onClick={copyAddress}
                className="p-1 hover:text-[#ff00ff] transition-colors"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>
          <Badge variant="outline" className="ml-2 border-[#00e0ff]/30 text-[#00e0ff]">
            {account.chainType === 'evm' ? 'Base' : 'Solana'}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">$CHONK9K Balance:</span>
            <div className="flex items-center">
              {isLoadingBalance ? (
                <Loader2 className="h-3 w-3 animate-spin text-[#ff00ff]" />
              ) : (
                <span className="font-medium text-white">{tokenBalance || '0'}</span>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Token Contract:</span>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-300">
                {getTokenAddress().substring(0, 4)}...{getTokenAddress().substring(getTokenAddress().length - 4)}
              </span>
              <button 
                onClick={() => navigator.clipboard.writeText(getTokenAddress())}
                className="p-1 hover:text-[#ff00ff] transition-colors"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/10"
            onClick={() => setOpen(false)}
          >
            <Check className="mr-1 h-4 w-4" /> Connected
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full border-gray-800 text-gray-400 hover:bg-red-900/10 hover:text-red-400 hover:border-red-900/50"
            onClick={() => {
              disconnectWallet();
              setOpen(false);
            }}
          >
            <Power className="mr-1 h-4 w-4" /> Disconnect
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {account ? (
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={variant} 
                  size={size}
                  className={`bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90 transition-opacity ${className}`}
                >
                  <div className="flex items-center">
                    {walletIcon && (
                      <div className="w-5 h-5 rounded-full bg-black/50 flex items-center justify-center p-0.5 mr-2 border border-white/20">
                        <div 
                          className="w-full h-full bg-center bg-no-repeat bg-contain" 
                          style={{ backgroundImage: `url(${walletIcon})` }}
                        />
                      </div>
                    )}
                    <span>{account.address.substring(0, 4)}...{account.address.substring(account.address.length - 4)}</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border border-[#ff00ff]/30 text-white min-w-[200px]">
                <div className="px-2 pt-2 pb-1">
                  <div className="text-xs text-gray-400 mb-1">Connected via {account.walletType}</div>
                  <div className="flex items-center space-x-1 text-sm">
                    <span>{account.address.substring(0, 6)}...{account.address.substring(account.address.length - 4)}</span>
                    <button 
                      onClick={copyAddress}
                      className="p-1 hover:text-[#ff00ff] transition-colors"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                  {tokenBalance && (
                    <div className="text-xs text-gray-400 mt-1">
                      {tokenBalance} {getTokenSymbol()}
                    </div>
                  )}
                </div>
                <DropdownMenuItem 
                  className="cursor-pointer text-gray-400 hover:text-white focus:text-white"
                  onClick={() => setOpen(true)}
                >
                  Wallet Details
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-gray-400 hover:text-red-400 focus:text-red-400"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button 
            variant={variant} 
            size={size}
            className={`bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90 transition-opacity ${className}`}
          >
            <span>Connect Wallet</span>
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="bg-black/90 backdrop-blur-xl border border-[#ff00ff]/30 text-white max-w-md w-full">
        {account ? (
          /* Wallet details view */
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                Wallet Details
              </DialogTitle>
              <DialogDescription className="text-center text-gray-400">
                Your wallet is connected to Chonk9k
              </DialogDescription>
            </DialogHeader>
            {renderConnectedWallet()}
          </>
        ) : (
          /* Wallet connection view */
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                Connect Wallet
              </DialogTitle>
              <DialogDescription className="text-center text-gray-400">
                Choose your preferred wallet to connect to Chonk9k
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="wallet" className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-[#ff00ff]/20">
                <TabsTrigger value="wallet" className="data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-[#ff00ff] text-sm">
                  Wallets
                </TabsTrigger>
                <TabsTrigger value="chain" className="data-[state=active]:bg-[#00e0ff]/20 data-[state=active]:text-[#00e0ff] text-sm">
                  Blockchain
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="wallet" className="pt-4">
                {/* Popular Wallets */}
                <div className="space-y-1 mb-4">
                  <h3 className="text-[#ff00ff] text-xs font-medium">Popular Wallets</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {walletOptions
                      .filter(wallet => wallet.popular && wallet.chainSupport.includes(selectedChain))
                      .map(wallet => (
                        <button
                          key={wallet.id}
                          className="flex items-center p-3 rounded-lg bg-black/50 border border-gray-800 hover:border-[#ff00ff]/50 transition-colors text-left"
                          onClick={() => handleWalletConnect(wallet)}
                          disabled={isConnecting}
                        >
                          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center p-1 border border-gray-800">
                            <div 
                              className="w-full h-full bg-center bg-no-repeat bg-contain" 
                              style={{
                                backgroundImage: `url(${wallet.logo})`,
                              }}
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-white">{wallet.name}</span>
                              {wallet.chainSupport.length > 1 && (
                                <Badge variant="outline" className="text-xs border-gray-700">
                                  Multi-chain
                                </Badge>
                              )}
                            </div>
                            {wallet.description && (
                              <p className="text-xs text-gray-400">{wallet.description}</p>
                            )}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
                
                {/* All Wallets */}
                <div className="space-y-1">
                  <h3 className="text-[#00e0ff] text-xs font-medium">All Wallets</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {walletOptions
                      .filter(wallet => wallet.type === 'wallet' && wallet.chainSupport.includes(selectedChain))
                      .map(wallet => (
                        <button
                          key={wallet.id}
                          className="flex flex-col items-center justify-center p-3 rounded-lg bg-black/50 border border-gray-800 hover:border-[#ff00ff]/50 transition-colors"
                          onClick={() => handleWalletConnect(wallet)}
                          disabled={isConnecting}
                        >
                          <div className="w-12 h-12 mb-2 rounded-full bg-black/50 flex items-center justify-center p-1">
                            <div 
                              className="w-full h-full bg-center bg-no-repeat bg-contain" 
                              style={{
                                backgroundImage: `url(${wallet.logo})`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-300">{wallet.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
                
                {/* Aggregators (Only for Solana) */}
                {selectedChain === 'solana' && (
                  <div className="space-y-1 mt-4">
                    <h3 className="text-[#00e0ff] text-xs font-medium">Aggregators</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {walletOptions
                        .filter(wallet => wallet.type === 'aggregator')
                        .map(aggregator => (
                          <button
                            key={aggregator.id}
                            className="flex flex-col items-center justify-center p-3 rounded-lg bg-black/50 border border-gray-800 hover:border-[#00e0ff]/50 transition-colors"
                            onClick={() => handleWalletConnect(aggregator)}
                            disabled={isConnecting}
                          >
                            <div className="w-10 h-10 mb-2 rounded-full bg-black/50 flex items-center justify-center p-1">
                              <div 
                                className="w-full h-full bg-center bg-no-repeat bg-contain" 
                                style={{
                                  backgroundImage: `url(${aggregator.logo})`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-300">{aggregator.name}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="chain" className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-[#ff00ff] text-xs font-medium">Select Blockchain</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        className={`flex items-center p-3 rounded-lg border transition-colors ${selectedChain === 'evm' 
                          ? 'bg-[#ff00ff]/10 border-[#ff00ff]/30' 
                          : 'bg-black/50 border-gray-800 hover:border-[#ff00ff]/30 hover:bg-black/70'}`}
                        onClick={() => setSelectedChain('evm')}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0052ff] to-[#0052ff] flex items-center justify-center">
                          <span className="font-bold text-white">B</span>
                        </div>
                        <div className="ml-3 text-left">
                          <span className="text-sm font-medium">Base</span>
                          <p className="text-xs text-gray-400">EVM Compatible</p>
                        </div>
                        {selectedChain === 'evm' && (
                          <Check className="ml-auto text-[#ff00ff] h-4 w-4" />
                        )}
                      </button>
                      
                      <button
                        className={`flex items-center p-3 rounded-lg border transition-colors ${selectedChain === 'solana' 
                          ? 'bg-[#00e0ff]/10 border-[#00e0ff]/30' 
                          : 'bg-black/50 border-gray-800 hover:border-[#00e0ff]/30 hover:bg-black/70'}`}
                        onClick={() => setSelectedChain('solana')}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#9945ff] to-[#14f195] flex items-center justify-center">
                          <span className="font-bold text-white">S</span>
                        </div>
                        <div className="ml-3 text-left">
                          <span className="text-sm font-medium">Solana</span>
                          <p className="text-xs text-gray-400">Fast & Low fees</p>
                        </div>
                        {selectedChain === 'solana' && (
                          <Check className="ml-auto text-[#00e0ff] h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-[#00e0ff] text-xs font-medium">Chain Details</h3>
                    <div className="bg-black/30 rounded-lg border border-gray-800 p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Chain Name</span>
                        <span className="text-xs">{selectedChain === 'evm' ? 'Base' : 'Solana'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Token Contract</span>
                        <span className="text-xs">
                          {getTokenAddress().substring(0, 4)}...{getTokenAddress().substring(getTokenAddress().length - 4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Network</span>
                        <span className="text-xs">{selectedChain === 'evm' ? 'Mainnet' : 'Mainnet'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Symbol</span>
                        <span className="text-xs">CHONK9K</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {isConnecting && (
              <div className="flex justify-center items-center py-2">
                <Loader2 className="h-5 w-5 animate-spin text-[#ff00ff] mr-2" />
                <span className="text-sm">Connecting...</span>
              </div>
            )}
            
            <div className="mt-4 text-center text-xs text-gray-500">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MultiWalletConnect;