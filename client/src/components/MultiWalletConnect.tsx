import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useChonkWallet } from '@/hooks/useChonkWallet';

interface WalletOption {
  id: string;
  name: string;
  logo: string;
  type: 'wallet' | 'aggregator';
  chainSupport: ('evm' | 'solana')[];
}

const walletOptions: WalletOption[] = [
  { id: 'metamask', name: 'MetaMask', logo: '/images/wallets/metamask.png', type: 'wallet', chainSupport: ['evm'] },
  { id: 'coinbase', name: 'Coinbase', logo: '/images/wallets/coinbase.png', type: 'wallet', chainSupport: ['evm', 'solana'] },
  { id: 'phantom', name: 'Phantom', logo: '/images/wallets/phantom.png', type: 'wallet', chainSupport: ['solana', 'evm'] },
  { id: 'solflare', name: 'Solflare', logo: '/images/wallets/solflare.png', type: 'wallet', chainSupport: ['solana'] },
  { id: 'okx', name: 'OKX', logo: '/images/wallets/okx.png', type: 'wallet', chainSupport: ['evm', 'solana'] },
  { id: 'jupiter', name: 'Jupiter', logo: '/images/wallets/jupiter.png', type: 'aggregator', chainSupport: ['solana'] },
  { id: 'raydium', name: 'Raydium', logo: '/images/wallets/raydium.png', type: 'aggregator', chainSupport: ['solana'] },
  { id: 'orca', name: 'Orca', logo: '/images/wallets/orca.png', type: 'aggregator', chainSupport: ['solana'] },
  { id: 'wen', name: 'Wen', logo: '/images/wallets/wen.png', type: 'aggregator', chainSupport: ['solana'] },
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
  const { connectWallet, account } = useChonkWallet();
  const [selectedChain, setSelectedChain] = useState<'evm' | 'solana'>('evm');
  const [open, setOpen] = useState(false);

  const handleWalletConnect = (wallet: WalletOption) => {
    console.log(`Connecting to ${wallet.name}`);
    connectWallet();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={`bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90 transition-opacity ${className}`}
        >
          {account ? (
            <span>{account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
          ) : (
            <span>Connect Wallet</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 backdrop-blur-xl border border-[#ff00ff]/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Choose your preferred wallet to connect to Chonk9k
          </DialogDescription>
        </DialogHeader>
        
        {/* Chain selector */}
        <div className="flex justify-center mb-4">
          <div className="flex rounded-lg overflow-hidden border border-[#ff00ff]/30">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${selectedChain === 'evm'
                ? 'bg-[#ff00ff]/20 text-[#ff00ff]'
                : 'bg-black/50 text-gray-400 hover:text-white hover:bg-black/70'
              }`}
              onClick={() => setSelectedChain('evm')}
            >
              EVM (Base)
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${selectedChain === 'solana'
                ? 'bg-[#00e0ff]/20 text-[#00e0ff]'
                : 'bg-black/50 text-gray-400 hover:text-white hover:bg-black/70'
              }`}
              onClick={() => setSelectedChain('solana')}
            >
              Solana
            </button>
          </div>
        </div>
        
        {/* Wallets */}
        <div className="space-y-4">
          <h3 className="text-[#ff00ff] text-sm font-medium">Wallets</h3>
          <div className="grid grid-cols-3 gap-2">
            {walletOptions
              .filter(wallet => wallet.type === 'wallet' && wallet.chainSupport.includes(selectedChain))
              .map(wallet => (
                <button
                  key={wallet.id}
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-black/50 border border-gray-800 hover:border-[#ff00ff]/50 transition-colors"
                  onClick={() => handleWalletConnect(wallet)}
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
        
        {/* Aggregators */}
        {selectedChain === 'solana' && (
          <div className="space-y-4">
            <h3 className="text-[#00e0ff] text-sm font-medium">Aggregators</h3>
            <div className="grid grid-cols-4 gap-2">
              {walletOptions
                .filter(wallet => wallet.type === 'aggregator')
                .map(aggregator => (
                  <button
                    key={aggregator.id}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-black/50 border border-gray-800 hover:border-[#00e0ff]/50 transition-colors"
                    onClick={() => handleWalletConnect(aggregator)}
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
        
        <div className="mt-4 text-center text-xs text-gray-500">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiWalletConnect;