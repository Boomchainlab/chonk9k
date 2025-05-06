import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DailyTip } from '@/components/mascot/MascotTip';

// Mascot settings type
export interface MascotSettings {
  isEnabled: boolean;
  mascotType: 'crypto_chonk' | 'pixel_chonk' | 'robot_chonk';
  animation: 'default' | 'excited' | 'thinking' | 'teaching';
  speechBubbleStyle: 'default' | 'neon' | 'minimal' | 'blockchain';
  tipFrequency: 'always' | 'hourly' | 'daily' | 'weekly';
}

// Default mascot settings
const defaultSettings: MascotSettings = {
  isEnabled: true,
  mascotType: 'crypto_chonk',
  animation: 'default',
  speechBubbleStyle: 'default',
  tipFrequency: 'daily',
};

// Default crypto tips data
const defaultTips: DailyTip[] = [
  {
    id: 1,
    tip: "Blockchain is a decentralized digital ledger that records transactions across many computers so that the record cannot be altered retroactively.",
    category: "Blockchain",
    difficulty: "beginner",
    tags: ['blockchain', 'basics'],
  },
  {
    id: 2,
    tip: "Private keys should never be shared with anyone. They're like the password to your crypto wallet.",
    category: "Security",
    difficulty: "beginner",
    tags: ['security', 'wallet'],
  },
  {
    id: 3,
    tip: "Dollar-cost averaging (DCA) is an investment strategy where you invest a fixed amount regularly, regardless of market price, to reduce the impact of volatility.",
    category: "Trading",
    difficulty: "intermediate",
    tags: ['investing', 'strategy'],
  },
  {
    id: 4,
    tip: "Smart contracts are self-executing contracts with the terms of the agreement directly written into code.",
    category: "Smart Contracts",
    difficulty: "intermediate",
    tags: ['ethereum', 'smart-contracts'],
  },
  {
    id: 5,
    tip: "NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of items like art, collectibles, and in-game items on the blockchain.",
    category: "NFTs",
    difficulty: "beginner",
    tags: ['nft', 'digital-assets'],
  },
  {
    id: 6,
    tip: "Proof of Stake (PoS) is a consensus mechanism that selects validators in proportion to their quantity of staked tokens.",
    category: "Consensus",
    difficulty: "advanced",
    tags: ['consensus', 'pos'],
  },
  {
    id: 7,
    tip: "Gas fees on Ethereum are payments made to compensate for the computing energy required to process and validate transactions.",
    category: "Ethereum",
    difficulty: "intermediate",
    tags: ['ethereum', 'gas'],
  },
  {
    id: 8,
    tip: "A crypto wallet doesn't actually store your coins; it stores the private keys that give you access to your crypto on the blockchain.",
    category: "Wallets",
    difficulty: "beginner",
    tags: ['wallet', 'basics'],
  },
  {
    id: 9,
    tip: "The term 'HODL' originated from a typo of 'hold' in a Bitcoin forum. It's now a strategy of holding onto crypto assets for long-term gains despite market volatility.",
    category: "Terminology",
    difficulty: "beginner",
    tags: ['lingo', 'strategy'],
  },
  {
    id: 10,
    tip: "Solana can process thousands of transactions per second thanks to its unique Proof of History (PoH) consensus mechanism.",
    category: "Solana",
    difficulty: "intermediate",
    tags: ['solana', 'speed'],
  },
];

// Hook options interface
interface UseMascotOptions {
  autoFetch?: boolean;
}

export function useMascot(options: UseMascotOptions = {}) {
  // Store settings in local storage
  const [settings, setSettings] = useLocalStorage<MascotSettings>('mascot-settings', defaultSettings);
  
  // Tips state
  const [tips, setTips] = useState<DailyTip[]>(defaultTips);
  const [currentTip, setCurrentTip] = useState<DailyTip | null>(null);
  const [displayedTips, setDisplayedTips] = useLocalStorage<{[id: number]: Date}>('mascot-displayed-tips', {});
  
  // Fetch initial tip on mount if autoFetch is true
  useEffect(() => {
    if (options.autoFetch && settings.isEnabled) {
      fetchTip();
    }
  }, [options.autoFetch, settings.isEnabled]);
  
  // Fetch a tip based on frequency settings
  const fetchTip = async () => {
    // In a real app, we would fetch from an API
    // For now, just use the defaultTips and filter based on what has been shown
    
    // Filter tips based on display history and frequency
    const eligibleTips = tips.filter(tip => {
      // If tip hasn't been displayed yet, it's eligible
      if (!displayedTips[tip.id]) return true;
      
      const lastDisplayed = new Date(displayedTips[tip.id]);
      const now = new Date();
      
      // Check if enough time has passed based on frequency setting
      switch (settings.tipFrequency) {
        case 'always':
          return true; // Always eligible
        case 'hourly':
          return (now.getTime() - lastDisplayed.getTime()) > (60 * 60 * 1000); // 1 hour
        case 'daily':
          return (now.getTime() - lastDisplayed.getTime()) > (24 * 60 * 60 * 1000); // 24 hours
        case 'weekly':
          return (now.getTime() - lastDisplayed.getTime()) > (7 * 24 * 60 * 60 * 1000); // 7 days
        default:
          return true;
      }
    });
    
    // If we have eligible tips, select a random one
    if (eligibleTips.length > 0) {
      const randomIndex = Math.floor(Math.random() * eligibleTips.length);
      setCurrentTip(eligibleTips[randomIndex]);
      return eligibleTips[randomIndex];
    }
    
    // If no eligible tips, use the least recently shown one
    const oldestTip = tips.reduce((oldest, tip) => {
      // If tip hasn't been displayed, it's the oldest (priority)
      if (!displayedTips[tip.id]) return tip;
      if (!displayedTips[oldest.id]) return oldest;
      
      // Compare display dates
      return displayedTips[tip.id] < displayedTips[oldest.id] ? tip : oldest;
    }, tips[0]);
    
    setCurrentTip(oldestTip);
    return oldestTip;
  };
  
  // Fetch a random tip
  const fetchRandomTip = async () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    const tip = tips[randomIndex];
    setCurrentTip(tip);
    return tip;
  };
  
  // Mark a tip as displayed
  const markTipAsDisplayed = (tipId: number) => {
    const updatedDisplayed = {
      ...displayedTips,
      [tipId]: new Date()
    };
    setDisplayedTips(updatedDisplayed);
  };
  
  // Update mascot settings
  const updateSettings = (newSettings: Partial<MascotSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  return {
    settings,
    updateSettings,
    currentTip,
    fetchTip,
    fetchRandomTip,
    markTipAsDisplayed,
  };
}
