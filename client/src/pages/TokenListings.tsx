import React, { useState } from 'react';
import { Link } from 'wouter';
import { ChainType, WalletType } from '@/lib/walletTypes';
import { ArrowLeft, Plus, ArrowUpRight, Tag, BarChart3, DollarSign, Users, Star, CheckCircle, Lock, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useChonkWallet } from '@/hooks/useChonkWallet';
import { Label } from '@/components/ui/label';

// Define token types
interface Token {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  description: string;
  blockchain: 'ethereum' | 'solana' | 'base' | 'other';
  contractAddress: string;
  website: string;
  twitter: string;
  telegram: string;
  launchDate: string;
  marketCap?: number;
  price?: number;
  change24h?: number;
  totalSupply: number;
  circulatingSupply?: number;
  status: 'listed' | 'pending' | 'rejected';
  featured: boolean;
  tags: string[];
  createdAt: string;
  holders?: number;
  category: 'meme' | 'defi' | 'gaming' | 'nft' | 'dao' | 'other';
}

// Mock token data
const MOCK_TOKENS: Token[] = [
  {
    id: 'chonk9k',
    name: 'CHONK 9000',
    symbol: 'CHONK9K',
    logo: '/images/chonk9k-logo.png',
    description: 'The official token of the CHONK9K ecosystem, merging cyberpunk aesthetics with meme culture.',
    blockchain: 'solana',
    contractAddress: '51ey1T4UCFwb8poVBwyiLwwi1KdNTrZ8rSg7kBRmqray',
    website: 'https://chonk9k.io',
    twitter: 'https://twitter.com/chonk9k',
    telegram: 'https://t.me/chonk9k',
    launchDate: '2025-05-01',
    marketCap: 7500000,
    price: 0.00075,
    change24h: 12.8,
    totalSupply: 1000000000,
    circulatingSupply: 450000000,
    status: 'listed',
    featured: true,
    tags: ['cyberpunk', 'cat', 'meme', 'community'],
    createdAt: '2025-05-01T12:00:00Z',
    holders: 3450,
    category: 'meme'
  },
  {
    id: 'pepe-token',
    name: 'Pepe Token',
    symbol: 'PEPE',
    logo: '/images/pepe-logo.png',
    description: 'The most iconic meme-inspired cryptocurrency, celebrating the internet\'s favorite frog.',
    blockchain: 'ethereum',
    contractAddress: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
    website: 'https://www.pepe.com',
    twitter: 'https://twitter.com/pepecoinofficial',
    telegram: 'https://t.me/pepecoinofficial',
    launchDate: '2023-04-18',
    marketCap: 345000000,
    price: 0.00000089,
    change24h: -2.5,
    totalSupply: 420690000000000,
    circulatingSupply: 420690000000000,
    status: 'listed',
    featured: true,
    tags: ['frog', 'meme', 'community'],
    createdAt: '2023-04-18T10:00:00Z',
    holders: 124000,
    category: 'meme'
  },
  {
    id: 'degen-coin',
    name: 'Degen Coin',
    symbol: 'DEGEN',
    logo: '/images/degen-logo.png',
    description: 'A token for the true degens of the crypto space, built for high-risk tolerance traders.',
    blockchain: 'base',
    contractAddress: '0x4c4a2f8c81640e47606d3fd77b353e87ba6028e5',
    website: 'https://degencoin.finance',
    twitter: 'https://twitter.com/degencoin',
    telegram: 'https://t.me/degencoin',
    launchDate: '2025-03-15',
    marketCap: 2100000,
    price: 0.0042,
    change24h: 5.7,
    totalSupply: 1000000000,
    circulatingSupply: 500000000,
    status: 'listed',
    featured: false,
    tags: ['trading', 'meme', 'finance'],
    createdAt: '2025-03-15T08:30:00Z',
    holders: 2100,
    category: 'meme'
  },
  {
    id: 'mooncat',
    name: 'MoonCat',
    symbol: 'MCAT',
    logo: '/images/mooncat-logo.png',
    description: 'A community-driven feline token built for NFT enthusiasts and cat lovers.',
    blockchain: 'solana',
    contractAddress: '8KJx1Ho2LMx4KqJLxYXQgM5vuTXMBXZswdXv7ghBGHY6',
    website: 'https://mooncat.fun',
    twitter: 'https://twitter.com/mooncattoken',
    telegram: 'https://t.me/mooncatofficial',
    launchDate: '2025-04-01',
    marketCap: 890000,
    price: 0.000089,
    change24h: 34.2,
    totalSupply: 10000000000,
    circulatingSupply: 5000000000,
    status: 'listed',
    featured: false,
    tags: ['cat', 'moon', 'nft', 'meme'],
    createdAt: '2025-04-01T15:45:00Z',
    holders: 1250,
    category: 'meme'
  },
  {
    id: 'sushi-dog',
    name: 'Sushi Dog',
    symbol: 'SDOG',
    logo: '/images/sushi-dog-logo.png',
    description: 'A delightful blend of Japanese culture and dog memes, with DeFi staking rewards.',
    blockchain: 'ethereum',
    contractAddress: '0x9c5321fc81cdb8d914c311fdb8c982e1fa888c1b',
    website: 'https://sushidog.io',
    twitter: 'https://twitter.com/sushidogtoken',
    telegram: 'https://t.me/sushidogcommunity',
    launchDate: '2025-02-10',
    marketCap: 1350000,
    price: 0.000027,
    change24h: -8.9,
    totalSupply: 100000000000,
    circulatingSupply: 50000000000,
    status: 'listed',
    featured: false,
    tags: ['dog', 'food', 'japanese', 'meme'],
    createdAt: '2025-02-10T09:15:00Z',
    holders: 3800,
    category: 'meme'
  },
  {
    id: 'robo-shib',
    name: 'Robo Shiba',
    symbol: 'RSHIB',
    logo: '/images/robo-shib-logo.png',
    description: 'A futuristic take on the Shiba meme coin, with AI-powered staking and NFT rewards.',
    blockchain: 'solana',
    contractAddress: '9YNkA2BgHZ9zSJP3F7TzRJt2hTvY6ib968qjAiqXBEZL',
    website: 'https://roboshiba.tech',
    twitter: 'https://twitter.com/roboshibatoken',
    telegram: 'https://t.me/roboshibaofficial',
    launchDate: '2025-03-05',
    totalSupply: 1000000000000,
    status: 'pending',
    featured: false,
    tags: ['robot', 'dog', 'ai', 'meme'],
    createdAt: '2025-05-03T14:30:00Z',
    category: 'meme'
  }
];

// Format utilities
const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toString();
};

const formatPrice = (price: number): string => {
  if (price < 0.00001) {
    return price.toExponential(4);
  }
  return price.toFixed(price < 0.01 ? 6 : 4);
};

// Token Card component
const TokenCard: React.FC<{ token: Token }> = ({ token }) => {
  return (
    <Card className="overflow-hidden border-muted hover:border-muted-foreground/50 transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-md">
              <AvatarImage src={token.logo} alt={token.name} />
              <AvatarFallback className="rounded-md bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                {token.symbol.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{token.name}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-muted-foreground">{token.symbol}</span>
                {token.featured && (
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    <Star className="h-3 w-3 mr-1" fill="currentColor" strokeWidth={0} />
                    Featured
                  </Badge>
                )}
                {token.blockchain === 'ethereum' && (
                  <Badge variant="outline" className="border-blue-400/30 text-blue-500">
                    Ethereum
                  </Badge>
                )}
                {token.blockchain === 'solana' && (
                  <Badge variant="outline" className="border-purple-400/30 text-purple-500">
                    Solana
                  </Badge>
                )}
                {token.blockchain === 'base' && (
                  <Badge variant="outline" className="border-blue-400/30 text-blue-500">
                    Base
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {token.price && token.change24h && (
            <div className="text-right">
              <div className="text-xl font-bold">${formatPrice(token.price)}</div>
              <div className={`text-sm ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{token.description}</p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {token.marketCap && (
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">MCap:</span>
              <span className="font-medium">${formatNumber(token.marketCap)}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground mr-1">Supply:</span>
            <span className="font-medium">{formatNumber(token.totalSupply)}</span>
          </div>
          
          {token.holders && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">Holders:</span>
              <span className="font-medium">{formatNumber(token.holders)}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground mr-1">Launch:</span>
            <span className="font-medium">{new Date(token.launchDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {token.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="bg-muted/50">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-3">
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-2">
            {token.twitter && (
              <a href={token.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-400 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
            
            {token.telegram && (
              <a href={token.telegram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-500 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.62-2.58 2.68-2.8.01-.03.01-.14-.05-.2s-.16-.05-.23-.03c-.1.03-1.58 1.08-4.48 3.17-.42.33-.8.49-1.15.48-.38-.01-1.1-.22-1.64-.4-.66-.23-1.19-.35-1.14-.74.02-.2.3-.4.81-.6 3.17-1.49 5.3-2.47 6.38-2.96 3.03-1.33 3.66-1.56 4.08-1.57.09 0 .29.02.42.19.11.13.13.3.15.43-.01.06-.01.1-.02.15z" />
                </svg>
              </a>
            )}
            
            {token.website && (
              <a href={token.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </a>
            )}
          </div>
          
          <Button size="sm" variant="outline" className="gap-1">
            <Link href={`/token-details/${token.id}`} className="flex items-center">
              View Details
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Token Submission Form Component
const TokenSubmissionForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { toast } = useToast();
  const { isConnected } = useChonkWallet();
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    blockchain: '',
    contractAddress: '',
    website: '',
    twitter: '',
    telegram: '',
    launchDate: '',
    totalSupply: '',
    tags: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to submit a token.',
        variant: 'destructive'
      });
      return;
    }
    
    // Validate form
    if (!formData.name || !formData.symbol || !formData.blockchain || !formData.contractAddress) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill out all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    // Submit token (mock)
    toast({
      title: 'Token Submitted',
      description: 'Your token has been submitted for review. You will be notified once it is approved.',
      variant: 'default',
    });
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Token Name *</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Pepe Token" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="symbol">Token Symbol *</Label>
          <Input id="symbol" name="symbol" value={formData.symbol} onChange={handleChange} placeholder="e.g. PEPE" required />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          placeholder="Brief description of your token" 
          required 
          className="min-h-24"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="blockchain">Blockchain *</Label>
          <Select 
            value={formData.blockchain} 
            onValueChange={(value) => handleSelectChange('blockchain', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blockchain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="solana">Solana</SelectItem>
              <SelectItem value="base">Base</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contractAddress">Contract Address *</Label>
          <Input 
            id="contractAddress" 
            name="contractAddress" 
            value={formData.contractAddress} 
            onChange={handleChange} 
            placeholder="Token contract address" 
            required 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input 
            id="website" 
            name="website" 
            value={formData.website} 
            onChange={handleChange} 
            placeholder="https://yourtoken.com" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="launchDate">Launch Date</Label>
          <Input 
            id="launchDate" 
            name="launchDate" 
            type="date" 
            value={formData.launchDate} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter</Label>
          <Input 
            id="twitter" 
            name="twitter" 
            value={formData.twitter} 
            onChange={handleChange} 
            placeholder="https://twitter.com/yourtoken" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="telegram">Telegram</Label>
          <Input 
            id="telegram" 
            name="telegram" 
            value={formData.telegram} 
            onChange={handleChange} 
            placeholder="https://t.me/yourtoken" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalSupply">Total Supply</Label>
          <Input 
            id="totalSupply" 
            name="totalSupply" 
            value={formData.totalSupply} 
            onChange={handleChange} 
            placeholder="e.g. 1000000000" 
            type="number" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input 
            id="tags" 
            name="tags" 
            value={formData.tags} 
            onChange={handleChange} 
            placeholder="e.g. meme, dog, defi" 
          />
        </div>
      </div>
      
      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Submit Token</Button>
      </div>
    </form>
  );
};

// Main component
const TokenListings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);
  const { toast } = useToast();
  const { isConnected, connectWallet } = useChonkWallet();
  
  // Filter tokens based on active tab
  const filteredTokens = MOCK_TOKENS.filter(token => {
    if (activeTab === 'all') return token.status === 'listed';
    if (activeTab === 'meme') return token.category === 'meme' && token.status === 'listed';
    if (activeTab === 'featured') return token.featured && token.status === 'listed';
    if (activeTab === 'solana') return token.blockchain === 'solana' && token.status === 'listed';
    if (activeTab === 'ethereum') return token.blockchain === 'ethereum' && token.status === 'listed';
    if (activeTab === 'base') return token.blockchain === 'base' && token.status === 'listed';
    return true;
  });
  
  const handleSubmitClick = () => {
    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to submit a token.',
        variant: 'destructive'
      });
      connectWallet('metamask', 'evm');
    } else {
      setIsSubmitFormOpen(true);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center mb-2">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="mr-2">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                  Token Listings
                </h1>
              </div>
              <p className="text-muted-foreground">
                Discover and explore the latest trending tokens across multiple blockchains.
              </p>
            </div>
            
            <Dialog open={isSubmitFormOpen} onOpenChange={setIsSubmitFormOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleSubmitClick}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Your Token
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Submit Your Token for Listing</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to submit your token for review. Our team will verify the information and list your token within 24-48 hours.
                  </DialogDescription>
                </DialogHeader>
                <TokenSubmissionForm onClose={() => setIsSubmitFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Highlighted Token Listing Rules */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 mb-6">
            <CardContent className="p-4 flex items-start">
              <div className="bg-purple-100 rounded-full p-2 mr-4">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-md font-bold mb-1">Token Listing Guidelines</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Before submitting your token, please ensure it meets our listing requirements:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                    <span>Valid, verified contract address</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                    <span>Liquidity locked for at least 3 months</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                    <span>Working website and social links</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                    <span>Minimum market cap of $10,000</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Featured token */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold">Featured Token</h2>
            <Badge className="ml-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
              <Award className="h-3 w-3 mr-1" />
              Promoted
            </Badge>
          </div>
          
          <Card className="overflow-hidden border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32 rounded-xl">
                    <AvatarImage src="/images/pepe-logo.png" alt="Pepe Token" />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xl">
                      PEPE
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">Pepe Token</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-muted-foreground">PEPE</span>
                        <Badge variant="outline" className="border-blue-400/30 text-blue-500">
                          Ethereum
                        </Badge>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                          Meme
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 text-center md:text-right">
                      <div className="text-2xl font-bold">$0.00000089</div>
                      <div className="text-red-500 text-sm">-2.5%</div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    The most iconic meme-inspired cryptocurrency, celebrating the internet's favorite frog. Pepe Token has grown to become one of the top meme tokens by market capitalization, with a strong and passionate community backing its growth and development.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div className="bg-white/50 rounded-lg p-3">
                      <div className="text-muted-foreground mb-1">Market Cap</div>
                      <div className="text-lg font-bold">$345M</div>
                    </div>
                    
                    <div className="bg-white/50 rounded-lg p-3">
                      <div className="text-muted-foreground mb-1">Total Supply</div>
                      <div className="text-lg font-bold">420.69T</div>
                    </div>
                    
                    <div className="bg-white/50 rounded-lg p-3">
                      <div className="text-muted-foreground mb-1">Holders</div>
                      <div className="text-lg font-bold">124K</div>
                    </div>
                    
                    <div className="bg-white/50 rounded-lg p-3">
                      <div className="text-muted-foreground mb-1">Launch Date</div>
                      <div className="text-lg font-bold">Apr 18, 2023</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <a href="https://twitter.com/pepecoinofficial" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                      
                      <a href="https://t.me/pepecoinofficial" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.62-2.58 2.68-2.8.01-.03.01-.14-.05-.2s-.16-.05-.23-.03c-.1.03-1.58 1.08-4.48 3.17-.42.33-.8.49-1.15.48-.38-.01-1.1-.22-1.64-.4-.66-.23-1.19-.35-1.14-.74.02-.2.3-.4.81-.6 3.17-1.49 5.3-2.47 6.38-2.96 3.03-1.33 3.66-1.56 4.08-1.57.09 0 .29.02.42.19.11.13.13.3.15.43-.01.06-.01.1-.02.15z" />
                        </svg>
                      </a>
                      
                      <a href="https://www.pepe.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </a>
                    </div>
                    
                    <Button className="bg-green-600 hover:bg-green-700 text-white gap-1">
                      <Link href="/token-details/pepe-token" className="flex items-center">
                        View Details
                        <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs and token listings */}
        <div className="mb-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all">All Tokens</TabsTrigger>
              <TabsTrigger value="meme">Meme Tokens</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="solana">Solana</TabsTrigger>
              <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
              <TabsTrigger value="base">Base</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Token listings grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTokens.map(token => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
        
        {/* Submission banner */}
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-blue-200 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-indigo-100 rounded-full p-4">
                <Lock className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Want your token featured?</h3>
                <p className="text-muted-foreground mb-4">
                  Get premium placement for your token on our homepage with enhanced visibility to thousands of potential investors.
                </p>
              </div>
              <div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Apply for Featured Listing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TokenListings;
