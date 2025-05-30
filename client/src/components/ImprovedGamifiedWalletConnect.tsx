import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useChonkWallet } from '@/hooks/useChonkWallet';
import { CONTRACT_ADDRESSES } from '@shared/constants';
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, Check, Copy, Power, ChevronDown, Trophy, 
  Star, Sparkles, Rocket, Zap, ShieldCheck, Bolt,
  GanttChart, Flame, Wallet, Heart, MedalIcon, Medal
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from "framer-motion";
import ChonkTokenLogo from './ChonkTokenLogo';
import { useLocation } from 'wouter';

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
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  bonusPoints?: number;
}

const walletOptions: WalletOption[] = [
  { 
    id: 'metamask', 
    name: 'MetaMask', 
    logo: '/images/wallets/metamask.svg', 
    type: 'wallet', 
    chainSupport: ['evm'],
    description: 'Connect to your MetaMask wallet',
    popular: true,
    rarity: 'common',
    bonusPoints: 100
  },
  { 
    id: 'coinbase', 
    name: 'Coinbase', 
    logo: '/images/wallets/coinbase.svg', 
    type: 'wallet', 
    chainSupport: ['evm', 'solana'],
    description: 'Connect to Coinbase Wallet',
    popular: true,
    rarity: 'uncommon',
    bonusPoints: 150
  },
  { 
    id: 'phantom', 
    name: 'Phantom', 
    logo: '/images/wallets/phantom.svg', 
    type: 'wallet', 
    chainSupport: ['solana', 'evm'],
    description: 'Connect to your Phantom wallet',
    popular: true,
    rarity: 'uncommon',
    bonusPoints: 150
  },
  { 
    id: 'warpcast', 
    name: 'Warpcast', 
    logo: '/images/wallets/warpcast.svg', 
    type: 'wallet', 
    chainSupport: ['evm'],
    description: 'Connect with Farcaster',
    popular: true,
    rarity: 'rare',
    bonusPoints: 200
  },
  { 
    id: 'rainbow', 
    name: 'Rainbow', 
    logo: '/images/wallets/rainbow.svg', 
    type: 'wallet', 
    chainSupport: ['evm'],
    description: 'Beautiful, simple Ethereum wallet',
    popular: true,
    rarity: 'rare',
    bonusPoints: 200
  },
  { 
    id: 'frame', 
    name: 'Frame', 
    logo: '/images/wallets/frame.svg', 
    type: 'wallet', 
    chainSupport: ['evm'],
    description: 'Privacy-focused desktop wallet',
    rarity: 'rare',
    bonusPoints: 200
  },
  { 
    id: 'solflare', 
    name: 'Solflare', 
    logo: '/images/wallets/solflare.svg', 
    type: 'wallet', 
    chainSupport: ['solana'],
    description: "Solana's non-custodial wallet",
    rarity: 'uncommon',
    bonusPoints: 150
  },
  { 
    id: 'bitverse', 
    name: 'Bitverse', 
    logo: '/images/wallets/bitverse.svg', 
    type: 'wallet', 
    chainSupport: ['evm', 'solana'],
    description: 'Multi-chain Crypto Wallet',
    popular: true,
    rarity: 'legendary',
    bonusPoints: 250
  },
  { 
    id: 'okx', 
    name: 'OKX', 
    logo: '/images/wallets/okx.svg', 
    type: 'wallet', 
    chainSupport: ['evm', 'solana'],
    description: 'OKX multi-chain wallet',
    rarity: 'uncommon',
    bonusPoints: 150
  },
  { 
    id: 'jupiter', 
    name: 'Jupiter', 
    logo: '/images/wallets/jupiter.svg', 
    type: 'aggregator', 
    chainSupport: ['solana'],
    description: "Solana's liquidity aggregator",
    popular: true,
    rarity: 'legendary',
    bonusPoints: 250
  },
  { 
    id: 'raydium', 
    name: 'Raydium', 
    logo: '/images/wallets/raydium.svg', 
    type: 'aggregator', 
    chainSupport: ['solana'],
    description: 'AMM and liquidity provider on Solana',
    rarity: 'rare',
    bonusPoints: 200
  },
  { 
    id: 'orca', 
    name: 'Orca', 
    logo: '/images/wallets/orca.svg', 
    type: 'aggregator', 
    chainSupport: ['solana'],
    description: 'Trade on Solana with low fees',
    rarity: 'rare',
    bonusPoints: 200
  },
  { 
    id: 'wen', 
    name: 'Wen', 
    logo: '/images/wallets/wen.svg', 
    type: 'aggregator', 
    chainSupport: ['solana'],
    description: 'Consumer crypto wallet by Drift Protocol',
    rarity: 'legendary',
    bonusPoints: 250
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
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

interface Level {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: React.ReactNode;
  bonusDescription?: string;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number; // 0-100
  reward: number; // points
  completed: boolean;
  totalSteps: number;
  currentStep: number;
}

const getInitialAchievements = (): Achievement[] => [
  {
    id: 'first_connect',
    title: 'First Connection',
    description: 'Connected a wallet for the first time',
    icon: <Zap className="h-4 w-4 text-yellow-400" />,
    unlocked: false,
    points: 100,
    rarity: 'common'
  },
  {
    id: 'multi_chain',
    title: 'Multi-Chain Explorer',
    description: 'Connected to both EVM and Solana chains',
    icon: <Rocket className="h-4 w-4 text-purple-400" />,
    unlocked: false,
    points: 200,
    rarity: 'uncommon'
  },
  {
    id: 'token_balance',
    title: 'CHONK9K Holder',
    description: 'Held CHONK9K tokens in your wallet',
    icon: <Trophy className="h-4 w-4 text-amber-400" />,
    unlocked: false,
    points: 300,
    rarity: 'uncommon'
  },
  {
    id: 'connection_streak',
    title: 'Connection Streak',
    description: 'Connected wallet for 3 consecutive days',
    icon: <Sparkles className="h-4 w-4 text-blue-400" />,
    unlocked: false,
    points: 500,
    rarity: 'rare'
  },
  {
    id: 'security_check',
    title: 'Security Guardian',
    description: 'Completed wallet security check',
    icon: <ShieldCheck className="h-4 w-4 text-green-400" />,
    unlocked: false,
    points: 250,
    rarity: 'uncommon'
  },
  {
    id: 'rare_wallet',
    title: 'Rare Wallet Explorer',
    description: 'Connected using a rare wallet type',
    icon: <Flame className="h-4 w-4 text-orange-400" />,
    unlocked: false,
    points: 350,
    rarity: 'rare'
  },
  {
    id: 'legendary_wallet',
    title: 'Legendary Connection',
    description: 'Connected using a legendary wallet',
    icon: <Medal className="h-4 w-4 text-amber-500" />,
    unlocked: false,
    points: 500,
    rarity: 'legendary'
  }
];

const getInitialQuests = (): Quest[] => [
  {
    id: 'daily_connect',
    title: 'Daily Connection',
    description: 'Connect your wallet for 5 consecutive days',
    icon: <Flame className="h-4 w-4 text-orange-400" />,
    progress: 20, // 1 of 5 days = 20%
    reward: 250,
    completed: false,
    totalSteps: 5,
    currentStep: 1
  },
  {
    id: 'multiple_chains',
    title: 'Chain Explorer',
    description: 'Connect to 2 different blockchain networks',
    icon: <GanttChart className="h-4 w-4 text-blue-400" />,
    progress: 50, // 1 of 2 chains = 50%
    reward: 200,
    completed: false,
    totalSteps: 2,
    currentStep: 1
  },
  {
    id: 'token_mission',
    title: 'CHONK9K Collector',
    description: 'Collect 1000 CHONK9K tokens',
    icon: <Wallet className="h-4 w-4 text-pink-400" />,
    progress: 0, 
    reward: 400,
    completed: false,
    totalSteps: 1000,
    currentStep: 0
  }
];

const levels: Level[] = [
  {
    level: 1,
    title: 'Novice Chonker',
    minPoints: 0,
    maxPoints: 299,
    color: '#ff00ff',
    icon: <Star className="h-4 w-4" />,
    bonusDescription: 'No bonuses yet'
  },
  {
    level: 2,
    title: 'Advanced Chonker',
    minPoints: 300,
    maxPoints: 799,
    color: '#00e0ff',
    icon: <Star className="h-4 w-4" />,
    bonusDescription: '+5% CHONK9K rewards'
  },
  {
    level: 3,
    title: 'Pro Chonker',
    minPoints: 800,
    maxPoints: 1499,
    color: '#ffcc00',
    icon: <Star className="h-4 w-4" />,
    bonusDescription: '+10% CHONK9K rewards, special profile badge'
  },
  {
    level: 4,
    title: 'Master Chonker',
    minPoints: 1500,
    maxPoints: 2999,
    color: '#ff3366',
    icon: <Trophy className="h-4 w-4" />,
    bonusDescription: '+15% CHONK9K rewards, exclusive NFT access'
  },
  {
    level: 5,
    title: 'Legendary Chonker',
    minPoints: 3000,
    maxPoints: Infinity,
    color: '#ff9500',
    icon: <Medal className="h-4 w-4" />,
    bonusDescription: '+25% CHONK9K rewards, VIP access to all features'
  }
];

interface ImprovedGamifiedWalletConnectProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const ImprovedGamifiedWalletConnect: React.FC<ImprovedGamifiedWalletConnectProps> = ({ 
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const { connectWallet, account, isConnecting, disconnectWallet, walletIcon, getTokenBalance } = useChonkWallet();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [selectedChain, setSelectedChain] = useState<ChainType>('evm');
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>(getInitialAchievements());
  const [quests, setQuests] = useState<Quest[]>(getInitialQuests());
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);
  const [gamificationStep, setGamificationStep] = useState(0); // 0: chain select, 1: wallet select, 2: connecting animation, 3: success
  const [connectionAnimationProgress, setConnectionAnimationProgress] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [securityChecked, setSecurityChecked] = useState(false);
  const [selectedTab, setSelectedTab] = useState('achievements'); // 'achievements', 'quests', 'profile'
  const [dailyRewardAvailable, setDailyRewardAvailable] = useState(false);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);
  const [walletSelection, setWalletSelection] = useState<WalletOption | null>(null);
  
  // Animation ref
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved state from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem('chonk9k_achievements');
    const savedPoints = localStorage.getItem('chonk9k_points');
    const savedQuests = localStorage.getItem('chonk9k_quests');
    const lastDailyReward = localStorage.getItem('chonk9k_last_daily_reward');
    
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

    if (savedQuests) {
      try {
        setQuests(JSON.parse(savedQuests));
      } catch (e) {
        console.error('Error parsing saved quests:', e);
      }
    }

    // Check if daily reward is available
    const today = new Date().toISOString().split('T')[0];
    if (lastDailyReward !== today && account) {
      setDailyRewardAvailable(true);
    }
  }, [account]);

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
      updateQuestProgress();
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
      
      // Update token quest progress
      const tokenAmount = parseInt(balance, 10);
      updateTokenQuest(tokenAmount);
      
      // Check if user has tokens and unlock achievement if needed
      if (tokenAmount > 0) {
        unlockAchievement('token_balance');
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const updateTokenQuest = (tokenAmount: number) => {
    const updatedQuests = quests.map(quest => {
      if (quest.id === 'token_mission') {
        const progress = Math.min(100, (tokenAmount / quest.totalSteps) * 100);
        const currentStep = Math.min(quest.totalSteps, tokenAmount);
        const completed = currentStep >= quest.totalSteps;
        
        // If newly completed, award points
        if (completed && !quest.completed) {
          setTotalPoints(prev => prev + quest.reward);
          toast({
            title: "Quest Completed!",
            description: `${quest.title}: +${quest.reward} points`,
          });
        }
        
        return {
          ...quest,
          progress,
          currentStep,
          completed
        };
      }
      return quest;
    });
    
    setQuests(updatedQuests);
    localStorage.setItem('chonk9k_quests', JSON.stringify(updatedQuests));
  };

  const updateQuestProgress = () => {
    // Update the connection streak and chain explorer quests
    const evm = localStorage.getItem('chonk9k_evm_connected') === 'true';
    const solana = localStorage.getItem('chonk9k_solana_connected') === 'true';
    const chainCount = (evm ? 1 : 0) + (solana ? 1 : 0);
    
    const updatedQuests = quests.map(quest => {
      if (quest.id === 'multiple_chains') {
        const progress = Math.min(100, (chainCount / quest.totalSteps) * 100);
        const completed = chainCount >= quest.totalSteps;
        
        // If newly completed, award points
        if (completed && !quest.completed) {
          setTotalPoints(prev => prev + quest.reward);
          toast({
            title: "Quest Completed!",
            description: `${quest.title}: +${quest.reward} points`,
          });
        }
        
        return {
          ...quest,
          progress,
          currentStep: chainCount,
          completed
        };
      }
      
      if (quest.id === 'daily_connect') {
        const streakCount = parseInt(localStorage.getItem('chonk9k_connection_streak') || '0', 10);
        const progress = Math.min(100, (streakCount / quest.totalSteps) * 100);
        const completed = streakCount >= quest.totalSteps;
        
        // If newly completed, award points
        if (completed && !quest.completed) {
          setTotalPoints(prev => prev + quest.reward);
          toast({
            title: "Quest Completed!",
            description: `${quest.title}: +${quest.reward} points`,
          });
        }
        
        return {
          ...quest,
          progress,
          currentStep: streakCount,
          completed
        };
      }
      
      return quest;
    });
    
    setQuests(updatedQuests);
    localStorage.setItem('chonk9k_quests', JSON.stringify(updatedQuests));
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
    
    // Show toast notification
    toast({
      title: "Achievement Unlocked!",
      description: `${achievement.title}: +${achievement.points} points`,
    });
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
      
      // Set daily reward as available
      setDailyRewardAvailable(true);
    }
    
    // Check if wallet is rare or legendary and unlock achievements
    if (walletSelection?.rarity === 'rare') {
      unlockAchievement('rare_wallet');
    } else if (walletSelection?.rarity === 'legendary') {
      unlockAchievement('legendary_wallet');
    }
  };

  const claimDailyReward = () => {
    const rewardPoints = 100 + (currentLevel.level * 20); // Base points + level bonus
    setTotalPoints(prev => prev + rewardPoints);
    
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('chonk9k_last_daily_reward', today);
    
    setDailyRewardAvailable(false);
    setDailyRewardClaimed(true);
    
    toast({
      title: "Daily Reward Claimed!",
      description: `You received +${rewardPoints} points.`,
    });
    
    // Reset after animation
    setTimeout(() => {
      setDailyRewardClaimed(false);
    }, 3000);
  };

  const handleWalletConnect = async (wallet: WalletOption) => {
    setWalletSelection(wallet);
    setGamificationStep(2); // Start connection animation
    
    // Simulate connection animation
    setConnectionAnimationProgress(0);
    let progress = 0;
    const animationInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 7) + 3; // 3-10% increments for more realistic feel
      setConnectionAnimationProgress(Math.min(100, progress));
      
      if (progress >= 100) {
        clearInterval(animationInterval);
        finalizeConnection(wallet);
      }
    }, 150);
    
    // Clean up interval in case component unmounts
    animationTimeoutRef.current = setTimeout(() => {
      clearInterval(animationInterval);
    }, 4000);
  };
  
  const finalizeConnection = async (wallet: WalletOption) => {
    try {
      // Actual wallet connection
      const success = await connectWallet(wallet.id, selectedChain);
      
      if (success) {
        setGamificationStep(3); // Success animation
        
        // Add bonus points based on wallet rarity
        if (wallet.bonusPoints) {
          setTimeout(() => {
            setTotalPoints(prev => prev + wallet.bonusPoints!);
            toast({
              title: "Wallet Bonus!",
              description: `${wallet.name} Connection: +${wallet.bonusPoints} points`,
            });
          }, 1500);
        }
        
        setTimeout(() => {
          setWalletConnected(true);
          setOpen(false);
        }, 2500);
      } else {
        setGamificationStep(1); // Back to wallet selection on failure
        
        toast({
          title: "Connection Failed",
          description: "Please try connecting again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in finalizeConnection:', error);
      setGamificationStep(1); // Back to wallet selection on failure
      setConnectionAnimationProgress(0);
      
      toast({
        title: "Connection Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSecurityCheck = () => {
    setSecurityChecked(true);
    unlockAchievement('security_check');
    
    toast({
      title: "Security Check Complete",
      description: "Your wallet security level is optimal!",
    });
  };

  // Color mapping for different achievement rarities
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-300';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'legendary': return 'text-amber-400';
      default: return 'text-gray-300';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-600';
      case 'uncommon': return 'border-green-600';
      case 'rare': return 'border-blue-600';
      case 'legendary': return 'border-amber-500';
      default: return 'border-gray-600';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-800/50';
      case 'uncommon': return 'bg-green-900/20';
      case 'rare': return 'bg-blue-900/20';
      case 'legendary': return 'bg-amber-900/20';
      default: return 'bg-gray-800/50';
    }
  };

  // Render the connected wallet details tab
  const renderWalletProfile = () => {
    if (!account) return null;
    
    // Calculate level progress percentage
    const levelProgress = currentLevel.maxPoints !== Infinity 
      ? ((totalPoints - currentLevel.minPoints) / (currentLevel.maxPoints - currentLevel.minPoints)) * 100
      : 100;
    
    // Calculate points needed for next level
    const nextLevel = levels.find(level => level.level === currentLevel.level + 1);
    const pointsForNextLevel = nextLevel ? nextLevel.minPoints - totalPoints : 0;
    
    return (
      <div className="p-5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {walletIcon && (
              <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center p-1 border border-gray-800 mr-4">
                <div 
                  className="w-full h-full bg-center bg-no-repeat bg-contain" 
                  style={{ backgroundImage: `url(${walletIcon})` }}
                />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-white">
                {account.walletType.charAt(0).toUpperCase() + account.walletType.slice(1)}
              </h3>
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <span>{account.address.substring(0, 6)}...{account.address.substring(account.address.length - 4)}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(account.address)}
                  className="p-1 hover:text-[#ff00ff] transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
          
          <Badge variant="outline" className="border-[#00e0ff]/30 text-[#00e0ff]">
            {account.chainType === 'evm' ? 'Base' : 'Solana'}
          </Badge>
        </div>
        
        {/* Level info */}
        <div className="bg-black/30 border border-gray-800 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: currentLevel.color }}>
                {currentLevel.icon}
              </div>
              <div>
                <h4 className="font-bold text-white">{currentLevel.title}</h4>
                <div className="text-xs text-gray-400">Level {currentLevel.level}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-[#ff00ff]">{totalPoints}</div>
              <div className="text-xs text-gray-400">points</div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="space-y-1">
            <Progress value={levelProgress} className="h-2 bg-gray-800" />
            {nextLevel && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">{currentLevel.minPoints}</span>
                <span className="text-gray-400">{pointsForNextLevel} points to level {currentLevel.level + 1}</span>
                <span className="text-gray-500">{currentLevel.maxPoints}</span>
              </div>
            )}
          </div>
          
          {currentLevel.bonusDescription && (
            <div className="flex items-center mt-2 text-sm">
              <Bolt className="h-4 w-4 text-[#00e0ff] mr-2" />
              <span className="text-[#00e0ff]">{currentLevel.bonusDescription}</span>
            </div>
          )}
        </div>
        
        {/* Token info */}
        <div className="bg-black/30 border border-gray-800 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">$CHONK9K Balance</span>
            <div className="flex items-center">
              {isLoadingBalance ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#ff00ff]" />
              ) : (
                <span className="font-bold text-lg text-white">{tokenBalance || '0'}</span>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Contract</span>
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-gray-300">
                {account.chainType === 'evm' 
                  ? CONTRACT_ADDRESSES.BASE.CHONK9K.substring(0, 6) + '...' + CONTRACT_ADDRESSES.BASE.CHONK9K.substring(CONTRACT_ADDRESSES.BASE.CHONK9K.length - 4)
                  : CONTRACT_ADDRESSES.SOLANA.CHONK9K.substring(0, 6) + '...' + CONTRACT_ADDRESSES.SOLANA.CHONK9K.substring(CONTRACT_ADDRESSES.SOLANA.CHONK9K.length - 4)
                }
              </span>
              <button 
                onClick={() => navigator.clipboard.writeText(account.chainType === 'evm' ? CONTRACT_ADDRESSES.BASE.CHONK9K : CONTRACT_ADDRESSES.SOLANA.CHONK9K)}
                className="p-1 hover:text-[#ff00ff] transition-colors"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Daily Reward */}
        {dailyRewardAvailable && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#ff00ff]/20 border border-[#ff00ff]/30 rounded-lg p-4 space-y-2"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#ff00ff]/30 flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-[#ff00ff]" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Daily Reward Available!</h4>
                  <div className="text-xs text-gray-300">Claim your bonus points</div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-[#ff00ff] hover:bg-[#ff00ff]/80 text-white"
                onClick={claimDailyReward}
              >
                Claim
              </Button>
            </div>
          </motion.div>
        )}
        
        {/* Security Check */}
        {!securityChecked && (
          <div className="bg-[#00e0ff]/10 border border-[#00e0ff]/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#00e0ff]/20 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-[#00e0ff]" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Security Check</h4>
                  <div className="text-xs text-gray-300">Verify your wallet security</div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-[#00e0ff] hover:bg-[#00e0ff]/80 text-white"
                onClick={handleSecurityCheck}
              >
                Check
              </Button>
            </div>
          </div>
        )}
        
        {/* Control buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            variant="outline" 
            className="border-gray-700 hover:border-red-500 hover:text-red-400 transition-colors"
            onClick={disconnectWallet}
          >
            <Power className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
          
          <Button 
            className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90"
            onClick={() => navigate('/profile/1')}
          >
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Button>
        </div>
      </div>
    );
  };

  // Render the achievements tab
  const renderAchievements = () => {
    // Count unlocked achievements
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;
    const completionPercentage = Math.round((unlockedCount / totalCount) * 100);
    
    return (
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-white">Achievements</h3>
          <Badge className="bg-[#ff00ff]/20 text-[#ff00ff] border-[#ff00ff]/30">
            {unlockedCount}/{totalCount}
          </Badge>
        </div>
        
        <div className="space-y-1 mb-3">
          <Progress value={completionPercentage} className="h-2 bg-gray-800" />
          <div className="text-right text-xs text-gray-400">{completionPercentage}% Complete</div>
        </div>
        
        <div className="space-y-3">
          {achievements.map(achievement => {
            const isUnlocked = achievement.unlocked;
            return (
              <div 
                key={achievement.id}
                className={`p-3 rounded-lg border ${isUnlocked ? getRarityBorder(achievement.rarity) : 'border-gray-800'} ${isUnlocked ? getRarityBg(achievement.rarity) : 'bg-black/30'} transition-all`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isUnlocked ? 'bg-black/40' : 'bg-black/60'} mr-3`}>
                    {isUnlocked ? (
                      achievement.icon
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{achievement.title}</h4>
                      <span className={`text-sm font-medium ${isUnlocked ? getRarityColor(achievement.rarity) : 'text-gray-600'}`}>
                        {isUnlocked ? `+${achievement.points}` : 'Locked'}
                      </span>
                    </div>
                    <p className={`text-xs ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>{achievement.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render the quests tab
  const renderQuests = () => {
    // Count completed quests
    const completedCount = quests.filter(q => q.completed).length;
    const totalCount = quests.length;
    
    return (
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-white">Quests</h3>
          <Badge className="bg-[#00e0ff]/20 text-[#00e0ff] border-[#00e0ff]/30">
            {completedCount}/{totalCount}
          </Badge>
        </div>
        
        <div className="space-y-4">
          {quests.map(quest => (
            <div 
              key={quest.id}
              className={`p-4 rounded-lg border ${quest.completed ? 'border-[#00e0ff]/50 bg-[#00e0ff]/10' : 'border-gray-800 bg-black/30'}`}
            >
              <div className="flex items-center mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${quest.completed ? 'bg-[#00e0ff]/20' : 'bg-black/50'} mr-3`}>
                  {quest.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-bold text-white">{quest.title}</h4>
                    <span className="text-sm font-medium text-[#00e0ff]">
                      +{quest.reward}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{quest.description}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{quest.currentStep} / {quest.totalSteps} {quest.completed && '✓'}</span>
                  <span>{quest.progress}%</span>
                </div>
                <Progress value={quest.progress} className={`h-2 ${quest.completed ? 'bg-[#00e0ff]/30' : 'bg-gray-800'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render the blockchain selection step
  const renderChainSelection = () => (
    <div className="p-5 space-y-6">
      <div className="text-center mb-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#00e0ff] p-0.5"
        >
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
            <Trophy className="w-10 h-10 text-[#ff00ff]" />
          </div>
        </motion.div>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]"
        >
          Begin Your CHONK9K Adventure
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-gray-400 mt-2"
        >
          Choose your preferred blockchain to start
        </motion.p>
      </div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="grid grid-cols-2 gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`p-5 rounded-xl border ${selectedChain === 'evm' ? 'border-[#ff00ff] bg-[#ff00ff]/10' : 'border-gray-800 bg-black/50'} transition-all`}
          onClick={() => {
            setSelectedChain('evm');
            setGamificationStep(1); // Move to wallet selection
          }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ff00ff]/20 flex items-center justify-center">
            <img src="/images/chains/base.svg" alt="Base" className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-center text-white">Base Chain</h3>
          <p className="text-sm text-center text-gray-400">Fast EVM-compatible Layer 2</p>
          <div className="mt-3 text-xs text-center text-[#ff00ff]">
            +100 connection points
          </div>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`p-5 rounded-xl border ${selectedChain === 'solana' ? 'border-[#00e0ff] bg-[#00e0ff]/10' : 'border-gray-800 bg-black/50'} transition-all`}
          onClick={() => {
            setSelectedChain('solana');
            setGamificationStep(1); // Move to wallet selection
          }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00e0ff]/20 flex items-center justify-center">
            <img src="/images/chains/solana.svg" alt="Solana" className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-center text-white">Solana</h3>
          <p className="text-sm text-center text-gray-400">High-speed transactions</p>
          <div className="mt-3 text-xs text-center text-[#00e0ff]">
            +100 connection points
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
  
  // Render the wallet selection step
  const renderWalletSelection = () => {
    // Filter wallets by selected chain and sort by rarity (legendary first)
    const rarityOrder = { 'legendary': 0, 'rare': 1, 'uncommon': 2, 'common': 3 };
    const filteredWallets = walletOptions
      .filter(wallet => wallet.chainSupport.includes(selectedChain))
      .sort((a, b) => {
        // Sort by popularity first, then by rarity
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return (rarityOrder[a.rarity || 'common'] - rarityOrder[b.rarity || 'common']);
      });
    
    return (
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between mb-3">
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-700 text-gray-400"
            onClick={() => setGamificationStep(0)}
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
        
        <motion.h2 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]"
        >
          Choose Your Wallet
        </motion.h2>
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 mb-3"
        >
          Each wallet grants different bonuses and rewards
        </motion.p>
        
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
          {filteredWallets.map((wallet, index) => (
            <motion.button
              key={wallet.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + (index * 0.05) }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center w-full p-3 rounded-lg ${getRarityBg(wallet.rarity || 'common')} border ${getRarityBorder(wallet.rarity || 'common')} hover:border-[#ff00ff]/50 transition-all text-left`}
              onClick={() => handleWalletConnect(wallet)}
              disabled={isConnecting}
            >
              <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center p-1 border border-gray-700">
                <div 
                  className="w-full h-full bg-center bg-no-repeat bg-contain" 
                  style={{ backgroundImage: `url(${wallet.logo})` }}
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">{wallet.name}</span>
                  {wallet.rarity && (
                    <Badge className={`${getRarityBg(wallet.rarity)} ${getRarityColor(wallet.rarity)} border-none text-xs`}>
                      {wallet.rarity.charAt(0).toUpperCase() + wallet.rarity.slice(1)}
                    </Badge>
                  )}
                </div>
                {wallet.description && (
                  <p className="text-xs text-gray-400">{wallet.description}</p>
                )}
                {wallet.bonusPoints && (
                  <p className="text-xs text-[#ff00ff] mt-1">+{wallet.bonusPoints} points</p>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };
  
  // Render the connecting animation
  const renderConnecting = () => (
    <div className="p-8 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-24 h-24 mb-8"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#ff00ff]/20 to-[#00e0ff]/20 border border-gray-800 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#ff00ff] border-r-[#00e0ff] animate-spin" />
          {walletSelection?.logo && (
            <div 
              className="w-12 h-12 bg-center bg-no-repeat bg-contain" 
              style={{ backgroundImage: `url(${walletSelection.logo})` }}
            />
          )}
        </div>
        
        {/* Success checkmark animation */}
        {connectionAnimationProgress > 90 && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-0 right-0 transform translate-x-1/4 translate-y-1/4 w-10 h-10 rounded-full bg-[#00e0ff] flex items-center justify-center"
          >
            <Check className="h-6 w-6 text-black" />
          </motion.div>
        )}
      </motion.div>
      
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-bold text-white mb-6"
      >
        Connecting to {walletSelection?.name}
      </motion.h3>
      
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        className="w-full max-w-xs mb-4"
      >
        <Progress value={connectionAnimationProgress} className="h-3 bg-gray-800" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Initializing...</span>
          <span>{connectionAnimationProgress}%</span>
        </div>
      </motion.div>
      
      <div className="text-center text-sm text-gray-400 h-6">
        {connectionAnimationProgress < 30 && "Initializing connection..."}
        {connectionAnimationProgress >= 30 && connectionAnimationProgress < 60 && "Verifying wallet..."}
        {connectionAnimationProgress >= 60 && connectionAnimationProgress < 90 && "Setting up secure channel..."}
        {connectionAnimationProgress >= 90 && "Connection successful!"}
      </div>
    </div>
  );
  
  // Render the success animation
  const renderSuccess = () => (
    <div className="p-8 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 10, 0] }}
        transition={{ duration: 0.8 }}
        className="mb-6 relative"
      >
        {/* Animated particle effects */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 0,
                scale: 0
              }}
              animate={{ 
                x: Math.random() * 60 - 30, 
                y: Math.random() * 60 - 30,
                opacity: [0, 1, 0],
                scale: [0, 0.6, 0]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: Math.random() * 2
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: i % 2 === 0 ? '#ff00ff' : '#00e0ff',
                boxShadow: i % 2 === 0 ? '0 0 15px #ff00ff' : '0 0 15px #00e0ff'
              }}
            />
          ))}
        </div>
        
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff00ff]/30 to-[#00e0ff]/30 flex items-center justify-center z-10 relative">
          <Trophy className="h-12 w-12 text-[#ff00ff]" />
        </div>
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-2 -right-2 bg-[#00e0ff] rounded-full w-10 h-10 flex items-center justify-center border-2 border-black"
        >
          <Check className="h-6 w-6 text-black" />
        </motion.div>
      </motion.div>
      
      <motion.h3 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl font-bold text-white mb-3"
      >
        Success!
      </motion.h3>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-gray-400 mb-6 text-center"
      >
        Your wallet is now connected to CHONK 9000
      </motion.p>
      
      {walletSelection?.bonusPoints && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="py-3 px-4 rounded-lg bg-[#ff00ff]/10 border border-[#ff00ff]/30 mb-6 w-full max-w-xs"
        >
          <div className="flex items-center">
            <Trophy className="h-5 w-5 text-[#ff00ff] mr-2" />
            <span className="text-white font-medium">Wallet Bonus Unlocked!</span>
          </div>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <div className="text-gray-400 text-sm">Connection Bonus</div>
            <div className="text-sm text-[#ff00ff] text-right font-medium">+{walletSelection.bonusPoints} pts</div>
          </div>
          {walletSelection.rarity === 'legendary' && (
            <div className="mt-2 text-xs text-[#ffcc00]">
              <Sparkles className="h-3 w-3 inline mr-1" />
              Legendary wallet connected!
            </div>
          )}
        </motion.div>
      )}
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90 transition-opacity px-8 py-6 text-lg"
          onClick={() => {
            setOpen(false);
            // Ensure achievements are processed
            if (walletSelection?.rarity === 'rare') {
              unlockAchievement('rare_wallet');
            } else if (walletSelection?.rarity === 'legendary') {
              unlockAchievement('legendary_wallet');
            }
          }}
        >
          Continue to App
        </Button>
      </motion.div>
    </div>
  );

  return (
    <>
      {/* Achievement popup notification */}
      <AnimatePresence>
        {showAchievementPopup && recentAchievement && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/90 backdrop-blur-xl border border-[#ff00ff]/50 rounded-lg p-3 shadow-lg shadow-[#ff00ff]/20 w-80"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-[#ff00ff]/20 flex items-center justify-center mr-3">
                {recentAchievement.icon}
              </div>
              <div>
                <h4 className="text-white font-bold">Achievement Unlocked!</h4>
                <p className="text-sm text-gray-300">{recentAchievement.title}</p>
                <p className="text-xs text-[#ff00ff]">+{recentAchievement.points} points</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Daily reward animation */}
      <AnimatePresence>
        {dailyRewardClaimed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#00e0ff] flex items-center justify-center">
                <Trophy className="h-16 w-16 text-white" />
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xl"
              >
                +{100 + (currentLevel.level * 20)} POINTS!
              </motion.div>
            </motion.div>
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
                        <div className="flex items-center text-xs font-medium">
                          <div 
                            className="w-3 h-3 rounded-full mr-1" 
                            style={{ backgroundColor: currentLevel.color }}
                          />
                          Lv{currentLevel.level}
                        </div>
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border border-[#ff00ff]/30 text-white min-w-[250px]">
                  <div className="px-3 pt-3 pb-2">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-400 mb-1">Connected via {account.walletType}</div>
                      <Badge variant="outline" className="text-xs text-[#00e0ff] border-[#00e0ff]/30">
                        {account.chainType === 'evm' ? 'Base' : 'Solana'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <span>{account.address.substring(0, 6)}...{account.address.substring(account.address.length - 4)}</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(account.address)}
                        className="p-1 hover:text-[#ff00ff] transition-colors"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                    {tokenBalance && (
                      <div className="text-xs mt-1 flex justify-between items-center">
                        <span className="text-gray-400">$CHONK9K Balance:</span>
                        <span className="text-white font-medium">{tokenBalance}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-3 py-2 border-t border-gray-800">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-1 flex items-center justify-center" 
                          style={{ backgroundColor: currentLevel.color }}
                        >
                          {currentLevel.icon}
                        </div>
                        <span className="text-sm">{currentLevel.title}</span>
                      </div>
                      <span className="text-xs text-[#ff00ff] font-medium">{totalPoints} pts</span>
                    </div>
                    <Progress 
                      value={currentLevel.maxPoints !== Infinity 
                        ? ((totalPoints - currentLevel.minPoints) / (currentLevel.maxPoints - currentLevel.minPoints)) * 100
                        : 100
                      } 
                      className="h-1 bg-gray-800" 
                    />
                  </div>
                  
                  {dailyRewardAvailable && (
                    <DropdownMenuItem 
                      className="flex items-center cursor-pointer text-[#ffcc00] hover:text-[#ffcc00] focus:text-[#ffcc00] mt-1"
                      onClick={claimDailyReward}
                    >
                      <Trophy className="mr-2 h-4 w-4" />
                      Claim Daily Reward
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem 
                    className="cursor-pointer text-gray-400 hover:text-white focus:text-white"
                    onClick={() => {
                      setSelectedTab('achievements');
                      setOpen(true);
                    }}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Achievements
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className="cursor-pointer text-gray-400 hover:text-white focus:text-white"
                    onClick={() => {
                      setSelectedTab('quests');
                      setOpen(true);
                    }}
                  >
                    <Flame className="mr-2 h-4 w-4" />
                    Quests
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className="cursor-pointer text-gray-400 hover:text-white focus:text-white"
                    onClick={() => {
                      setSelectedTab('profile');
                      setOpen(true);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Wallet Profile
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className="cursor-pointer text-gray-400 hover:text-red-400 focus:text-red-400"
                    onClick={disconnectWallet}
                  >
                    <Power className="mr-2 h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Notification indicator */}
              {dailyRewardAvailable && (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ff00ff] animate-pulse" />
              )}
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
            /* Connected state with tabs */
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                  CHONK9K Wallet Hub
                </DialogTitle>
                <DialogDescription className="text-center text-gray-400">
                  Manage your wallet and track achievements
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-[#ff00ff]/20">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-[#ff00ff] text-sm">
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="data-[state=active]:bg-[#00e0ff]/20 data-[state=active]:text-[#00e0ff] text-sm">
                    Achievements
                  </TabsTrigger>
                  <TabsTrigger value="quests" className="data-[state=active]:bg-[#ffcc00]/20 data-[state=active]:text-[#ffcc00] text-sm">
                    Quests
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">{renderWalletProfile()}</TabsContent>
                <TabsContent value="achievements">{renderAchievements()}</TabsContent>
                <TabsContent value="quests">{renderQuests()}</TabsContent>
              </Tabs>
            </>
          ) : (
            /* Wallet connection flow */
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                  {gamificationStep === 0 && "Start Your Adventure"}
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
              {gamificationStep === 2 && renderConnecting()}
              {gamificationStep === 3 && renderSuccess()}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImprovedGamifiedWalletConnect;

// Missing components: User icon needed
const User = ({ className }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
};