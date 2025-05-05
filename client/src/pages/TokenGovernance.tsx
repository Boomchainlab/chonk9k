import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Check, CheckCircle2, Clock, Users, VoteIcon, BarChart, FileText, AlertTriangle, ChevronRight, ArrowUpRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChonkWallet } from '@/hooks/useChonkWallet';

// Import attached DAO logo images
import voteMarketStakeDaoLogo from '@assets/votemarket-stake-dao.png';
import lobbyDaoLogo from '@assets/lobby-dao.png';

// Define types for DAO proposals
type ProposalStatus = 'active' | 'passed' | 'rejected' | 'pending';

interface Proposal {
  id: number;
  title: string;
  description: string;
  author: string;
  authorAddress: string;
  status: ProposalStatus;
  createdAt: string;
  endsAt: string;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  category: 'treasury' | 'development' | 'community' | 'other';
  discussion: string;
}

// Mock data for proposals
const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 1,
    title: 'Launch CHONK 9000 DEX on Solana',
    description: 'Allocate 5% of treasury to fund development of a native CHONK 9000 DEX on Solana with custom staking features.',
    author: 'davidokeamah.sol',
    authorAddress: '2Lp2SGS9AKYVKCorizjzJLPHn4swatnbvEQ2UB2bKorJy',
    status: 'active',
    createdAt: '2025-05-01T14:00:00Z',
    endsAt: '2025-05-08T14:00:00Z',
    votesFor: 12500000,
    votesAgainst: 4200000,
    totalVotes: 16700000,
    category: 'development',
    discussion: 'https://forum.chonk9k.io/proposal/1'
  },
  {
    id: 2,
    title: 'Increase Marketing Budget for Q3 2025',
    description: 'Increase monthly marketing budget from 1M to 2.5M CHONK 9000 tokens to fund expansion into Asian markets.',
    author: 'chonkwhale.sol',
    authorAddress: '3JP7Ki29sFGu3YvCPTMcuqQMMvdKuRCvB5QVYQCaSwTD',
    status: 'passed',
    createdAt: '2025-04-22T10:30:00Z',
    endsAt: '2025-04-29T10:30:00Z',
    votesFor: 35600000,
    votesAgainst: 8200000,
    totalVotes: 43800000,
    category: 'treasury',
    discussion: 'https://forum.chonk9k.io/proposal/2'
  },
  {
    id: 3,
    title: 'Implement CHONK 9000 NFT Integration',
    description: 'Develop smart contract integration to allow CHONK 9000 holders to claim exclusive NFTs with utility in the ecosystem.',
    author: 'boomchaindao.sol',
    authorAddress: '7zDa4xbJYv6SsfaFedD2pKesN9pzcGzxtKMQW9LxtDgF',
    status: 'rejected',
    createdAt: '2025-04-15T08:45:00Z',
    endsAt: '2025-04-22T08:45:00Z',
    votesFor: 9800000,
    votesAgainst: 22400000,
    totalVotes: 32200000,
    category: 'community',
    discussion: 'https://forum.chonk9k.io/proposal/3'
  },
  {
    id: 4,
    title: 'Establish Cross-Chain DAO Structure',
    description: 'Create multi-sig governance structure that allows voting with CHONK 9000 tokens across Solana, Base, and Ethereum networks.',
    author: 'davidokeamah.sol',
    authorAddress: '2Lp2SGS9AKYVKCorizjzJLPHn4swatnbvEQ2UB2bKorJy',
    status: 'pending',
    createdAt: '2025-05-03T16:20:00Z',
    endsAt: '2025-05-10T16:20:00Z',
    votesFor: 0,
    votesAgainst: 0,
    totalVotes: 0,
    category: 'other',
    discussion: 'https://forum.chonk9k.io/proposal/4'
  }
];

// Define types for DAO stats
interface DaoStats {
  totalMembers: number;
  totalProposals: number;
  activeProposals: number;
  votingPower: number;
  treasuryValue: number;
  participationRate: number;
  tokenStaked: number;
}

// Mock data for DAO stats
const DAO_STATS: DaoStats = {
  totalMembers: 4728,
  totalProposals: 37,
  activeProposals: 2,
  votingPower: 2500000,
  treasuryValue: 125000000,
  participationRate: 72.4,
  tokenStaked: 385000000
};

// Delegate types and data
interface Delegate {
  address: string;
  name: string;
  votingPower: number;
  proposals: number;
  participation: number;
}

const TOP_DELEGATES: Delegate[] = [
  {
    address: '2Lp2SGS9AKYVKCorizjzJLPHn4swatnbvEQ2UB2bKorJy',
    name: 'davidokeamah.sol',
    votingPower: 85000000,
    proposals: 12,
    participation: 100
  },
  {
    address: '3JP7Ki29sFGu3YvCPTMcuqQMMvdKuRCvB5QVYQCaSwTD',
    name: 'chonkwhale.sol',
    votingPower: 62500000,
    proposals: 8,
    participation: 95
  },
  {
    address: '7zDa4xbJYv6SsfaFedD2pKesN9pzcGzxtKMQW9LxtDgF',
    name: 'boomchaindao.sol',
    votingPower: 45000000,
    proposals: 6,
    participation: 88
  }
];

// Utility function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Utility function to calculate time remaining
const getTimeRemaining = (endsAt: string): string => {
  const endTime = new Date(endsAt).getTime();
  const now = new Date().getTime();
  const diff = endTime - now;
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  }
  
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m remaining`;
};

// Status Badge Component
const StatusBadge: React.FC<{ status: ProposalStatus }> = ({ status }) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-blue-500 hover:bg-blue-600">Active</Badge>;
    case 'passed':
      return <Badge className="bg-green-500 hover:bg-green-600">Passed</Badge>;
    case 'rejected':
      return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
    case 'pending':
      return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
    default:
      return null;
  }
};

// Category Badge Component
const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  switch (category) {
    case 'treasury':
      return <Badge variant="outline" className="border-yellow-400 text-yellow-500">Treasury</Badge>;
    case 'development':
      return <Badge variant="outline" className="border-purple-400 text-purple-500">Development</Badge>;
    case 'community':
      return <Badge variant="outline" className="border-green-400 text-green-500">Community</Badge>;
    default:
      return <Badge variant="outline" className="border-gray-400 text-gray-500">Other</Badge>;
  }
};

// Proposal Card Component
const ProposalCard: React.FC<{ proposal: Proposal }> = ({ proposal }) => {
  const { toast } = useToast();
  const { isConnected } = useChonkWallet();
  
  const voteForPercentage = (proposal.votesFor / proposal.totalVotes) * 100 || 0;
  
  const handleVote = (vote: 'for' | 'against') => {
    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to vote on proposals.',
        variant: 'destructive'
      });
      return;
    }
    
    if (proposal.status !== 'active') {
      toast({
        title: 'Voting Unavailable',
        description: `This proposal is ${proposal.status} and no longer accepts votes.`,
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Vote Registered',
      description: `You voted ${vote} proposal #${proposal.id}`,
    });
  };
  
  return (
    <Card className="mb-6 overflow-hidden border-muted hover:border-muted-foreground/50 transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex gap-2 mb-1">
              <StatusBadge status={proposal.status} />
              <CategoryBadge category={proposal.category} />
            </div>
            <CardTitle className="text-xl">{proposal.title}</CardTitle>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-0.5">#{proposal.id}</p>
            {proposal.status === 'active' && (
              <p className="text-sm text-muted-foreground flex items-center justify-end">
                <Clock className="h-3 w-3 mr-1" />
                {getTimeRemaining(proposal.endsAt)}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center mb-3">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarFallback>{proposal.author.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{proposal.author}</span>
        </div>
        <p className="text-muted-foreground">{proposal.description}</p>
        
        {proposal.totalVotes > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>For: {formatNumber(proposal.votesFor)} CHONK 9000</span>
              <span>Against: {formatNumber(proposal.votesAgainst)} CHONK 9000</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${voteForPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{voteForPercentage.toFixed(1)}%</span>
              <span>Total Votes: {formatNumber(proposal.totalVotes)}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(proposal.discussion, '_blank')}
            className="text-xs flex items-center"
          >
            <FileText className="h-3 w-3 mr-1" />
            View Discussion
          </Button>
          
          {proposal.status === 'active' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote('against')}
                className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Against
              </Button>
              <Button 
                size="sm"
                onClick={() => handleVote('for')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                For
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

// Main page component
const TokenGovernance: React.FC = () => {
  const { account, connectWallet, isConnected } = useChonkWallet();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('proposals');
  
  const handleCreateProposal = () => {
    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to create a proposal.',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Coming Soon',
      description: 'Proposal creation will be available after DAO launch in June 2025.',
    });
  };
  
  // Filter proposals based on status
  const activeProposals = MOCK_PROPOSALS.filter(p => p.status === 'active');
  const pendingProposals = MOCK_PROPOSALS.filter(p => p.status === 'pending');
  const passedProposals = MOCK_PROPOSALS.filter(p => p.status === 'passed');
  const rejectedProposals = MOCK_PROPOSALS.filter(p => p.status === 'rejected');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              CHONK 9000 DAO Governance
            </h1>
          </div>
          <p className="text-muted-foreground">
            Participate in the decentralized governance of CHONK 9000. Vote on proposals, delegate voting power, and help shape the future of the protocol.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                DAO Membership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold">{DAO_STATS.totalMembers.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{DAO_STATS.participationRate}%</p>
                  <p className="text-sm text-muted-foreground">Participation</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <VoteIcon className="h-5 w-5 mr-2 text-green-500" />
                Voting Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold">{DAO_STATS.totalProposals}</p>
                  <p className="text-sm text-muted-foreground">Total Proposals</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{DAO_STATS.activeProposals}</p>
                  <p className="text-sm text-muted-foreground">Active Proposals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-purple-500" />
                Treasury
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold">{formatNumber(DAO_STATS.treasuryValue)}</p>
                  <p className="text-sm text-muted-foreground">CHONK 9000 Value</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{formatNumber(DAO_STATS.tokenStaked)}</p>
                  <p className="text-sm text-muted-foreground">Tokens Staked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* User Voting Card - Only show when connected */}
        {isConnected && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your DAO Membership</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
                  <p className="font-medium">{account?.address.substring(0, 6)}...{account?.address.substring(account.address.length - 4)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Voting Power</p>
                  <p className="font-medium">{formatNumber(DAO_STATS.votingPower)} CHONK 9000</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Delegation Status</p>
                  <p className="font-medium flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                    Self-delegated
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Partners */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Official DAO Partners</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <img src={voteMarketStakeDaoLogo} alt="Vote Market DAO" className="h-12 w-12" />
            <img src={lobbyDaoLogo} alt="Lobby DAO" className="h-12 w-12" />
          </div>
        </div>
        
        {/* Proposals Tab Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">DAO Proposals</h2>
            <p className="text-muted-foreground">View and vote on active governance proposals</p>
          </div>
          <Button 
            onClick={handleCreateProposal}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Create Proposal
          </Button>
        </div>
        
        <Tabs defaultValue="active" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active" className="relative">
              Active
              {activeProposals.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeProposals.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
            </TabsTrigger>
            <TabsTrigger value="passed">
              Passed
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeProposals.length > 0 ? (
              activeProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No active proposals at this time.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleCreateProposal}
                  >
                    Submit a Proposal
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="pending">
            {pendingProposals.length > 0 ? (
              pendingProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No pending proposals at this time.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="passed">
            {passedProposals.length > 0 ? (
              passedProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No passed proposals to display.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="rejected">
            {rejectedProposals.length > 0 ? (
              rejectedProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No rejected proposals to display.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Delegates Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Top Delegates</h2>
              <p className="text-muted-foreground">Community members with significant voting power</p>
            </div>
            <Button variant="outline">
              View All Delegates
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOP_DELEGATES.map((delegate, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{delegate.name}</CardTitle>
                    <Badge variant="outline" className="border-purple-200 text-purple-600">
                      Rank #{index + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Voting Power:</span>
                      <span className="font-medium">{formatNumber(delegate.votingPower)} CHONK 9000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Proposals Created:</span>
                      <span className="font-medium">{delegate.proposals}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Participation:</span>
                      <span className="font-medium">{delegate.participation}%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" size="sm">
                    Delegate Votes
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Documentation Section */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">DAO Governance Guide</h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to effectively participate in CHONK 9000 governance. Understand voting mechanisms, proposal thresholds, and delegation.
                </p>
                <div className="space-y-2">
                  <a href="#" className="text-primary flex items-center hover:underline">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    How to Create a Proposal
                  </a>
                  <a href="#" className="text-primary flex items-center hover:underline">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Voting Power Calculation
                  </a>
                  <a href="#" className="text-primary flex items-center hover:underline">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Delegate Voting Rights
                  </a>
                </div>
                <Button className="mt-4" variant="outline">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TokenGovernance;
