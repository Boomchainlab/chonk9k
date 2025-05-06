import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useChonkWallet } from '@/hooks/useChonkWallet';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, Copy, Power, ChevronDown, Trophy, Star } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type ChainType = 'evm' | 'solana';
type WalletType = 'metamask' | 'phantom' | 'coinbase' | 'solflare';

interface WalletOption {
  id: WalletType;
  name: string;
  logo: string;
  chainSupport: ChainType[];
  description?: string;
}

const walletOptions: WalletOption[] = [
  { 
    id: 'metamask', 
    name: 'MetaMask', 
    logo: '/images/wallets/metamask.svg', 
    chainSupport: ['evm'],
    description: 'Connect to your MetaMask wallet',
  },
  { 
    id: 'coinbase', 
    name: 'Coinbase', 
    logo: '/images/wallets/coinbase.svg', 
    chainSupport: ['evm', 'solana'],
    description: 'Connect to Coinbase Wallet',
  },
  { 
    id: 'phantom', 
    name: 'Phantom', 
    logo: '/images/wallets/phantom.svg', 
    chainSupport: ['solana', 'evm'],
    description: 'Connect to your Phantom wallet',
  },
  { 
    id: 'solflare', 
    name: 'Solflare', 
    logo: '/images/wallets/solflare.svg', 
    chainSupport: ['solana'],
    description: "Solana's non-custodial wallet"
  }
];

interface SimpleGamifiedWalletConnectProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const SimpleGamifiedWalletConnect: React.FC<SimpleGamifiedWalletConnectProps> = ({ 
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const { connectWallet, account, isConnecting, disconnectWallet, walletIcon } = useChonkWallet();
  const { toast } = useToast();
  const [selectedChain, setSelectedChain] = useState<ChainType>('evm');
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0: chain select, 1: wallet select, 2: connecting, 3: success
  const [connectingProgress, setConnectingProgress] = useState(0);
  
  // Demo function to handle wallet connection with animation
  const handleConnectWallet = (wallet: WalletOption) => {
    // Step 2: Show connection animation
    setStep(2);
    
    // Simulate connection animation
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setConnectingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // Demo: always succeed for demonstration purposes
        simulateSuccessfulConnection(wallet);
      }
    }, 100);
  };
  
  const simulateSuccessfulConnection = async (wallet: WalletOption) => {
    try {
      // Attempt to connect the wallet using our hook
      const success = await connectWallet(wallet.id, selectedChain);
      
      if (success) {
        // Update the UI to show success
        setStep(3); // Show success animation
        
        // After a delay, close the modal and show toast
        setTimeout(() => {
          setOpen(false);
          
          // Show achievement notification
          toast({
            title: "Achievement Unlocked!",
            description: "First Wallet Connection: +100 points",
            variant: "default"
          });
        }, 2000);
      } else {
        setStep(1); // Go back to wallet selection
        toast({
          title: "Connection Failed",
          description: "Please try connecting again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in wallet connection:', error);
      setStep(1); // Go back to wallet selection on error
      toast({
        title: "Connection Failed",
        description: "Please try connecting again.",
        variant: "destructive"
      });
    }
  };
  
  // Render the blockchain selection step
  const renderChainSelection = () => (
    <div className="p-4 space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ff00ff]/20 p-3">
          <Trophy className="w-full h-full text-[#ff00ff]" />
        </div>
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
          Choose Your Blockchain
        </h2>
        <p className="text-gray-400 mt-2">
          Begin your CHONK9K journey by selecting a blockchain
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          className={`p-4 rounded-xl border ${selectedChain === 'evm' ? 'border-[#ff00ff] bg-[#ff00ff]/10' : 'border-gray-800 bg-black/50'} transition-all`}
          onClick={() => {
            setSelectedChain('evm');
            setStep(1); // Move to wallet selection
          }}
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#ff00ff]/20 flex items-center justify-center">
            <img src="/images/chains/base.svg" alt="Base" className="w-8 h-8" />
          </div>
          <h3 className="text-md font-bold text-center text-white">Base Chain</h3>
          <p className="text-xs text-center text-gray-400">EVM compatible</p>
        </button>
        
        <button
          className={`p-4 rounded-xl border ${selectedChain === 'solana' ? 'border-[#00e0ff] bg-[#00e0ff]/10' : 'border-gray-800 bg-black/50'} transition-all`}
          onClick={() => {
            setSelectedChain('solana');
            setStep(1); // Move to wallet selection
          }}
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#00e0ff]/20 flex items-center justify-center">
            <img src="/images/chains/solana.svg" alt="Solana" className="w-8 h-8" />
          </div>
          <h3 className="text-md font-bold text-center text-white">Solana</h3>
          <p className="text-xs text-center text-gray-400">Fast transactions</p>
        </button>
      </div>
    </div>
  );
  
  // Render the wallet selection step
  const renderWalletSelection = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm"
          className="border-gray-700 text-gray-400"
          onClick={() => setStep(0)}
        >
          Back
        </Button>
        
        <Badge className={selectedChain === 'evm' ? 
          'bg-[#ff00ff]/20 text-[#ff00ff] border-[#ff00ff]/30' :
          'bg-[#00e0ff]/20 text-[#00e0ff] border-[#00e0ff]/30'
        }>
          {selectedChain === 'evm' ? 'Base Chain' : 'Solana'}
        </Badge>
      </div>
      
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
        Choose Your Wallet
      </h2>
      <p className="text-gray-400 mb-4">
        Connect a wallet to earn CHONK9K rewards
      </p>
      
      <div className="space-y-3">
        {walletOptions
          .filter(wallet => wallet.chainSupport.includes(selectedChain))
          .map(wallet => (
            <button
              key={wallet.id}
              className="flex items-center w-full p-3 rounded-lg bg-black/50 border border-gray-800 hover:border-[#ff00ff]/50 transition-all text-left"
              onClick={() => handleConnectWallet(wallet)}
              disabled={isConnecting}
            >
              <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center p-1 border border-gray-800">
                <div 
                  className="w-full h-full bg-center bg-no-repeat bg-contain" 
                  style={{ backgroundImage: `url(${wallet.logo})` }}
                />
              </div>
              <div className="ml-3">
                <div className="font-medium text-white">{wallet.name}</div>
                <div className="text-xs text-gray-400">{wallet.description}</div>
              </div>
            </button>
          ))
        }
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-[#ff00ff]">
          +100 points for your first wallet connection!
        </p>
      </div>
    </div>
  );
  
  // Render the connecting animation
  const renderConnecting = () => (
    <div className="p-8 flex flex-col items-center justify-center">
      <div className="relative w-20 h-20 mb-6">
        <div className="w-full h-full rounded-full border-4 border-[#ff00ff]/30 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#ff00ff] animate-spin" />
          <Trophy className="h-8 w-8 text-[#ff00ff]" />
        </div>
        
        {connectingProgress > 80 && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <Check className="h-10 w-10 text-[#00e0ff]" />
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-bold text-white mb-4">
        Connecting Wallet
      </h3>
      
      <div className="w-full max-w-xs mb-3">
        <Progress value={connectingProgress} className="h-2 bg-gray-800" />
        <p className="text-right text-xs text-gray-400 mt-1">{connectingProgress}%</p>
      </div>
      
      <div className="text-center text-sm text-gray-400">
        {connectingProgress < 30 && "Initializing connection..."}
        {connectingProgress >= 30 && connectingProgress < 60 && "Verifying wallet..."}
        {connectingProgress >= 60 && connectingProgress < 90 && "Almost there..."}
        {connectingProgress >= 90 && "Connection successful!"}
      </div>
    </div>
  );
  
  // Render the success animation
  const renderSuccess = () => (
    <div className="p-8 flex flex-col items-center justify-center">
      <div className="mb-6 relative">
        <div className="w-20 h-20 rounded-full bg-[#ff00ff]/20 flex items-center justify-center">
          <Trophy className="h-10 w-10 text-[#ff00ff]" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-[#00e0ff] rounded-full w-8 h-8 flex items-center justify-center border-2 border-black">
          <Check className="h-5 w-5 text-black" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3">Wallet Connected!</h3>
      <p className="text-gray-400 mb-4 text-center">
        You've successfully joined the CHONK9K community
      </p>
      
      <div className="py-3 px-4 rounded-lg bg-[#ff00ff]/10 border border-[#ff00ff]/30 mb-6 w-full">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 text-[#ff00ff] mr-2" />
          <span className="text-white font-medium">Achievement Unlocked!</span>
        </div>
        <p className="text-gray-400 text-sm">First Connection: +100 points</p>
      </div>
      
      <Button 
        className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white"
        onClick={() => setOpen(false)}
      >
        Continue
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {account ? (
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
              <div className="ml-2 flex items-center">
                <div className="text-xs mr-1">Lv1</div>
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>
          </Button>
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
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
            {step === 0 && "Start Your Journey"}
            {step === 1 && "Choose Your Wallet"}
            {step === 2 && "Connecting"}
            {step === 3 && "Welcome!"}
          </DialogTitle>
          {step < 2 && (
            <DialogDescription className="text-center text-gray-400">
              Connect your wallet to earn rewards and track achievements
            </DialogDescription>
          )}
        </DialogHeader>
        
        {step === 0 && renderChainSelection()}
        {step === 1 && renderWalletSelection()}
        {step === 2 && renderConnecting()}
        {step === 3 && renderSuccess()}
      </DialogContent>
    </Dialog>
  );
};

export default SimpleGamifiedWalletConnect;