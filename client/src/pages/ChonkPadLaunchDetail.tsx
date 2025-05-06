import React, { useState } from 'react';
import { useLocation, Link as RouterLink } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useChonkWallet } from '@/hooks/useChonkWallet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import ChonkTokenLogo from '@/components/ChonkTokenLogo';
import { 
  Rocket, Calendar, ArrowUp, ArrowDown, AlertCircle, CheckCircle, Clock, 
  Users, Link as LinkIcon, ExternalLink, Shield, Lock, ArrowLeft, 
  PieChart, LineChart, DollarSign, Percent, Landmark, ChevronUp, ChevronDown,
  Heart, Share2, ArrowRight, ArrowUpRight, HelpCircle
} from 'lucide-react';

// Sample token launch data (same structure as in ChonkPad.tsx)
const SAMPLE_LAUNCHES = [
  {
    id: 'chonkaverse',
    name: 'ChonkaVerse',
    symbol: 'CHONKAV',
    logo: '🐱',
    description: 'The metaverse platform for CHONK9K featuring virtual cyberpunk cities and games. ChonkaVerse creates an immersive digital universe where users can explore, interact, and engage in gameplay while earning CHONKAV tokens. The platform will feature virtual real estate, customizable avatars, social spaces, and play-to-earn mechanics, all integrated with CHONK9K tokenomics.',
    status: 'upcoming',
    launchDate: '2025-05-20T14:00:00Z',
    tokenPrice: 0.023,
    totalRaise: 500000,
    allocationPerUser: 1000,
    network: 'solana',
    tags: ['metaverse', 'gaming', 'defi'],
    links: {
      website: 'https://chonkaverse.chonk9k.io',
      twitter: 'https://twitter.com/chonkaverse',
      telegram: 'https://t.me/chonkaverse'
    },
    tokenomics: {
      totalSupply: 1000000000,
      initialCirculation: 100000000,
      publicSale: 30,
      team: 20,
      marketing: 15, 
      ecosystem: 35,
      locked: true,
      vestingInfo: 'Team tokens locked for 1 year with 2 year vesting'
    },
    auditStatus: {
      audited: true,
      auditCompany: 'CertiK',
      auditLink: 'https://certik.com/chonkaverse'
    },
    // Additional detailed information
    detailedDescription: 'ChonkaVerse represents the future of the CHONK9K ecosystem, bringing together the vibrant community and meme culture into an immersive metaverse experience. Users can explore cyberpunk-themed virtual worlds, own digital real estate, participate in community events, and earn CHONKAV tokens through various gameplay activities.\n\nThe platform will launch with a central hub city where users can socialize, trade virtual items, and access various games and experiences. Future expansions will include more districts, increased functionality, and deeper integration with the broader CHONK9K ecosystem.',
    teamMembers: [
      { name: 'Alex Purrington', role: 'Lead Developer', avatar: '🐱' },
      { name: 'Lily Whiskers', role: 'Creative Director', avatar: '🐈' },
      { name: 'Max Claw', role: 'Tokenomics Architect', avatar: '🐾' }
    ],
    roadmap: [
      { phase: 'Q2 2025', title: 'Initial Launch', description: 'Token sale, central hub city launch, basic avatar customization' },
      { phase: 'Q3 2025', title: 'Expansion', description: 'New districts, marketplace integration, NFT functionality' },
      { phase: 'Q4 2025', title: 'Play-to-Earn', description: 'Games and earning mechanics, staking rewards, governance' },
      { phase: 'Q1 2026', title: 'Cross-Chain', description: 'Ethereum integration, partner worlds, enhanced social features' }
    ],
    faq: [
      { question: 'What is ChonkaVerse?', answer: 'ChonkaVerse is a metaverse platform built for the CHONK9K community, featuring virtual worlds, social spaces, and play-to-earn mechanics.' },
      { question: 'How can I earn CHONKAV tokens?', answer: 'Users can earn tokens through gameplay, completing quests, participating in events, and staking CHONK9K tokens within the platform.' },
      { question: 'When will ChonkaVerse launch?', answer: 'The token sale begins on May 20, 2025, with the central hub city launching within 30 days after the completed sale.' },
      { question: 'Is there a limit to participation?', answer: 'Yes, the maximum allocation per user is $1,000 to ensure fair distribution across the community.' }
    ]
  },
  {
    id: 'fluffyfi',
    name: 'FluffyFi',
    symbol: 'FLUF',
    logo: '🧸',
    description: 'A decentralized lending protocol for the CHONK ecosystem with high yield opportunities. FluffyFi enables users to lend and borrow crypto assets with optimized interest rates, providing liquidity to the CHONK9K ecosystem while offering competitive returns to lenders.',
    status: 'live',
    launchDate: '2025-05-01T10:00:00Z',
    endDate: '2025-05-15T10:00:00Z',
    tokenPrice: 0.017,
    totalRaise: 300000,
    currentRaise: 215000,
    allocationPerUser: 750,
    network: 'base',
    tags: ['defi', 'lending', 'yield'],
    links: {
      website: 'https://fluffyfi.finance',
      twitter: 'https://twitter.com/fluffyfi',
      telegram: 'https://t.me/fluffyfi',
      discord: 'https://discord.gg/fluffyfi'
    },
    tokenomics: {
      totalSupply: 500000000,
      initialCirculation: 75000000,
      publicSale: 25,
      team: 18,
      marketing: 12,
      ecosystem: 45,
      locked: true,
      vestingInfo: 'Team tokens locked for 9 months, linear vesting for 18 months'
    },
    auditStatus: {
      audited: true,
      auditCompany: 'Hacken',
      auditLink: 'https://hacken.io/audits/fluffyfi'
    },
    // Additional detailed information
    detailedDescription: 'FluffyFi is a next-generation lending protocol built specifically for the CHONK9K ecosystem. It enables efficient capital utilization through optimized interest rate models and multiple lending pools. The platform supports various asset types while implementing risk mitigation strategies to protect users.\n\nThe protocol features isolated lending markets, liquidation protection mechanisms, and flash loan capabilities. Revenue generated from the protocol is shared with FLUF token holders and used to buy back and burn tokens, creating deflationary tokenomics.',
    teamMembers: [
      { name: 'Sarah Purrman', role: 'Protocol Lead', avatar: '🐱‍💻' },
      { name: 'Tom Whiskers', role: 'Smart Contract Engineer', avatar: '🧸' },
      { name: 'Mike Feline', role: 'Risk Analyst', avatar: '🐼' }
    ],
    roadmap: [
      { phase: 'Q2 2025', title: 'Launch', description: 'Token sale, initial lending markets for CHONK9K, USDC, and ETH' },
      { phase: 'Q3 2025', title: 'Expansion', description: 'Additional markets, liquidation improvements, governance launch' },
      { phase: 'Q4 2025', title: 'Advanced Features', description: 'Fixed-rate loans, undercollateralized loans, leverage trading' },
      { phase: 'Q1 2026', title: 'Cross-Chain', description: 'Multi-chain deployment, bridge integration, expanded partnerships' }
    ],
    faq: [
      { question: 'What makes FluffyFi different from other lending protocols?', answer: 'FluffyFi is optimized specifically for the CHONK9K ecosystem with specialized risk parameters and integrated rewards systems.' },
      { question: 'How are interest rates determined?', answer: 'Interest rates are dynamically adjusted based on utilization ratios, market conditions, and governance decisions.' },
      { question: 'Is FluffyFi secure?', answer: 'Yes, the protocol has been audited by Hacken and implements multiple security measures including circuit breakers and gradual parameter adjustments.' },
      { question: 'How can I participate in governance?', answer: 'FLUF token holders can vote on protocol parameters, new markets, and revenue distribution models.' }
    ]
  }
];

const ChonkPadLaunchDetail: React.FC = () => {
  const [location] = useLocation();
  const launchId = location.split('/')[2]; // Extract ID from URL path
  const { toast } = useToast();
  const { account, isConnected } = useChonkWallet();
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [showFaq, setShowFaq] = useState<{[key: string]: boolean}>({});
  
  // Find the launch by ID
  const launch = SAMPLE_LAUNCHES.find(l => l.id === launchId);
  
  if (!launch) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Token Launch Not Found</h1>
        <p className="text-gray-300 mb-6">The token launch you're looking for could not be found.</p>
        <RouterLink href="/chonkpad">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to ChonkPad
          </Button>
        </RouterLink>
      </div>
    );
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Calculate time remaining until launch
  const getTimeRemaining = (dateString: string) => {
    const launchDate = new Date(dateString).getTime();
    const now = new Date().getTime();
    const timeRemaining = launchDate - now;
    
    if (timeRemaining <= 0) return 'Launch time!';
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours, ${minutes} minutes`;
    if (hours > 0) return `${hours} hours, ${minutes} minutes`;
    return `${minutes} minutes`;
  };
  
  // Calculate progress percentage for live launches
  const progressPercentage = launch.currentRaise && launch.totalRaise
    ? Math.min(100, (launch.currentRaise / launch.totalRaise) * 100)
    : 0;
  
  // Handle investment submission
  const handleInvest = () => {
    if (!isConnected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to participate in this token launch.',
        variant: 'destructive',
      });
      return;
    }
    
    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid investment amount.',
        variant: 'destructive',
      });
      return;
    }
    
    if (amount > launch.allocationPerUser) {
      toast({
        title: 'Exceeds maximum allocation',
        description: `The maximum allocation per user is $${launch.allocationPerUser}.`,
        variant: 'destructive',
      });
      return;
    }
    
    // Simulate investment success
    toast({
      title: 'Investment Successful',
      description: `You've invested $${amount} in ${launch.name}. This is a demo feature.`,
      variant: 'default',
    });
    
    setInvestmentAmount('');
  };
  
  // Toggle FAQ visibility
  const toggleFaq = (index: string) => {
    setShowFaq(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <div className="mb-6">
        <RouterLink href="/chonkpad">
          <Button variant="outline" className="bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to ChonkPad
          </Button>
        </RouterLink>
      </div>
      
      {/* Hero section */}
      <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border border-pink-500/30 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Token logo and basic info */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-4xl">
              {launch.logo}
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-white">{launch.name}</h1>
                  <span className="text-lg text-gray-400">{launch.symbol}</span>
                  
                  {/* Network badge */}
                  <div className={`px-2 py-1 rounded text-xs font-medium ml-2 ${
                    launch.network === 'solana' ? 'bg-purple-500/50 text-purple-100' :
                    launch.network === 'ethereum' ? 'bg-blue-500/50 text-blue-100' :
                    'bg-amber-500/50 text-amber-100'
                  }`}>
                    {launch.network.charAt(0).toUpperCase() + launch.network.slice(1)}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {launch.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-pink-900/30 text-pink-300 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" className="bg-transparent">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorite
                </Button>
                
                <Button variant="outline" className="bg-transparent">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
            
            <p className="text-gray-300 mt-4 max-w-3xl">
              {launch.description}
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              {Object.entries(launch.links).map(([key, url]) => {
                if (!url) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm bg-black/30 text-blue-300 hover:text-blue-200 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Launch status and investment info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <Card className="bg-black/30 border-pink-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Token Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white flex items-center">
                <DollarSign className="h-5 w-5 text-pink-400 mr-1" />
                {launch.tokenPrice.toFixed(3)}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Initial listing price: ${(launch.tokenPrice * 1.2).toFixed(3)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-pink-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Fundraising Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white flex items-center">
                <Landmark className="h-5 w-5 text-blue-400 mr-1" />
                ${launch.totalRaise.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Max allocation: ${launch.allocationPerUser.toLocaleString()} per user
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-pink-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Token Sale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white flex items-center">
                <Calendar className="h-5 w-5 text-amber-400 mr-1" />
                {launch.status === 'upcoming' ? 'Upcoming' : launch.status === 'live' ? 'Live Now' : 'Ended'}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {launch.status === 'upcoming' ? (
                  <>Starts: {formatDate(launch.launchDate)}</>
                ) : launch.status === 'live' && launch.endDate ? (
                  <>Ends: {formatDate(launch.endDate)}</>
                ) : (
                  <>Ended: {launch.endDate ? formatDate(launch.endDate) : 'N/A'}</>
                )}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-pink-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Security</CardTitle>
            </CardHeader>
            <CardContent>
              {launch.auditStatus?.audited ? (
                <div className="flex items-center">
                  <div className="text-xl font-bold text-green-400 flex items-center">
                    <Shield className="h-5 w-5 mr-1" />
                    Audited
                  </div>
                  <a 
                    href={launch.auditStatus.auditLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <div className="text-xl font-bold text-amber-400 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-1" />
                  Audit Pending
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {launch.auditStatus?.audited ? (
                  <>By {launch.auditStatus.auditCompany}</>
                ) : (
                  <>Security review in progress</>
                )}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Timer and action buttons */}
        <div className="mt-8 bg-black/30 rounded-lg p-4 border border-pink-500/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="col-span-1 md:col-span-2">
              {launch.status === 'upcoming' && (
                <div>
                  <div className="flex items-center text-sm text-gray-300 mb-2">
                    <Clock className="h-4 w-4 mr-2 text-blue-400" />
                    <span>Time until launch</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {getTimeRemaining(launch.launchDate)}
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              )}
              
              {launch.status === 'live' && (
                <div>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center text-sm text-gray-300">
                      <ArrowRight className="h-4 w-4 mr-2 text-green-400" />
                      <span>Sale progress</span>
                    </div>
                    <div className="text-sm text-amber-400">
                      {progressPercentage.toFixed(1)}% funded
                    </div>
                  </div>
                  <div className="grid grid-cols-2 mb-2 text-sm">
                    <div>
                      <span className="text-gray-400">Raised:</span>{' '}
                      <span className="text-white">${launch.currentRaise?.toLocaleString() || 0}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400">Target:</span>{' '}
                      <span className="text-white">${launch.totalRaise.toLocaleString()}</span>
                    </div>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className="h-2 mb-2" 
                    indicatorClassName="bg-gradient-to-r from-pink-500 to-amber-500"
                  />
                  <div className="text-xs text-gray-400">
                    {launch.endDate && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-amber-400" />
                        <span>Sale ends in {getTimeRemaining(launch.endDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {launch.status === 'ended' && (
                <div>
                  <div className="flex items-center text-sm text-gray-300 mb-2">
                    <CheckCircle className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Sale completed</span>
                  </div>
                  <div className="grid grid-cols-2 mb-2 text-sm">
                    <div>
                      <span className="text-gray-400">Raised:</span>{' '}
                      <span className="text-white">${launch.currentRaise?.toLocaleString() || launch.totalRaise.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400">Target:</span>{' '}
                      <span className="text-white">${launch.totalRaise.toLocaleString()}</span>
                    </div>
                  </div>
                  <Progress 
                    value={100} 
                    className="h-2 mb-2" 
                    indicatorClassName="bg-gray-500"
                  />
                  <div className="text-xs text-gray-400">
                    Token distribution in progress
                  </div>
                </div>
              )}
            </div>
            
            <div className="col-span-1 flex flex-col gap-3">
              {launch.status === 'upcoming' && (
                <div>
                  <Button className="w-full bg-pink-600 hover:bg-pink-700">
                    <Calendar className="mr-2 h-4 w-4" />
                    Set Launch Reminder
                  </Button>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    We'll notify you 1 hour before the sale starts
                  </p>
                </div>
              )}
              
              {launch.status === 'live' && (
                <div>
                  <Input
                    type="number"
                    placeholder="Enter investment amount"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="mb-2"
                  />
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleInvest}
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    Invest Now
                  </Button>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Max allocation: ${launch.allocationPerUser} per wallet
                  </p>
                </div>
              )}
              
              {launch.status === 'ended' && (
                <div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Token on Explorer
                  </Button>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Token launched successfully on {formatDate(launch.endDate || launch.launchDate)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed information tabs */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mb-6">
          <TabsTrigger value="about">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              About
            </span>
          </TabsTrigger>
          <TabsTrigger value="tokenomics">
            <span className="flex items-center">
              <PieChart className="h-4 w-4 mr-2" />
              Tokenomics
            </span>
          </TabsTrigger>
          <TabsTrigger value="team">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Team
            </span>
          </TabsTrigger>
          <TabsTrigger value="roadmap">
            <span className="flex items-center">
              <LineChart className="h-4 w-4 mr-2" />
              Roadmap
            </span>
          </TabsTrigger>
          <TabsTrigger value="faq">
            <span className="flex items-center">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="about">
          <Card className="bg-black/40 border-blue-500/30">
            <CardHeader>
              <CardTitle>About {launch.name}</CardTitle>
              <CardDescription>
                Project overview and detailed information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {launch.detailedDescription?.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-300">
                  {paragraph}
                </p>
              ))}
              
              <div className="mt-4 pt-4 border-t border-gray-800">
                <h3 className="text-xl font-bold text-white mb-3">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center">
                      <ArrowUpRight className="h-5 w-5 text-blue-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-300">Innovation</h4>
                      <p className="text-sm text-gray-300">Cutting-edge technology with unique features in the CHONK9K ecosystem</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-900 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-green-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-300">Security</h4>
                      <p className="text-sm text-gray-300">Thoroughly audited code with best security practices</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-amber-900 flex items-center justify-center">
                      <Users className="h-5 w-5 text-amber-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-300">Community-Driven</h4>
                      <p className="text-sm text-gray-300">Strong emphasis on community governance and participation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-pink-900 flex items-center justify-center">
                      <Rocket className="h-5 w-5 text-pink-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-pink-300">Growth Potential</h4>
                      <p className="text-sm text-gray-300">Clear roadmap with ambitious goals and expansion plans</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tokenomics">
          <Card className="bg-black/40 border-pink-500/30">
            <CardHeader>
              <CardTitle>Token Distribution</CardTitle>
              <CardDescription>
                How {launch.symbol} tokens are allocated and distributed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-3">Allocation Breakdown</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Public Sale</span>
                          <span className="text-pink-400">{launch.tokenomics.publicSale}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full">
                          <div 
                            className="h-2 bg-pink-500 rounded-full" 
                            style={{ width: `${launch.tokenomics.publicSale}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Team</span>
                          <span className="text-blue-400">{launch.tokenomics.team}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full">
                          <div 
                            className="h-2 bg-blue-500 rounded-full" 
                            style={{ width: `${launch.tokenomics.team}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Marketing</span>
                          <span className="text-amber-400">{launch.tokenomics.marketing}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full">
                          <div 
                            className="h-2 bg-amber-500 rounded-full" 
                            style={{ width: `${launch.tokenomics.marketing}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Ecosystem</span>
                          <span className="text-green-400">{launch.tokenomics.ecosystem}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full" 
                            style={{ width: `${launch.tokenomics.ecosystem}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-white mb-3">Token Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Total Supply</div>
                        <div className="text-xl font-bold text-white">
                          {(launch.tokenomics.totalSupply / 1000000).toFixed(0)}M
                        </div>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Initial Circulation</div>
                        <div className="text-xl font-bold text-white">
                          {(launch.tokenomics.initialCirculation / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Token Type</div>
                        <div className="text-lg font-bold text-white">
                          {launch.network === 'solana' ? 'SPL Token' : 
                           launch.network === 'ethereum' ? 'ERC-20' : 
                           'ERC-20 (L2)'}
                        </div>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Initial Market Cap</div>
                        <div className="text-lg font-bold text-white">
                          ${(launch.tokenomics.initialCirculation * launch.tokenPrice / 1000000).toFixed(2)}M
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Vesting Schedule</h3>
                  <div className="bg-black/30 rounded-lg p-4 mb-4">
                    {launch.tokenomics.locked ? (
                      <div className="flex items-center gap-2 mb-3">
                        <Lock className="h-5 w-5 text-green-400" />
                        <span className="text-lg font-medium text-green-400">Token Locking Enabled</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="h-5 w-5 text-amber-400" />
                        <span className="text-lg font-medium text-amber-400">No Locking Mechanism</span>
                      </div>
                    )}
                    
                    <div className="text-gray-300">
                      <p className="mb-2">{launch.tokenomics.vestingInfo}</p>
                      
                      <div className="mt-4 space-y-3">
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-blue-300 mb-1">Public Sale</div>
                          <div className="text-sm text-gray-300">25% TGE, 25% monthly for 3 months</div>
                        </div>
                        
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-pink-300 mb-1">Team</div>
                          <div className="text-sm text-gray-300">6 month cliff, 18 month linear vesting</div>
                        </div>
                        
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-amber-300 mb-1">Marketing</div>
                          <div className="text-sm text-gray-300">10% TGE, 15% monthly for 6 months</div>
                        </div>
                        
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-green-300 mb-1">Ecosystem</div>
                          <div className="text-sm text-gray-300">5% TGE, remainder locked for governance release</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-900/30 to-green-900/30 rounded-lg p-4 border border-blue-500/30">
                    <h3 className="text-lg font-bold text-white mb-2">Tokenomics Highlights</h3>
                    
                    <div className="space-y-3 mt-3">
                      <div className="flex items-center gap-2">
                        <Percent className="h-5 w-5 text-green-400" />
                        <div className="text-sm text-gray-300">
                          <span className="text-green-400 font-medium">Deflationary Mechanism</span>: 1% token burn on transactions
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-blue-400" />
                        <div className="text-sm text-gray-300">
                          <span className="text-blue-400 font-medium">Liquidity Locking</span>: Initial DEX liquidity locked for 2 years
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-pink-400" />
                        <div className="text-sm text-gray-300">
                          <span className="text-pink-400 font-medium">Community Treasury</span>: 5% of tokens for community initiatives
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <Card className="bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                The core team behind {launch.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {launch.teamMembers?.map((member, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-5 border border-pink-500/20">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-4xl">
                        {member.avatar}
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-pink-300 mb-3">{member.role}</p>
                      <div className="flex justify-center space-x-3">
                        <a href="#" className="text-gray-400 hover:text-blue-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-blue-600">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-100">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-5 border border-purple-500/30">
                <h3 className="text-xl font-bold text-white mb-4">Advisors & Partners</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg text-center">
                    <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="text-white font-medium">BlockVentures</div>
                    <div className="text-xs text-gray-400">Strategic Partner</div>
                  </div>
                  
                  <div className="bg-black/30 p-4 rounded-lg text-center">
                    <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="text-white font-medium">SecureChain</div>
                    <div className="text-xs text-gray-400">Security Advisor</div>
                  </div>
                  
                  <div className="bg-black/30 p-4 rounded-lg text-center">
                    <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-white font-medium">FinTech Labs</div>
                    <div className="text-xs text-gray-400">Financial Partner</div>
                  </div>
                  
                  <div className="bg-black/30 p-4 rounded-lg text-center">
                    <div className="w-12 h-12 bg-amber-900/50 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="h-6 w-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="text-white font-medium">AccelBoost</div>
                    <div className="text-xs text-gray-400">Incubator</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roadmap">
          <Card className="bg-black/40 border-green-500/30">
            <CardHeader>
              <CardTitle>Project Roadmap</CardTitle>
              <CardDescription>
                Development milestones and upcoming features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-3 md:left-1/2 top-0 bottom-0 w-0.5 bg-green-900/50 -ml-0.5"></div>
                
                <div className="space-y-12">
                  {launch.roadmap?.map((phase, index) => (
                    <div key={index} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      {/* Timeline dot */}
                      <div className="absolute left-0 md:left-1/2 -ml-2.5 md:-ml-3 mt-1.5 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center z-10">
                        <div className="w-3 h-3 rounded-full bg-green-300"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="md:w-1/2 pl-8 md:pl-0 md:pr-0 md:px-8 pb-2">
                        <div className={`bg-black/30 rounded-lg p-4 border ${index % 2 === 0 ? 'border-green-500/30' : 'border-blue-500/30'}`}>
                          <div className="flex items-center">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${index % 2 === 0 ? 'bg-green-900/50 text-green-300' : 'bg-blue-900/50 text-blue-300'}`}>
                              {phase.phase}
                            </div>
                            <h3 className="ml-2 text-lg font-bold text-white">{phase.title}</h3>
                          </div>
                          <p className="mt-2 text-gray-300">{phase.description}</p>
                          
                          {/* Example milestone details - would come from data in real app */}
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                              <span className="text-gray-300">Infrastructure setup</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                              <span className="text-gray-300">Core functionality</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2 text-amber-400" />
                              <span className="text-gray-300">Community features</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Empty space for the other side */}
                      <div className="hidden md:block md:w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-5 border border-blue-500/30">
                <h3 className="text-xl font-bold text-white mb-4">Long-term Vision</h3>
                <p className="text-gray-300 mb-4">
                  {launch.name} aims to become a cornerstone of the CHONK9K ecosystem, with plans to expand
                  into cross-chain functionality, advanced features, and deeper integration with other
                  ecosystem projects. The team is committed to continuous innovation while maintaining
                  the highest standards of security and user experience.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                      <h4 className="font-medium text-white">Year 1</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Core platform growth, community building, and initial feature set deployment
                    </p>
                  </div>
                  
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 mr-2 text-pink-400" />
                      <h4 className="font-medium text-white">Year 2</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Expansion to multiple blockchains, advanced features, and strategic partnerships
                    </p>
                  </div>
                  
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 mr-2 text-amber-400" />
                      <h4 className="font-medium text-white">Year 3+</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Ecosystem leadership, revolutionary new capabilities, and global adoption
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card className="bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Get answers to common questions about {launch.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {launch.faq?.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-black/30 rounded-lg overflow-hidden border border-gray-800"
                  >
                    <div 
                      className="flex justify-between items-center p-4 cursor-pointer"
                      onClick={() => toggleFaq(index.toString())}
                    >
                      <h3 className="text-white font-medium">{item.question}</h3>
                      <div className="text-gray-400">
                        {showFaq[index.toString()] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </div>
                    
                    {showFaq[index.toString()] && (
                      <div className="p-4 pt-0 border-t border-gray-800">
                        <p className="text-gray-300">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-lg p-5 border border-pink-500/30">
                <h3 className="text-xl font-bold text-white mb-3">Still have questions?</h3>
                <p className="text-gray-300 mb-4">
                  If you couldn't find the answer to your question, feel free to reach out to us directly.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <a 
                    href={launch.links.telegram || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-900/50 hover:bg-blue-900/70 text-blue-100 px-4 py-2 rounded-md transition-colors flex items-center"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"></path>
                    </svg>
                    Telegram Group
                  </a>
                  
                  <a 
                    href={launch.links.discord || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-indigo-900/50 hover:bg-indigo-900/70 text-indigo-100 px-4 py-2 rounded-md transition-colors flex items-center"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                    </svg>
                    Discord Server
                  </a>
                  
                  <a 
                    href={`mailto:info@${launch.id}.io`} 
                    className="bg-gray-800 hover:bg-gray-700 text-gray-100 px-4 py-2 rounded-md transition-colors flex items-center"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Support
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChonkPadLaunchDetail;