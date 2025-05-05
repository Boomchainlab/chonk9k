import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Trophy, Unlock, Lock, Star, Map, Stamp, Sparkles, Download, Share2 } from 'lucide-react';
import { useChonkWallet } from '@/hooks/useChonkWallet';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Types for passport data
interface PassportStamp {
  id: string;
  name: string;
  network: NetworkType;
  description: string;
  image: string;
  isCollected: boolean;
  dateCollected?: string;
  requirements: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic';
  benefit?: string;
}

// Network logo sources
const NETWORK_LOGOS = {
  ethereum: '/images/networks/ethereum-logo.svg',
  solana: '/images/networks/solana-logo.svg',
  base: '/images/networks/base-logo.svg',
  arbitrum: '/images/networks/arbitrum-logo.svg',
  optimism: '/images/networks/optimism-logo.svg',
  polygon: '/images/networks/polygon-logo.svg',
};

type NetworkType = 'ethereum' | 'solana' | 'base' | 'all';

interface PassportData {
  totalCollected: number;
  totalAvailable: number;
  networks: {
    ethereum: { collected: number, total: number },
    solana: { collected: number, total: number },
    base: { collected: number, total: number },
  };
  level: number;
  xp: number;
  nextLevelXp: number;
  rank: string;
}

// Mock passport data
const MOCK_STAMPS: PassportStamp[] = [
  {
    id: 'ethereum-genesis',
    name: 'Ethereum Genesis',
    network: 'ethereum',
    description: 'Connect your Ethereum wallet for the first time.',
    image: '/images/stamps/ethereum-genesis.svg',
    isCollected: true,
    dateCollected: '2025-04-15T12:30:45Z',
    requirements: 'Connect an Ethereum wallet to the platform.',
    rarity: 'common',
    benefit: 'Access to basic Ethereum features.'
  },
  {
    id: 'solana-genesis',
    name: 'Solana Genesis',
    network: 'solana',
    description: 'Connect your Solana wallet for the first time.',
    image: '/images/stamps/solana-genesis.svg',
    isCollected: true,
    dateCollected: '2025-04-16T14:22:10Z',
    requirements: 'Connect a Solana wallet to the platform.',
    rarity: 'common',
    benefit: 'Access to basic Solana features.'
  },
  {
    id: 'base-genesis',
    name: 'Base Genesis',
    network: 'base',
    description: 'Connect your Base wallet for the first time.',
    image: '/images/stamps/base-genesis.svg',
    isCollected: true,
    dateCollected: '2025-04-17T09:15:33Z',
    requirements: 'Connect a Base wallet to the platform.',
    rarity: 'common',
    benefit: 'Access to basic Base features.'
  },
  {
    id: 'ethereum-trader',
    name: 'Ethereum Trader',
    network: 'ethereum',
    description: 'Complete your first Ethereum token swap on our platform.',
    image: '/images/stamps/ethereum-trader.svg',
    isCollected: true,
    dateCollected: '2025-04-20T16:40:12Z',
    requirements: 'Complete an ERC-20 token swap transaction.',
    rarity: 'uncommon',
    benefit: 'Reduced swap fees on Ethereum network.'
  },
  {
    id: 'solana-speed-demon',
    name: 'Solana Speed Demon',
    network: 'solana',
    description: 'Experience the lightning-fast Solana transactions.',
    image: '/images/stamps/solana-speed.svg',
    isCollected: true,
    dateCollected: '2025-04-21T10:12:40Z',
    requirements: 'Complete 5 Solana transactions in a single day.',
    rarity: 'uncommon',
    benefit: '10% bonus on Solana staking rewards.'
  },
  {
    id: 'base-pioneer',
    name: 'Base Pioneer',
    network: 'base',
    description: 'Join the Base ecosystem early adopters.',
    image: '/images/stamps/base-pioneer.png',
    isCollected: false,
    requirements: 'Hold at least 1000 $CHONK9K on Base for 7 days.',
    rarity: 'uncommon',
  },
  {
    id: 'ethereum-chonker',
    name: 'Ethereum CHONKER',
    network: 'ethereum',
    description: 'Hold a significant amount of CHONK9K tokens on Ethereum.',
    image: '/images/stamps/ethereum-chonker.png',
    isCollected: false,
    requirements: 'Hold at least 50,000 $CHONK9K on Ethereum for 14 days.',
    rarity: 'rare',
  },
  {
    id: 'solana-chonker',
    name: 'Solana CHONKER',
    network: 'solana',
    description: 'Hold a significant amount of CHONK9K tokens on Solana.',
    image: '/images/stamps/solana-chonker.png',
    isCollected: false,
    requirements: 'Hold at least 50,000 $CHONK9K on Solana for 14 days.',
    rarity: 'rare',
  },
  {
    id: 'multi-chain-master',
    name: 'Multi-Chain Master',
    network: 'all',
    description: 'Utilize CHONK9K across multiple blockchain networks.',
    image: '/images/stamps/multi-chain-master.svg',
    isCollected: false,
    requirements: 'Hold CHONK9K on at least 3 different chains simultaneously.',
    rarity: 'legendary',
    benefit: 'Access to exclusive multi-chain features and airdrops.'
  },
  {
    id: 'crypto-cat-whisperer',
    name: 'Crypto Cat Whisperer',
    network: 'all',
    description: 'Master of the CHONK9K ecosystem.',
    image: '/images/stamps/cat-whisperer.svg',
    isCollected: false,
    requirements: 'Collect 15 other passport stamps.',
    rarity: 'mythic',
    benefit: 'VIP access to all CHONK9K features and special events.'
  },
  {
    id: 'ethereum-staker',
    name: 'Ethereum Staker',
    network: 'ethereum',
    description: 'Stake CHONK9K tokens on Ethereum.',
    image: '/images/stamps/ethereum-staker.png',
    isCollected: false,
    requirements: 'Stake at least 10,000 $CHONK9K on Ethereum for 30 days.',
    rarity: 'rare',
    benefit: 'Bonus ETH staking rewards.'
  },
  {
    id: 'solana-governance',
    name: 'Solana Governance',
    network: 'solana',
    description: 'Participate in CHONK9K DAO voting on Solana.',
    image: '/images/stamps/solana-governance.png',
    isCollected: false,
    requirements: 'Vote on at least 3 DAO proposals.',
    rarity: 'rare',
    benefit: 'Weighted voting power in DAO proposals.'
  }
];

const MOCK_PASSPORT_DATA: PassportData = {
  totalCollected: 5,
  totalAvailable: 12,
  networks: {
    ethereum: { collected: 2, total: 4 },
    solana: { collected: 2, total: 4 },
    base: { collected: 1, total: 2 },
  },
  level: 3,
  xp: 350,
  nextLevelXp: 500,
  rank: 'Chonk Novice'
};

// Helper components
const RarityBadge: React.FC<{ rarity: PassportStamp['rarity'] }> = ({ rarity }) => {
  const getColor = () => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'uncommon':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'rare':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'legendary':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'mythic':
        return 'bg-pink-100 text-pink-600 border-pink-200';
    }
  };

  return (
    <Badge className={`${getColor()} ml-2 capitalize font-medium`}>
      {rarity}
    </Badge>
  );
};

const NetworkBadge: React.FC<{ network: NetworkType }> = ({ network }) => {
  let color;
  
  switch (network) {
    case 'ethereum':
      color = 'bg-blue-100 text-blue-600 border-blue-200';
      break;
    case 'solana':
      color = 'bg-purple-100 text-purple-600 border-purple-200';
      break;
    case 'base':
      color = 'bg-cyan-100 text-cyan-600 border-cyan-200';
      break;
    case 'all':
      color = 'bg-gradient-to-r from-blue-100 via-purple-100 to-cyan-100 text-pink-600 border-pink-200';
      break;
  }

  return (
    <Badge className={`${color} mr-2 capitalize font-medium`}>
      {network}
    </Badge>
  );
};

const PassportStampCard: React.FC<{ stamp: PassportStamp, onClick: () => void }> = ({ stamp, onClick }) => {
  const getNetworkLogo = (network: NetworkType) => {
    if (network === 'ethereum') return NETWORK_LOGOS.ethereum;
    if (network === 'solana') return NETWORK_LOGOS.solana;
    if (network === 'base') return NETWORK_LOGOS.base;
    return '/images/networks/ethereum-logo.svg';
  };
  
  return (
    <Card 
      className={`cursor-pointer border overflow-hidden hover:shadow-md transition-all duration-200 ${!stamp.isCollected ? 'opacity-75' : ''}`}
      onClick={onClick}
    >
      <div className="relative">
        <div className={`aspect-square overflow-hidden bg-muted flex items-center justify-center ${!stamp.isCollected ? 'filter grayscale' : ''}`}>
          {/* Stamp image */}
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 p-4">
            <div className="relative">
              {/* Show actual stamp SVG if available */}
              {stamp.id && (
                <img 
                  src={stamp.image} 
                  alt={stamp.name} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to network logo if stamp image is not available
                    const target = e.target as HTMLImageElement;
                    target.src = getNetworkLogo(stamp.network);
                  }}
                />
              )}
              <div className="absolute right-1 bottom-1">
                {stamp.isCollected ? (
                  <Stamp className="h-8 w-8 text-green-500" />
                ) : (
                  <Lock className="h-8 w-8 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-2 left-2 flex items-center">
          <NetworkBadge network={stamp.network} />
        </div>
        {stamp.rarity === 'legendary' || stamp.rarity === 'mythic' ? (
          <div className="absolute top-0 right-0 p-1">
            <div className="bg-yellow-400 p-1 rounded-bl-md">
              <Star className="h-5 w-5 text-white" fill="white" />
            </div>
          </div>
        ) : null}
      </div>
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold">{stamp.name}</CardTitle>
          <RarityBadge rarity={stamp.rarity} />
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <p className="text-xs text-muted-foreground">{stamp.description}</p>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between">
        <div className="text-xs flex items-center">
          {stamp.isCollected ? (
            <span className="text-green-600 flex items-center">
              <Unlock className="h-3 w-3 mr-1" />
              Collected
            </span>
          ) : (
            <span className="text-amber-600 flex items-center">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </span>
          )}
        </div>
        {stamp.isCollected && stamp.dateCollected && (
          <span className="text-xs text-muted-foreground">
            {new Date(stamp.dateCollected).toLocaleDateString()}
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

const PassportProgressCard: React.FC<{ data: PassportData }> = ({ data }) => {
  return (
    <Card className="mb-6 border-none shadow-md bg-gradient-to-r from-purple-50 to-pink-50">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Passport Overview */}
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Your Blockchain Passport</h3>
            <div className="flex items-center mb-4">
              <div className="mr-2 p-1.5 bg-purple-100 rounded-md">
                <Map className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Passport Level</div>
                <div className="font-semibold flex items-center">
                  Level {data.level} - {data.rank}
                  {data.level >= 5 && (
                    <Badge className="ml-2 bg-yellow-100 text-yellow-700 border-yellow-200">
                      <Trophy className="h-3 w-3 mr-1" /> Elite
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>XP Progress</span>
                  <span>{data.xp}/{data.nextLevelXp} XP</span>
                </div>
                <Progress value={(data.xp / data.nextLevelXp) * 100} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stamps Collected:</span>
                <span className="font-medium">{data.totalCollected}/{data.totalAvailable}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="bg-white/80 rounded-md p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <img src={NETWORK_LOGOS.ethereum} className="h-4 w-4" alt="Ethereum" />
                    <span className="text-blue-600 text-xs">Ethereum</span>
                  </div>
                  <div className="font-semibold text-sm">{data.networks.ethereum.collected}/{data.networks.ethereum.total}</div>
                  <div className="h-1 w-full bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${(data.networks.ethereum.collected / data.networks.ethereum.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-white/80 rounded-md p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <img src={NETWORK_LOGOS.solana} className="h-4 w-4" alt="Solana" />
                    <span className="text-purple-600 text-xs">Solana</span>
                  </div>
                  <div className="font-semibold text-sm">{data.networks.solana.collected}/{data.networks.solana.total}</div>
                  <div className="h-1 w-full bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 rounded-full" 
                      style={{ width: `${(data.networks.solana.collected / data.networks.solana.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-white/80 rounded-md p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <img src={NETWORK_LOGOS.base} className="h-4 w-4" alt="Base" />
                    <span className="text-cyan-600 text-xs">Base</span>
                  </div>
                  <div className="font-semibold text-sm">{data.networks.base.collected}/{data.networks.base.total}</div>
                  <div className="h-1 w-full bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-cyan-600 rounded-full" 
                      style={{ width: `${(data.networks.base.collected / data.networks.base.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Passport Visual */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="relative">
              {/* Passport book */}
              <div className="relative w-56 h-72 rounded-lg overflow-hidden shadow-xl border-2 border-pink-300 transform rotate-3 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
                <div className="absolute inset-0 bg-[url('/images/passport-background-pattern.svg')] opacity-10"></div>
                <div className="absolute inset-0 p-6 flex flex-col">
                  {/* Header */}
                  <div className="text-white font-bold mb-3 text-center">
                    <div className="text-xl mb-1 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-yellow-300 mr-1" />
                      BLOCKCHAIN
                      <Sparkles className="h-5 w-5 text-yellow-300 ml-1" />
                    </div>
                    <div className="text-lg">PASSPORT</div>
                  </div>
                  
                  {/* Passport photo area */}
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm self-center mb-4 border border-white/30">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mb-2">
                        <img src="/images/chonk-logo.png" alt="CHONK" className="w-12 h-12 object-contain rounded-full" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFFFFF' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <div className="text-white text-center">
                        <div className="font-bold">LEVEL {data.level}</div>
                        <div className="text-sm">{data.rank}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Network icons */}
                  <div className="flex justify-center mb-4 gap-2">
                    <div className="p-1 bg-white/20 rounded-full">
                      <img src={NETWORK_LOGOS.ethereum} className="h-5 w-5" alt="Ethereum" />
                    </div>
                    <div className="p-1 bg-white/20 rounded-full">
                      <img src={NETWORK_LOGOS.solana} className="h-5 w-5" alt="Solana" />
                    </div>
                    <div className="p-1 bg-white/20 rounded-full">
                      <img src={NETWORK_LOGOS.base} className="h-5 w-5" alt="Base" />
                    </div>
                  </div>
                  
                  {/* Footer info */}
                  <div className="flex justify-between items-end text-white text-xs mt-auto">
                    <div>
                      <div>ISSUED: {new Date().toLocaleDateString()}</div>
                      <div>ID: #CHONK-{Math.floor(1000 + Math.random() * 9000)}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-pink-600 px-2 py-1 rounded-full font-bold">
                        {data.totalCollected} stamps
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stamp overlay */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rotate-12">
                <div className="w-full h-full rounded-full bg-red-600 flex items-center justify-center text-white font-bold border-4 border-red-700 text-xs p-2 text-center leading-tight shadow-lg">
                  OFFICIAL CHONK PASSPORT
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PassportStampDetail: React.FC<{
  stamp: PassportStamp;
  onClose: () => void;
}> = ({ stamp, onClose }) => {
  const { toast } = useToast();
  const { isConnected } = useChonkWallet();
  
  const getNetworkLogo = (network: NetworkType) => {
    if (network === 'ethereum') return NETWORK_LOGOS.ethereum;
    if (network === 'solana') return NETWORK_LOGOS.solana;
    if (network === 'base') return NETWORK_LOGOS.base;
    return '/images/networks/ethereum-logo.svg';
  };
  
  const handleCollect = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to collect stamps.",
        variant: "destructive"
      });
      return;
    }
    
    // Mock collection process
    toast({
      title: "Requirements Not Met",
      description: stamp.requirements,
      variant: "default"
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Stamp visual */}
        <div className="flex-shrink-0">
          <div className={`w-full sm:w-48 h-48 ${!stamp.isCollected ? 'filter grayscale opacity-80' : ''} bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center p-6 relative`}>
            <div className="relative">
              {/* Show actual stamp SVG if available */}
              <img 
                src={stamp.image} 
                alt={stamp.name} 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  // Fallback to network logo if stamp image is not available
                  const target = e.target as HTMLImageElement;
                  target.src = getNetworkLogo(stamp.network);
                }}
              />
              {stamp.isCollected && (
                <div className="absolute -right-3 -bottom-3 transform rotate-12">
                  <div className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    COLLECTED
                  </div>
                </div>
              )}
            </div>
            
            {stamp.rarity === 'legendary' || stamp.rarity === 'mythic' ? (
              <div className="absolute top-0 right-0 p-2">
                <div className="bg-yellow-400 p-1 rounded-bl-md">
                  <Star className="h-5 w-5 text-white" fill="white" />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        
        {/* Stamp details */}
        <div className="flex-grow space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold">{stamp.name}</h3>
              <div className="flex items-center mt-1">
                <NetworkBadge network={stamp.network} />
                <RarityBadge rarity={stamp.rarity} />
              </div>
            </div>
            {stamp.isCollected && stamp.dateCollected && (
              <div className="text-xs text-muted-foreground">
                Collected on {new Date(stamp.dateCollected).toLocaleDateString()}
              </div>
            )}
          </div>
          
          <p className="text-muted-foreground">{stamp.description}</p>
          
          <div className="space-y-2">
            <div>
              <div className="font-semibold text-sm">Requirements:</div>
              <div className="text-sm">{stamp.requirements}</div>
            </div>
            
            {stamp.benefit && (
              <div>
                <div className="font-semibold text-sm">Special Benefits:</div>
                <div className="text-sm text-green-600">{stamp.benefit}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <div className="flex gap-2">
          {!stamp.isCollected && (
            <Button variant="default" onClick={handleCollect}>
              Check Eligibility
            </Button>
          )}
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => {
              const shareText = `Check out my CHONK9K Blockchain Passport! I've collected ${stamp.isCollected ? 'the ' + stamp.name : 'multiple'} stamp${stamp.isCollected ? '' : 's'} across different blockchains!`;
              if (navigator.share) {
                navigator.share({
                  title: 'CHONK9K Blockchain Passport',
                  text: shareText,
                  url: window.location.href,
                })
                .catch((error) => {
                  toast({
                    title: "Sharing failed",
                    description: "Could not share stamp. Copied to clipboard instead.",
                    variant: "destructive",
                  });
                  navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
                });
              } else {
                navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
                toast({
                  title: "Copied to clipboard",
                  description: "Sharing link copied. You can now paste it anywhere.",
                  variant: "default",
                });
              }
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main component
const NetworkPassports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NetworkType>('all');
  const [selectedStamp, setSelectedStamp] = useState<PassportStamp | null>(null);
  const { isConnected } = useChonkWallet();
  const { toast } = useToast();
  
  // Filter stamps based on active tab
  const filteredStamps = MOCK_STAMPS.filter(stamp => {
    if (activeTab === 'all') return true;
    return stamp.network === activeTab;
  });
  
  // Filter for collected/uncollected stats
  const collectedStamps = filteredStamps.filter(stamp => stamp.isCollected);
  const uncollectedStamps = filteredStamps.filter(stamp => !stamp.isCollected);
  
  // Handle export passport
  const handleExportPassport = () => {
    // Prepare passport data for export
    const passportData = {
      level: MOCK_PASSPORT_DATA.level,
      rank: MOCK_PASSPORT_DATA.rank,
      stamps: MOCK_STAMPS.filter(stamp => stamp.isCollected).map(stamp => ({
        id: stamp.id,
        name: stamp.name,
        network: stamp.network,
        dateCollected: stamp.dateCollected,
      })),
      totalCollected: MOCK_PASSPORT_DATA.totalCollected,
      totalAvailable: MOCK_PASSPORT_DATA.totalAvailable,
      networks: MOCK_PASSPORT_DATA.networks,
      exportDate: new Date().toISOString(),
      passportId: `CHONK-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    
    // Create a JSON string with proper formatting
    const jsonData = JSON.stringify(passportData, null, 2);
    
    // Create a blob with the data
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chonk9k-passport-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Passport Exported",
      description: "Your passport has been exported to JSON. You can import it later or share with others.",
      variant: "default",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header section */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              Blockchain Passport
            </h1>
          </div>
          <p className="text-muted-foreground">
            Collect stamps from different blockchain networks and showcase your multi-chain journey.
          </p>
        </div>
        
        {/* Passport overview and progress */}
        <PassportProgressCard data={MOCK_PASSPORT_DATA} />
        
        {/* Export passport button */}
        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExportPassport}
          >
            <Download className="h-4 w-4" />
            Export Passport
          </Button>
        </div>
        
        {/* Tabs for different networks */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as NetworkType)}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-1">
                <div className="flex -space-x-2 mr-1">
                  <div className="h-4 w-4 rounded-full bg-blue-500 border border-white"></div>
                  <div className="h-4 w-4 rounded-full bg-purple-500 border border-white"></div>
                  <div className="h-4 w-4 rounded-full bg-cyan-500 border border-white"></div>
                </div>
                All Networks
              </TabsTrigger>
              <TabsTrigger value="ethereum" className="flex items-center gap-1">
                <img src={NETWORK_LOGOS.ethereum} className="h-4 w-4" alt="Ethereum" />
                Ethereum
              </TabsTrigger>
              <TabsTrigger value="solana" className="flex items-center gap-1">
                <img src={NETWORK_LOGOS.solana} className="h-4 w-4" alt="Solana" />
                Solana
              </TabsTrigger>
              <TabsTrigger value="base" className="flex items-center gap-1">
                <img src={NETWORK_LOGOS.base} className="h-4 w-4" alt="Base" />
                Base
              </TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-muted-foreground">
              {collectedStamps.length}/{filteredStamps.length} stamps collected
            </div>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <div>
              <h2 className="text-xl font-bold mb-4">All Network Passports</h2>
            </div>
          </TabsContent>
          <TabsContent value="ethereum" className="mt-0">
            <div>
              <h2 className="text-xl font-bold mb-4">Ethereum Passports</h2>
            </div>
          </TabsContent>
          <TabsContent value="solana" className="mt-0">
            <div>
              <h2 className="text-xl font-bold mb-4">Solana Passports</h2>
            </div>
          </TabsContent>
          <TabsContent value="base" className="mt-0">
            <div>
              <h2 className="text-xl font-bold mb-4">Base Passports</h2>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Collected Stamps section */}
        {collectedStamps.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Stamp className="h-5 w-5 mr-2 text-green-500" />
              Collected Stamps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {collectedStamps.map(stamp => (
                <PassportStampCard
                  key={stamp.id}
                  stamp={stamp}
                  onClick={() => setSelectedStamp(stamp)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Uncollected Stamps section */}
        {uncollectedStamps.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-amber-500" />
              Stamps to Collect
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uncollectedStamps.map(stamp => (
                <PassportStampCard
                  key={stamp.id}
                  stamp={stamp}
                  onClick={() => setSelectedStamp(stamp)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {filteredStamps.length === 0 && (
          <div className="text-center py-10">
            <div className="mb-4">
              <Map className="h-12 w-12 mx-auto text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No stamps found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are no passport stamps available for this network yet. Check back later or explore other networks.
            </p>
          </div>
        )}
        
        {/* Stamp detail dialog */}
        <Dialog open={!!selectedStamp} onOpenChange={(open) => !open && setSelectedStamp(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Passport Stamp</DialogTitle>
              <DialogDescription>
                Blockchain passport stamps represent your achievements and milestones.
              </DialogDescription>
            </DialogHeader>
            {selectedStamp && (
              <PassportStampDetail
                stamp={selectedStamp}
                onClose={() => setSelectedStamp(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default NetworkPassports;
