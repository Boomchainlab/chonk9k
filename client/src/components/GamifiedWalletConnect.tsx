import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useChonkWallet } from '@/hooks/useChonkWallet';
import { CONTRACT_ADDRESSES } from '@shared/constants';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, Copy, Power, ChevronDown, Trophy, Star, Sparkles, Rocket, Zap, ShieldCheck } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from "framer-motion";
import ChonkTokenLogo from './ChonkTokenLogo';

type ChainType = 'evm' | 'solana';
type WalletType = 'metamask' | 'phantom' | 'coinbase' | 'solflare' | 'okx' | 'jupiter' | 'raydium' | 'orca' | 'wen' | 'bitverse' | 'warpcast' | 'frame' | 'rainbow';

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
    id: 'warpcast', 
    name: 'Warpcast', 
    logo: '/images/wallets/warpcast.svg', 
    type: 'wallet', 
    chainSupport: ['evm'],
    description: 'Connect with Farcaster',
    popular: true
  },
  { 
    id: 'rainbow', 
    name: 'Rainbow', 
    logo: '/images/wallets/rainbow.svg', 
    type: 'wallet', 
    chainSupport: ['evm'],
    description: 'Beautiful, simple Ethereum wallet',
    popular: true
  },
  { 
    id: 'frame', 
    name: 'Frame', 
    logo: '/images/wallets/frame.svg', 
    type: 'wallet', 
    chainSupport: ['evm'],
    description: 'Privacy-focused desktop wallet'
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

// Define levels and achievements
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  points: number;
}

interface Level {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: React.ReactNode;
}

const getInitialAchievements = (): Achievement[] => [
  {
    id: 'first_connect',
    title: 'First Connection',
    description: 'Connected a wallet for the first time',
    icon: <Zap className="h-4 w-4 text-yellow-400" />,
    unlocked: false,
    points: 100
  },
  {
    id: 'multi_chain',
    title: 'Multi-Chain Explorer',
    description: 'Connected to both EVM and Solana chains',
    icon: <Rocket className="h-4 w-4 text-purple-400" />,
    unlocked: false,
    points: 200
  },
  {
    id: 'token_balance',
    title: 'CHONK9K Holder',
    description: 'Held CHONK9K tokens in your wallet',
    icon: <Trophy className="h-4 w-4 text-amber-400" />,
    unlocked: false,
    points: 300
  },
  {
    id: 'connection_streak',
    title: 'Connection Streak',
    description: 'Connected wallet for 3 consecutive days',
    icon: <Sparkles className="h-4 w-4 text-blue-400" />,
    unlocked: false,
    points: 500
  },
  {
    id: 'security_check',
    title: 'Security Guardian',
    description: 'Completed wallet security check',
    icon: <ShieldCheck className="h-4 w-4 text-green-400" />,
    unlocked: false,
    points: 250
  }
];

const levels: Level[] = [
  {
    level: 1,
    title: 'Novice Chonker',
    minPoints: 0,
    maxPoints: 299,
    color: '#ff00ff',
    icon: <Star className="h-4 w-4" />
  },
  {
    level: 2,
    title: 'Advanced Chonker',
    minPoints: 300,
    maxPoints: 799,
    color: '#00e0ff',
    icon: <Star className="h-4 w-4" />
  },
  {
    level: 3,
    title: 'Pro Chonker',
    minPoints: 800,
    maxPoints: 1499,
    color: '#ffcc00',
    icon: <Star className="h-4 w-4" />
  },
  {
    level: 4,
    title: 'Master Chonker',
    minPoints: 1500,
    maxPoints: Infinity,
    color: '#ff3366',
    icon: <Trophy className="h-4 w-4" />
  }
];

interface GamifiedWalletConnectProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const GamifiedWalletConnect: React.FC<GamifiedWalletConnectProps> = ({ 
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const { connectWallet, account, isConnecting, disconnectWallet, walletIcon, getTokenBalance } = useChonkWallet();
  const { toast } = useToast();
  const [selectedChain, setSelectedChain] = useState<ChainType>('evm');
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>(getInitialAchievements());
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);
  const [gamificationStep, setGamificationStep] = useState(0); // 0: chain select, 1: wallet select, 2: connecting animation, 3: success
  const [connectionAnimationProgress, setConnectionAnimationProgress] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [securityChecked, setSecurityChecked] = useState(false);
  
  // Animation ref
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem('chonk9k_achievements');
    const savedPoints = localStorage.getItem('chonk9k_points');
    
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements));
      } catch (e) {
        console.error('Error parsing saved achievements:', e);
      }
    }
    
    if (savedPoints) {
      try {
        setTotalPoints(parseInt(savedPoints, 10));
      } catch (e) {
        console.error('Error parsing saved points:', e);
      }
    }
  }, []);

  // Update current level based on points
  useEffect(() => {
    const newLevel = levels.find(level => 
      totalPoints >= level.minPoints && totalPoints <= level.maxPoints
    ) || levels[0];
    
    setCurrentLevel(newLevel);
    
    // Save points to localStorage
    localStorage.setItem('chonk9k_points', totalPoints.toString());
  }, [totalPoints]);

  // Update token balance when account changes
  useEffect(() => {
    if (account) {
      updateTokenBalance();
      checkWalletAchievements();
    } else {
      setTokenBalance(null);
    }

    // Cleanup animation timeout
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [account]);

  const updateTokenBalance = async () => {
    if (!account) return;
    
    setIsLoadingBalance(true);
    try {
      const balance = await getTokenBalance(account.chainType);
      setTokenBalance(balance);
      
      // Check if user has tokens and unlock achievement if needed
      if (parseInt(balance, 10) > 0) {
        unlockAchievement('token_balance');
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const unlockAchievement = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;

    // Mark achievement as unlocked
    const updatedAchievements = achievements.map(a => 
      a.id === achievementId ? { ...a, unlocked: true } : a
    );
    
    setAchievements(updatedAchievements);
    localStorage.setItem('chonk9k_achievements', JSON.stringify(updatedAchievements));
    
    // Add points
    setTotalPoints(prev => prev + achievement.points);
    
    // Show achievement popup
    setRecentAchievement(achievement);
    setShowAchievementPopup(true);
    
    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowAchievementPopup(false);
    }, 3000);
  };

  const checkWalletAchievements = () => {
    // First connection achievement
    unlockAchievement('first_connect');
    
    // Check multi-chain achievement - we'll simulate this based on the chain type
    const hasEVMConnection = localStorage.getItem('chonk9k_evm_connected') === 'true';
    const hasSolanaConnection = localStorage.getItem('chonk9k_solana_connected') === 'true';
    
    if (account?.chainType === 'evm') {
      localStorage.setItem('chonk9k_evm_connected', 'true');
    } else if (account?.chainType === 'solana') {
      localStorage.setItem('chonk9k_solana_connected', 'true');
    }
    
    if ((hasEVMConnection && account?.chainType === 'solana') || 
        (hasSolanaConnection && account?.chainType === 'evm')) {
      unlockAchievement('multi_chain');
    }
    
    // Check connection streak
    const today = new Date().toISOString().split('T')[0];
    const lastConnection = localStorage.getItem('chonk9k_last_connection');
    const streakCount = parseInt(localStorage.getItem('chonk9k_connection_streak') || '0', 10);
    
    if (lastConnection !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastConnection === yesterdayStr) {
        // Consecutive day
        const newStreakCount = streakCount + 1;
        localStorage.setItem('chonk9k_connection_streak', newStreakCount.toString());
        
        if (newStreakCount >= 3) {
          unlockAchievement('connection_streak');
        }
      } else {
        // Streak broken
        localStorage.setItem('chonk9k_connection_streak', '1');
      }
      
      localStorage.setItem('chonk9k_last_connection', today);
    }
  };

  const handleWalletConnect = async (wallet: WalletOption) => {
    setGamificationStep(2); // Start connection animation
    
    // Simulate connection animation
    setConnectionAnimationProgress(0);
    let progress = 0;
    const animationInterval = setInterval(() => {
      progress += 5;
      setConnectionAnimationProgress(progress);
      
      if (progress >= 100) {
        clearInterval(animationInterval);
        finalizeConnection(wallet);
      }
    }, 100);
    
    // Clean up interval in case component unmounts
    animationTimeoutRef.current = setTimeout(() => {
      clearInterval(animationInterval);
    }, 2500);
  };
  
  const finalizeConnection = async (wallet: WalletOption) => {
    try {
      console.log('Starting finalizeConnection with wallet:', wallet.id, 'and chain:', selectedChain);
      // Simple demo approach - bypass the connection to always succeed and show the flow
      // Remove this line when you want to test the actual wallet connection
      const success = true;
      // When ready to test real wallet connection, uncomment the following line:
      // const success = await connectWallet(wallet.id, selectedChain);
      
      // Mock wallet connection for UI demo
      // This generates a fake address and sets it in the wallet account
      const address = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const mockWalletAccount = {
        address,
        chainType: selectedChain,
        chainId: selectedChain === 'evm' ? '0x1' : undefined,
        walletType: wallet.id,
        balance: '0.0'
      };
      
      // Save the wallet icon (simulation)
      const icon = `/images/wallets/${wallet.id}.svg`;
      
      // Set to local state to display in UI
      setWalletIcon(icon);
      console.log('Connection attempt result:', success);
      
      if (success) {
        console.log('Connection successful, showing success animation');
        setGamificationStep(3); // Success animation
        
        // Update account state with the mock wallet data
        setAccount(mockWalletAccount);
        
        // Save to local storage (simulation)
        localStorage.setItem('chonk9k_wallet_account', JSON.stringify(mockWalletAccount));
        localStorage.setItem('chonk9k_wallet_icon', icon);
        
        // Unlock first connection achievement
        unlockAchievement('first_connect');
        
        setTimeout(() => {
          setWalletConnected(true);
          setOpen(false);
          
          // Track chain connection for multi-chain achievement
          if (selectedChain === 'evm') {
            localStorage.setItem('chonk9k_evm_connected', 'true');
          } else {
            localStorage.setItem('chonk9k_solana_connected', 'true');
          }
          
          // Set connection streak data
          const today = new Date().toISOString().split('T')[0];
          localStorage.setItem('chonk9k_last_connection', today);
          
          toast({
            title: "Achievement Unlocked!",
            description: "You've taken your first step into the world of CHONK9K!",
            variant: "default"
          });
        }, 1500);
      } else {
        console.log('Connection failed, returning to wallet selection');
        setGamificationStep(1); // Back to wallet selection on failure
        
        toast({
          title: "Connection Failed",
          description: "Please try connecting again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in finalizeConnection:', error);
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      setGamificationStep(1); // Back to wallet selection on failure
      setConnectionAnimationProgress(0);
      
      toast({
        title: "Connection Error",
        description: "There was an error connecting your wallet. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
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
  
  const performSecurityCheck = () => {
    // Simulate security check
    toast({
      title: "Security Check",
      description: "Running wallet security validation...",
    });
    
    setTimeout(() => {
      setSecurityChecked(true);
      unlockAchievement('security_check');
      
      toast({
        title: "Security Check Complete",
        description: "Your wallet passed all security checks! +250 points",
      });
    }, 1500);
  };

  // Render chain selection step
  const renderChainSelection = () => {
    return (
      <div className="space-y-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <ChonkTokenLogo size={80} className="mx-auto mb-4" />
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
            Choose Your Blockchain
          </h2>
          <p className="text-gray-400 mt-2">
            Begin your CHONK9K journey by selecting a blockchain
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`p-6 rounded-xl border ${selectedChain === 'evm' ? 'border-[#ff00ff] bg-[#ff00ff]/10' : 'border-gray-800 bg-black/50 hover:border-[#ff00ff]/50'} transition-all`}
            onClick={() => {
              setSelectedChain('evm');
              setGamificationStep(1); // Proceed to wallet selection
            }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ff00ff]/20 flex items-center justify-center">
              <img src="/images/chains/base.svg" alt="Base" className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-center text-white mb-1">Base Chain</h3>
            <p className="text-xs text-center text-gray-400">EVM compatible with lower fees</p>
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`p-6 rounded-xl border ${selectedChain === 'solana' ? 'border-[#00e0ff] bg-[#00e0ff]/10' : 'border-gray-800 bg-black/50 hover:border-[#00e0ff]/50'} transition-all`}
            onClick={() => {
              setSelectedChain('solana');
              setGamificationStep(1); // Proceed to wallet selection
            }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00e0ff]/20 flex items-center justify-center">
              <img src="/images/chains/solana.svg" alt="Solana" className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-center text-white mb-1">Solana</h3>
            <p className="text-xs text-center text-gray-400">Fast transactions with low fees</p>
          </motion.button>
        </div>
        
        <div className="pt-4 text-center text-xs text-gray-500">
          <p>Both chains support CHONK9K token with full functionality</p>
        </div>
      </div>
    );
  };

  // Render wallet selection step
  const renderWalletSelection = () => {
    return (
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-2"
        >
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-700 text-gray-400"
            onClick={() => setGamificationStep(0)}
          >
            Back
          </Button>
          
          <Badge className={selectedChain === 'evm' ? 
            'bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff]/30' :
            'bg-[#00e0ff]/20 text-[#00e0ff] border border-[#00e0ff]/30'
          }>
            {selectedChain === 'evm' ? 'Base Chain' : 'Solana'}
          </Badge>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-4"
        >
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
            Choose Your Wallet
          </h2>
          <p className="text-gray-400 mt-1">
            Connect a wallet to earn CHONK9K rewards and track your progress
          </p>
        </motion.div>
        
        <div className="space-y-3">
          {walletOptions
            .filter(wallet => wallet.popular && wallet.chainSupport.includes(selectedChain))
            .map((wallet, index) => (
              <motion.button
                key={wallet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + (index * 0.1) }}
                className="flex items-center w-full p-3 rounded-lg bg-black/50 border border-gray-800 hover:border-[#ff00ff]/50 hover:bg-[#ff00ff]/5 transition-all text-left"
                onClick={() => handleWalletConnect(wallet)}
                disabled={isConnecting}
              >
                <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center p-1 border border-gray-800">
                  <div 
                    className="w-full h-full bg-center bg-no-repeat bg-contain" 
                    style={{ backgroundImage: `url(${wallet.logo})` }}
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
              </motion.button>
            ))
          }
        </div>
        
        <div className="py-2">
          <p className="text-xs text-center text-gray-500">
            <span className="text-[#ff00ff]">+100 points</span> for your first wallet connection!
          </p>
        </div>
      </div>
    );
  };

  // Render connection animation step
  const renderConnectionAnimation = () => {
    return (
      <div className="py-8 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 relative"
        >
          <div className="w-24 h-24 rounded-full border-4 border-[#ff00ff]/30 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#ff00ff] animate-spin" />
            <ChonkTokenLogo size={60} />
          </div>
          
          <motion.div 
            className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: connectionAnimationProgress > 80 ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Check className="h-10 w-10 text-[#00e0ff]" />
          </motion.div>
        </motion.div>
        
        <motion.h3 
          className="text-lg font-bold text-white mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Connecting Wallet
        </motion.h3>
        
        <motion.div 
          className="w-full max-w-xs mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Progress value={connectionAnimationProgress} className="h-2 bg-gray-800" />
          <p className="text-right text-xs text-gray-400 mt-1">{connectionAnimationProgress}%</p>
        </motion.div>
        
        <motion.div 
          className="text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {connectionAnimationProgress < 30 && "Initializing connection..."}
          {connectionAnimationProgress >= 30 && connectionAnimationProgress < 60 && "Verifying wallet..."}
          {connectionAnimationProgress >= 60 && connectionAnimationProgress < 90 && "Almost there..."}
          {connectionAnimationProgress >= 90 && "Connection successful!"}
        </motion.div>
      </div>
    );
  };

  // Render connection success animation
  const renderConnectionSuccess = () => {
    return (
      <div className="py-8 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ 
            duration: 0.5,
            scale: {
              type: "spring",
              damping: 5
            }
          }}
          className="mb-6 relative"
        >
          <div className="relative">
            <ChonkTokenLogo size={80} />
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -top-2 -right-2 bg-[#ff00ff] text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              <Check className="h-5 w-5" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center space-y-2"
        >
          <h3 className="text-xl font-bold text-white">Wallet Connected!</h3>
          <p className="text-gray-400 mb-4">You've successfully joined the CHONK9K community</p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="py-3 px-4 rounded-lg bg-[#ff00ff]/10 border border-[#ff00ff]/30 mb-4"
          >
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-[#ff00ff] mr-2" />
              <span className="text-white font-medium">Achievement Unlocked!</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">First Connection: +100 points</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button 
              className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white"
              onClick={() => setOpen(false)}
            >
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  };

  // Render wallet profile view
  const renderWalletProfile = () => {
    if (!account) return null;
    
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const achievementProgress = Math.round((unlockedAchievements.length / achievements.length) * 100);
    const nextLevel = levels.find(level => level.level > currentLevel.level) || currentLevel;
    const pointsToNextLevel = nextLevel.minPoints - totalPoints;
    
    return (
      <div className="space-y-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>
          <Badge 
            variant="outline" 
            className="ml-2 border-[#00e0ff]/30 text-[#00e0ff]"
          >
            {account.chainType === 'evm' ? 'Base' : 'Solana'}
          </Badge>
        </div>
        
        {/* Level and Points */}
        <div className="bg-black/50 rounded-lg p-4 border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <div 
                className="w-8 h-8 rounded-full mr-2 flex items-center justify-center"
                style={{ backgroundColor: `${currentLevel.color}30`, color: currentLevel.color }}
              >
                {currentLevel.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{currentLevel.title}</div>
                <div className="text-xs text-gray-400">Level {currentLevel.level}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                {totalPoints}
              </div>
              <div className="text-xs text-gray-400">points</div>
            </div>
          </div>
          
          {nextLevel.level > currentLevel.level && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Next Level: {nextLevel.title}</span>
                <span className="text-gray-400">{totalPoints}/{nextLevel.minPoints}</span>
              </div>
              <Progress 
                value={(totalPoints / nextLevel.minPoints) * 100} 
                className="h-1.5 bg-gray-800" 
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {pointsToNextLevel} points to next level
              </div>
            </div>
          )}
        </div>
        
        {/* Achievements */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-white">Achievements</h3>
            <Badge variant="outline" className="text-xs border-gray-700">
              {unlockedAchievements.length}/{achievements.length}
            </Badge>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {achievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`flex items-center p-3 rounded-lg ${achievement.unlocked ? 'bg-black/50 border border-gray-800' : 'bg-black/30 border border-gray-900 opacity-70'}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${achievement.unlocked ? 'bg-[#00e0ff]/20' : 'bg-gray-800'}`}
                >
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-white">{achievement.title}</div>
                    <div className="text-xs text-gray-400">+{achievement.points}</div>
                  </div>
                  <div className="text-xs text-gray-400">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Security Check */}
        {!securityChecked && (
          <Button 
            variant="outline" 
            className="w-full border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/10"
            onClick={performSecurityCheck}
          >
            <ShieldCheck className="mr-2 h-4 w-4" /> 
            Perform Wallet Security Check
          </Button>
        )}
        
        {/* Disconnect Button */}
        <Button 
          variant="outline" 
          className="w-full border-gray-800 text-gray-400 hover:bg-red-900/10 hover:text-red-400 hover:border-red-900/50"
          onClick={() => {
            disconnectWallet();
            setOpen(false);
          }}
        >
          <Power className="mr-2 h-4 w-4" /> Disconnect Wallet
        </Button>
      </div>
    );
  };

  return (
    <>
      {/* Achievement popup */}
      <AnimatePresence>
        {showAchievementPopup && recentAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed bottom-4 right-4 z-50 p-4 rounded-lg bg-black/90 border border-[#ff00ff]/50 shadow-lg shadow-[#ff00ff]/20 max-w-sm"
          >
            <div className="flex items-start">
              <div className="bg-[#ff00ff]/20 rounded-full p-2 mr-3">
                {recentAchievement.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">Achievement Unlocked!</h4>
                <p className="text-sm text-[#ff00ff]">{recentAchievement.title}</p>
                <p className="text-xs text-gray-400 mt-1">{recentAchievement.description}</p>
                <p className="text-xs text-gray-300 mt-2">+{recentAchievement.points} points</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
                      <div className="ml-2 flex items-center">
                        <div className="text-xs mr-1">Lv{currentLevel.level}</div>
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border border-[#ff00ff]/30 text-white min-w-[200px]">
                  <div className="px-2 pt-2 pb-1">
                    <div className="text-xs text-gray-400 mb-1">{currentLevel.title}</div>
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
                      <div className="text-xs text-gray-400 mt-1 flex items-center">
                        <span>{tokenBalance}</span>
                        <span className="mx-1">CHONK9K</span>
                        <Badge className="text-[8px] px-1 py-0 h-auto bg-[#ff00ff]/20 text-[#ff00ff] border-none">
                          {totalPoints} pts
                        </Badge>
                      </div>
                    )}
                  </div>
                  <DropdownMenuItem 
                    className="cursor-pointer text-gray-400 hover:text-white focus:text-white"
                    onClick={() => setOpen(true)}
                  >
                    Wallet & Achievements
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
            /* Wallet profile view */
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                  Wallet & Achievements
                </DialogTitle>
                <DialogDescription className="text-center text-gray-400">
                  Track your CHONK9K journey and achievements
                </DialogDescription>
              </DialogHeader>
              {renderWalletProfile()}
            </>
          ) : (
            /* Connection flow steps */
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                  {gamificationStep === 0 && "Start Your Journey"}
                  {gamificationStep === 1 && "Choose Your Wallet"}
                  {gamificationStep === 2 && "Connecting"}
                  {gamificationStep === 3 && "Welcome!"}
                </DialogTitle>
                {gamificationStep < 2 && (
                  <DialogDescription className="text-center text-gray-400">
                    Connect your wallet to earn rewards and track achievements
                  </DialogDescription>
                )}
              </DialogHeader>
              
              {gamificationStep === 0 && renderChainSelection()}
              {gamificationStep === 1 && renderWalletSelection()}
              {gamificationStep === 2 && renderConnectionAnimation()}
              {gamificationStep === 3 && renderConnectionSuccess()}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GamifiedWalletConnect;