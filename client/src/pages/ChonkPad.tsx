import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useChonkWallet } from '@/hooks/useChonkWallet';
import ChonkTokenLogo from '@/components/ChonkTokenLogo';
import { Rocket, Calendar, ArrowUp, ArrowDown, AlertCircle, CheckCircle, Clock, Users, Link as LinkIcon, ExternalLink, Shield, Lock } from 'lucide-react';
import { Link } from 'wouter';

// Define the token launch interface
interface TokenLaunch {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  description: string;
  status: 'upcoming' | 'live' | 'ended';
  launchDate: string;
  endDate?: string;
  tokenPrice: number;
  totalRaise: number;
  currentRaise?: number;
  allocationPerUser: number;
  network: 'solana' | 'ethereum' | 'base';
  tags: string[];
  links: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    github?: string;
  };
  tokenomics: {
    totalSupply: number;
    initialCirculation: number;
    publicSale: number;
    team: number;
    marketing: number;
    ecosystem: number;
    locked: boolean;
    vestingInfo?: string;
  };
  auditStatus?: {
    audited: boolean;
    auditCompany?: string;
    auditLink?: string;
  };
}

// Sample token launches for demonstration
const SAMPLE_LAUNCHES: TokenLaunch[] = [
  {
    id: 'chonkaverse',
    name: 'ChonkaVerse',
    symbol: 'CHONKAV',
    logo: '🐱',
    description: 'The metaverse platform for CHONK9K featuring virtual cyberpunk cities and games.',
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
      vestingInfo: 'Team tokens locked for 1 year with 2 year vesting',
    },
    auditStatus: {
      audited: true,
      auditCompany: 'CertiK',
      auditLink: 'https://certik.com/chonkaverse',
    }
  },
  {
    id: 'fluffyfi',
    name: 'FluffyFi',
    symbol: 'FLUF',
    logo: '🧸',
    description: 'A decentralized lending protocol for the CHONK ecosystem with high yield opportunities.',
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
      discord: 'https://discord.gg/fluffyfi',
    },
    tokenomics: {
      totalSupply: 500000000,
      initialCirculation: 75000000,
      publicSale: 25,
      team: 18,
      marketing: 12,
      ecosystem: 45,
      locked: true,
      vestingInfo: 'Team tokens locked for 9 months, linear vesting for 18 months',
    },
    auditStatus: {
      audited: true,
      auditCompany: 'Hacken',
      auditLink: 'https://hacken.io/audits/fluffyfi',
    }
  },
  {
    id: 'whiskerswap',
    name: 'WhiskerSwap',
    symbol: 'WHISK',
    logo: '🐾',
    description: 'A decentralized exchange optimized for meme tokens with low slippage and fees.',
    status: 'upcoming',
    launchDate: '2025-06-10T16:00:00Z',
    tokenPrice: 0.025,
    totalRaise: 750000,
    allocationPerUser: 1500,
    network: 'solana',
    tags: ['dex', 'swap', 'defi'],
    links: {
      website: 'https://whiskerswap.io',
      twitter: 'https://twitter.com/whiskerswap',
      telegram: 'https://t.me/whiskerswap',
      discord: 'https://discord.gg/whiskerswap',
      github: 'https://github.com/whiskerswap',
    },
    tokenomics: {
      totalSupply: 1500000000,
      initialCirculation: 150000000,
      publicSale: 20,
      team: 15,
      marketing: 10,
      ecosystem: 55,
      locked: true,
      vestingInfo: 'Team and ecosystem tokens locked with 3 year vesting schedule',
    },
    auditStatus: {
      audited: false,
    }
  },
  {
    id: 'purrdao',
    name: 'PurrDAO',
    symbol: 'PURR',
    logo: '😼',
    description: 'A decentralized autonomous organization for governing CHONK9K ecosystem projects.',
    status: 'ended',
    launchDate: '2025-04-01T12:00:00Z',
    endDate: '2025-04-15T12:00:00Z',
    tokenPrice: 0.012,
    totalRaise: 400000,
    currentRaise: 400000,  // Fully funded
    allocationPerUser: 800,
    network: 'ethereum',
    tags: ['dao', 'governance', 'voting'],
    links: {
      website: 'https://purrdao.org',
      twitter: 'https://twitter.com/purrdao',
      discord: 'https://discord.gg/purrdao',
      github: 'https://github.com/purrdao',
    },
    tokenomics: {
      totalSupply: 1000000000,
      initialCirculation: 200000000,
      publicSale: 40,
      team: 20,
      marketing: 15,
      ecosystem: 25,
      locked: true,
      vestingInfo: 'Team tokens locked for 6 months with 1 year linear vesting',
    },
    auditStatus: {
      audited: true,
      auditCompany: 'Trail of Bits',
      auditLink: 'https://trailofbits.com/audits/purrdao',
    }
  },
];

const ChonkPad: React.FC = () => {
  const { account, isConnected } = useChonkWallet();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  
  // Filter token launches by status
  const upcomingLaunches = SAMPLE_LAUNCHES.filter(launch => launch.status === 'upcoming');
  const liveLaunches = SAMPLE_LAUNCHES.filter(launch => launch.status === 'live');
  const endedLaunches = SAMPLE_LAUNCHES.filter(launch => launch.status === 'ended');
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
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
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };
  
  // Handle investment button click
  const handleInvest = (launch: TokenLaunch) => {
    if (!isConnected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to participate in this token launch.',
        variant: 'destructive',
      });
      return;
    }
    
    // Redirect to investment page or open modal
    toast({
      title: `Investment in ${launch.name}`,
      description: `You're about to invest in ${launch.symbol}. This feature is coming soon!`,
      variant: 'default',
    });
  };
  
  // Handle reminder button click
  const handleSetReminder = (launch: TokenLaunch) => {
    toast({
      title: 'Reminder Set',
      description: `We'll notify you when ${launch.name} is about to launch!`,
      variant: 'default',
    });
  };
  
  // Render token launch card
  const renderLaunchCard = (launch: TokenLaunch) => {
    // Calculate progress percentage for live launches
    const progressPercentage = launch.currentRaise && launch.totalRaise
      ? Math.min(100, (launch.currentRaise / launch.totalRaise) * 100)
      : 0;
    
    return (
      <Card key={launch.id} className="bg-black/40 border-pink-500/30 overflow-hidden">
        {/* Network badge */}
        <div className="absolute top-2 right-2 z-10">
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            launch.network === 'solana' ? 'bg-purple-500/50 text-purple-100' :
            launch.network === 'ethereum' ? 'bg-blue-500/50 text-blue-100' :
            'bg-amber-500/50 text-amber-100'
          }`}>
            {launch.network.charAt(0).toUpperCase() + launch.network.slice(1)}
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl">
              {launch.logo}
            </div>
            <div>
              <CardTitle className="text-white flex items-center">
                {launch.name} 
                <span className="ml-2 text-sm text-gray-400">{launch.symbol}</span>
              </CardTitle>
              <div className="flex items-center mt-1 text-xs space-x-2">
                {launch.tags.map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 bg-pink-900/30 text-pink-300 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-gray-300 text-sm line-clamp-2 mb-4">
            {launch.description}
          </p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="text-xs text-gray-400 mb-1">Token Price</div>
              <div className="text-white font-medium">${launch.tokenPrice.toFixed(3)}</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="text-xs text-gray-400 mb-1">Target Raise</div>
              <div className="text-white font-medium">${launch.totalRaise.toLocaleString()}</div>
            </div>
          </div>
          
          {/* For Live Sales - Progress bar */}
          {launch.status === 'live' && (
            <div className="mb-4 bg-gray-900/50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs text-gray-400">Progress</div>
                <div className="text-xs text-amber-400">{progressPercentage.toFixed(1)}%</div>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-amber-500" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-gray-400">
                  ${launch.currentRaise?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-400">
                  ${launch.totalRaise.toLocaleString()}
                </div>
              </div>
            </div>
          )}
          
          {/* Launch timer */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-1 text-blue-400" />
              <span className="text-gray-300">{formatDate(launch.launchDate)}</span>
            </div>
            
            {launch.status === 'upcoming' && (
              <div className="flex items-center text-sm bg-blue-900/30 px-2 py-1 rounded-md">
                <Clock className="h-4 w-4 mr-1 text-blue-400" />
                <span className="text-blue-300">{getTimeRemaining(launch.launchDate)}</span>
              </div>
            )}
            
            {launch.status === 'live' && (
              <div className="flex items-center text-sm bg-green-900/30 px-2 py-1 rounded-md">
                <Clock className="h-4 w-4 mr-1 text-green-400" />
                <span className="text-green-300">
                  {launch.endDate ? `Ends: ${getTimeRemaining(launch.endDate)}` : 'Live Now'}
                </span>
              </div>
            )}
            
            {launch.status === 'ended' && (
              <div className="flex items-center text-sm bg-gray-900/30 px-2 py-1 rounded-md">
                <CheckCircle className="h-4 w-4 mr-1 text-gray-400" />
                <span className="text-gray-300">Completed</span>
              </div>
            )}
          </div>
          
          {/* Audit status */}
          <div className="mb-4">
            {launch.auditStatus?.audited ? (
              <div className="flex items-center text-sm bg-green-900/20 text-green-300 px-2 py-1 rounded-md">
                <Shield className="h-4 w-4 mr-1" />
                <span>Audited by {launch.auditStatus.auditCompany}</span>
                {launch.auditStatus.auditLink && (
                  <a 
                    href={launch.auditStatus.auditLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-green-300 hover:text-green-100 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center text-sm bg-amber-900/20 text-amber-300 px-2 py-1 rounded-md">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Audit Pending</span>
              </div>
            )}
          </div>
          
          {/* Team and token info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="text-xs text-gray-400 mb-1">Token Allocation</div>
              <div className="text-white font-medium">
                {launch.tokenomics.publicSale}% Public Sale
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {launch.tokenomics.locked && (
                  <div className="flex items-center">
                    <Lock className="h-3 w-3 mr-1 text-green-400" />
                    <span className="text-green-400">Team tokens locked</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="text-xs text-gray-400 mb-1">Initial Supply</div>
              <div className="text-white font-medium">
                {(launch.tokenomics.initialCirculation / 1000000).toFixed(1)}M {launch.symbol}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Total: {(launch.tokenomics.totalSupply / 1000000).toFixed(0)}M
              </div>
            </div>
          </div>
          
          {/* Social links */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(launch.links).map(([key, url]) => {
              if (!url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-xs bg-gray-900/50 text-gray-300 hover:text-white px-2 py-1 rounded-md transition-colors"
                >
                  <LinkIcon className="h-3 w-3 mr-1" />
                  {key}
                </a>
              );
            })}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 flex justify-between">
          {launch.status === 'upcoming' && (
            <>
              <Button variant="outline" className="flex-1 mr-2" onClick={() => handleSetReminder(launch)}>
                <Calendar className="mr-2 h-4 w-4" />
                Remind Me
              </Button>
              <Link href={`/chonkpad/${launch.id}`}>
                <Button variant="default" className="flex-1 bg-pink-600 hover:bg-pink-700">
                  <Rocket className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </Link>
            </>
          )}
          
          {launch.status === 'live' && (
            <>
              <Link href={`/chonkpad/${launch.id}`}>
                <Button variant="outline" className="flex-1 mr-2">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Details
                </Button>
              </Link>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700" 
                onClick={() => handleInvest(launch)}
              >
                <Rocket className="mr-2 h-4 w-4" />
                Invest Now
              </Button>
            </>
          )}
          
          {launch.status === 'ended' && (
            <Button className="w-full bg-gray-700 hover:bg-gray-600">
              <CheckCircle className="mr-2 h-4 w-4" />
              Sale Completed
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Rocket className="h-8 w-8 text-pink-400" />
            ChonkPad Launchpad
          </h1>
          <p className="text-gray-300">
            Discover and invest in the next generation of CHONK9K ecosystem projects.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            Upcoming
            {upcomingLaunches.length > 0 && (
              <span className="ml-1 px-1.5 bg-pink-900/50 text-pink-300 rounded-full text-xs">
                {upcomingLaunches.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="live" className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4" />
            Live
            {liveLaunches.length > 0 && (
              <span className="ml-1 px-1.5 bg-green-900/50 text-green-300 rounded-full text-xs">
                {liveLaunches.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="ended" className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4" />
            Ended
            {endedLaunches.length > 0 && (
              <span className="ml-1 px-1.5 bg-gray-800 text-gray-400 rounded-full text-xs">
                {endedLaunches.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingLaunches.map(renderLaunchCard)}
            
            {/* Explainer card */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Why Launch on ChonkPad?</CardTitle>
                <CardDescription className="text-gray-300">
                  The premier launchpad for the CHONK9K ecosystem
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-300">CHONK9K Community</h4>
                    <p className="text-sm text-gray-300">Access to a vibrant community of early adopters and crypto enthusiasts</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-pink-900 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-pink-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-pink-300">Vetted Projects</h4>
                    <p className="text-sm text-gray-300">All projects undergo rigorous technical and team validation</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-900 flex items-center justify-center">
                    <Rocket className="h-5 w-5 text-amber-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-300">Fair Distribution</h4>
                    <p className="text-sm text-gray-300">Guaranteed allocations with transparent token distribution</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-500/30 hover:bg-blue-900/30"
                  onClick={() => window.open('/apply-for-launch', '_blank')}
                >
                  Apply for Launch
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="live">
          {liveLaunches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveLaunches.map(renderLaunchCard)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Live Sales</h3>
              <p className="text-gray-400 max-w-md mb-6">
                There are no token sales currently live. Check back soon or browse upcoming launches.
              </p>
              <Button 
                onClick={() => setActiveTab('upcoming')}
                className="bg-pink-600 hover:bg-pink-700"
              >
                <Rocket className="mr-2 h-4 w-4" />
                View Upcoming
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="ended">
          {endedLaunches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {endedLaunches.map(renderLaunchCard)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Past Sales</h3>
              <p className="text-gray-400 max-w-md mb-6">
                There are no completed token sales yet. Check back soon as we launch more projects.
              </p>
              <Button 
                onClick={() => setActiveTab('upcoming')}
                className="bg-pink-600 hover:bg-pink-700"
              >
                <Rocket className="mr-2 h-4 w-4" />
                View Upcoming
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Platform stats */}
      <div className="mt-10 bg-gradient-to-r from-blue-900/20 to-pink-900/20 rounded-lg border border-pink-500/30 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">ChonkPad Platform Statistics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-black/40 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Total Projects</div>
            <div className="text-3xl font-bold text-white">{SAMPLE_LAUNCHES.length}</div>
            <div className="flex items-center mt-1 text-xs text-green-400">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+2 this month</span>
            </div>
          </div>
          
          <div className="bg-black/40 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Total Raised</div>
            <div className="text-3xl font-bold text-white">$1.95M</div>
            <div className="flex items-center mt-1 text-xs text-green-400">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+$400K this month</span>
            </div>
          </div>
          
          <div className="bg-black/40 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Unique Participants</div>
            <div className="text-3xl font-bold text-white">5,280</div>
            <div className="flex items-center mt-1 text-xs text-green-400">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+850 this month</span>
            </div>
          </div>
          
          <div className="bg-black/40 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Success Rate</div>
            <div className="text-3xl font-bold text-white">94%</div>
            <div className="flex items-center mt-1 text-xs text-amber-400">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+2% this month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChonkPad;