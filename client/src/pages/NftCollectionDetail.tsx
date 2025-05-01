import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  ArrowLeft, 
  Copy, 
  Check,
  Sparkles,
  Shield,
  Rocket,
  Zap,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function NftCollectionDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const { data: collection, isLoading, error } = useQuery({
    queryKey: [`/api/marketplace/listings/${id}`],
    queryFn: () => fetch(`/api/marketplace/listings/${id}`).then(res => res.json()),
    enabled: !!id,
  });
  
  const contractAddress = 'HMZK29UWMs3UotWymZtpNvuWi1bKLsD13vQQCcG9Bzaa';
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    toast({
      title: 'Address copied!',
      description: 'Contract address copied to clipboard',
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  // NFT collection benefits
  const benefits: Benefit[] = [
    {
      title: 'Staking Boosts',
      description: 'NFT holders receive up to 25% higher APR when staking $CHONK9K tokens',
      icon: <Sparkles className="h-5 w-5 text-primary" />
    },
    {
      title: 'Governance Rights',
      description: 'Vote on important project decisions and future development priorities',
      icon: <Shield className="h-5 w-5 text-primary" />
    },
    {
      title: 'Priority Features',
      description: 'Early access to new Chonk9k features and platform updates',
      icon: <Rocket className="h-5 w-5 text-primary" />
    },
    {
      title: 'Mining Advantages',
      description: 'Exclusive access to premium mining rigs with higher hash rates',
      icon: <Zap className="h-5 w-5 text-primary" />
    },
    {
      title: 'Community Perks',
      description: 'Access to private community channels and exclusive events',
      icon: <Users className="h-5 w-5 text-primary" />
    }
  ];
  
  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading collection details...</div>;
  }
  
  if (error || !collection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Error Loading Collection</h1>
        <p className="text-muted-foreground">Unable to load the NFT collection details.</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => setLocation('/marketplaces')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplaces
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => setLocation('/marketplaces')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplaces
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="md:col-span-2">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-md overflow-hidden bg-primary/10">
                  <img 
                    src={collection.logo} 
                    alt={collection.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-2xl">{collection.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">
                      {collection.trading_pair}
                    </Badge>
                    <Badge variant={collection.status === 'active' ? 'default' : 'outline'}>
                      {collection.status === 'active' ? 'Live' : 'Coming Soon'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">About this Collection</h3>
                <p className="text-muted-foreground">{collection.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Contract Address</h3>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md overflow-x-auto">
                  <code className="text-xs md:text-sm">{contractAddress}</code>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="shrink-0" 
                    onClick={handleCopyAddress}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-4">Utility & Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <Card key={index} className="bg-primary/5 border-primary/10">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {benefit.icon}
                          <h4 className="font-medium">{benefit.title}</h4>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t bg-muted/50 flex justify-end gap-2 p-4">
              <Button asChild>
                <a href={collection.url} target="_blank" rel="noopener noreferrer">
                  View on Solana Explorer <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Collection Stats</CardTitle>
              <CardDescription>Statistics for Cyber Chonk NFT</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Total Supply</p>
                  <p className="text-lg font-medium">9,000</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Holders</p>
                  <p className="text-lg font-medium">1,242</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Floor Price</p>
                  <p className="text-lg font-medium">0.5 SOL</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Volume</p>
                  <p className="text-lg font-medium">1,248 SOL</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Mint Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mint Price:</span>
                    <span>2.5 SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mint Date:</span>
                    <span>May 15, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge>Completed</Badge>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Rarity Tiers</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm">Common</span>
                    </span>
                    <span className="text-sm">60%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Rare</span>
                    </span>
                    <span className="text-sm">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm">Epic</span>
                    </span>
                    <span className="text-sm">10%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="text-sm">Legendary</span>
                    </span>
                    <span className="text-sm">5%</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-center p-4">
              <Button variant="outline" className="w-full" asChild>
                <a 
                  href="https://magiceden.io/marketplace/solana" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View on Magic Eden
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}