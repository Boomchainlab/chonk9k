import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BarChart, PieChart, LineChart, ArrowUpRight, Search, Filter, Trophy, Star } from 'lucide-react';

// Import the uploaded NFT images
import chonkyCosmosImage from '@assets/IMG_9298.png';
import learnWeb3BadgesImage from '@assets/IMG_9299.png';
import cyberChonkImage from '@assets/IMG_9297.png';

type NFTCollection = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  floorPrice: number;
  volume24h: number;
  owners: number;
  totalSupply: number;
  items: NFTItem[];
};

type NFTItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  lastPrice?: number;
};

interface NFTCollectionGalleryProps {
  userId: number;
  domainId?: number;
}

const collections = [
  {
    id: 'chonky-cosmos',
    name: 'Chonky Cosmos',
    description: 'Cosmic chonks on a galactic mission, unlocking lore, governance, and future perks.',
    imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/nft/chonky-cosmos.jpg',
    floorPrice: 0.029,
    volume24h: 1.245,
    owners: 42,
    totalSupply: 100,
    items: [
      {
        id: 'chonky-cosmos-6',
        name: 'Chonky Cosmos #6',
        description: 'Cosmic chonks on a galactic mission, unlocking lore, governance, and future perks.',
        imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/nft/chonky-cosmos-6.jpg',
        attributes: [
          { trait_type: 'Background', value: 'Deep Space' },
          { trait_type: 'Suit', value: 'Orange Explorer' },
          { trait_type: 'Helmet', value: 'Standard' },
          { trait_type: 'Rarity', value: 'Uncommon' }
        ],
        lastPrice: 0.03
      }
    ]
  },
  {
    id: 'learnweb3-badges',
    name: 'LearnWeb3 Badges',
    description: 'Educational achievement badges for Web3 learning progress and skill development.',
    imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/nft/learnweb3-badge.jpg',
    floorPrice: 0.01,
    volume24h: 0.35,
    owners: 156,
    totalSupply: 500,
    items: [
      {
        id: 'foundational-friend-1',
        name: 'Foundational Friend #1',
        description: 'Awarded for completing the Web3 Foundations course.',
        imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/nft/foundational-friend-1.jpg',
        attributes: [
          { trait_type: 'Type', value: 'Beginner Badge' },
          { trait_type: 'Course', value: 'Web3 Foundations' },
          { trait_type: 'Rarity', value: 'Common' }
        ]
      },
      {
        id: 'quick-study-516491',
        name: 'Quick Study #516491',
        description: 'Completed 5 lessons in under 3 days.',
        imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/nft/quick-study-516491.jpg',
        attributes: [
          { trait_type: 'Type', value: 'Achievement Badge' },
          { trait_type: 'Criteria', value: 'Speed Learning' },
          { trait_type: 'Rarity', value: 'Uncommon' }
        ]
      },
      {
        id: 'quick-study-516492',
        name: 'Quick Study #516492',
        description: 'Participated in 3 community events.',
        imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/nft/quick-study-516492.jpg',
        attributes: [
          { trait_type: 'Type', value: 'Achievement Badge' },
          { trait_type: 'Criteria', value: 'Community Participation' },
          { trait_type: 'Rarity', value: 'Uncommon' }
        ]
      },
      {
        id: 'newcomer-498248',
        name: 'Newcomer #498248',
        description: 'Successfully completed onboarding.',
        imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/nft/newcomer-498248.jpg',
        attributes: [
          { trait_type: 'Type', value: 'Welcome Badge' },
          { trait_type: 'Criteria', value: 'Platform Onboarding' },
          { trait_type: 'Rarity', value: 'Common' }
        ]
      }
    ]
  },
  {
    id: 'cyber-chonk',
    name: 'Cyber Chonk',
    description: 'Cyberpunk cats roaming the digital metropolis with crypto tech integration.',
    imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/nft/cyber-chonk.jpg',
    floorPrice: 0.02,
    volume24h: 0.86,
    owners: 28,
    totalSupply: 50,
    items: [
      {
        id: 'cyber-chonk-001-1',
        name: 'Cyber Chonk #001',
        description: 'The original Cyber Chonk, featuring all major blockchain logos.',
        imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/nft/cyber-chonk-001-1.jpg',
        attributes: [
          { trait_type: 'Background', value: 'Neon City' },
          { trait_type: 'Outfit', value: 'Crypto Suit' },
          { trait_type: 'Accessories', value: 'Multi-chain Halo' },
          { trait_type: 'Rarity', value: 'Legendary' }
        ],
        lastPrice: 0.02
      },
      {
        id: 'cyber-chonk-001-2',
        name: 'Cyber Chonk #001',
        description: 'The original Cyber Chonk, featuring all major blockchain logos.',
        imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/nft/cyber-chonk-001-2.jpg',
        attributes: [
          { trait_type: 'Background', value: 'Neon City' },
          { trait_type: 'Outfit', value: 'Crypto Suit' },
          { trait_type: 'Accessories', value: 'Multi-chain Halo' },
          { trait_type: 'Rarity', value: 'Legendary' }
        ],
        lastPrice: 0.02
      }
    ]
  }
];



// Use the uploaded NFT images
const getImageUrl = (url: string) => {
  // Map to the actual image assets based on collection type
  if (url.includes('chonky-cosmos')) {
    return '/attached_assets/IMG_9298.png';
  } else if (url.includes('learnweb3')) {
    return '/attached_assets/IMG_9299.png';
  } else if (url.includes('cyber-chonk')) {
    return '/attached_assets/IMG_9297.png';
  }
  
  // Fallback to default image if URL doesn't match any pattern
  return '/attached_assets/IMG_9297.png';
};

const formatCrypto = (value: number) => {
  return value.toFixed(3);
};

const NFTDetailDialog: React.FC<{ nft: NFTItem; collectionName: string }> = ({ nft, collectionName }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="absolute top-2 right-2 h-8 w-8 rounded-full p-0">
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{nft.name}</DialogTitle>
          <DialogDescription>{collectionName}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="rounded-md overflow-hidden border">
            <img 
              src={getImageUrl(nft.imageUrl)} 
              alt={nft.name} 
              className="w-full h-64 object-contain bg-black/5"
            />
          </div>
          
          <p className="text-sm text-muted-foreground">{nft.description}</p>
          
          {nft.lastPrice && (
            <div className="flex items-center">
              <span className="font-medium mr-2">Last sale:</span>
              <Badge variant="outline">{formatCrypto(nft.lastPrice)} ETH</Badge>
            </div>
          )}
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Attributes</h4>
            <div className="grid grid-cols-2 gap-2">
              {nft.attributes.map((attr, i) => (
                <div key={i} className="bg-muted p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">{attr.trait_type}</div>
                  <div className="font-medium">{attr.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CollectionDetailDialog: React.FC<{ collection: NFTCollection }> = ({ collection }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          View Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{collection.name}</DialogTitle>
          <DialogDescription>{collection.description}</DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="items" className="space-y-4 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Input
                  placeholder="Search items..."
                  className="h-9 w-[200px]"
                  type="search"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {collection.items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={getImageUrl(item.imageUrl)} 
                      alt={item.name} 
                      className="w-full h-36 object-cover"
                    />
                    <NFTDetailDialog nft={item} collectionName={collection.name} />
                  </div>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm truncate">{item.name}</CardTitle>
                  </CardHeader>
                  {item.lastPrice && (
                    <CardFooter className="p-3 pt-1 flex justify-between">
                      <span className="text-xs text-muted-foreground">Last sale</span>
                      <span className="text-xs font-medium">{formatCrypto(item.lastPrice)} ETH</span>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Floor Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCrypto(collection.floorPrice)} ETH</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">24h Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCrypto(collection.volume24h)} ETH</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Owners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-1">
                    <div className="text-2xl font-bold">{collection.owners}</div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {Math.round((collection.owners / collection.totalSupply) * 100)}% unique
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Supply</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{collection.totalSupply}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="pt-4">
            <div className="text-center p-8 border rounded-lg bg-muted/50">
              <p>Activity data will be available soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const NFTCollectionGallery: React.FC<NFTCollectionGalleryProps> = ({ userId, domainId }) => {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  
  // In a real implementation, we'd fetch collections related to the user's domains
  // For now, we'll use the mock data
  const userCollections = collections;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">NFT Collections</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Star className="h-3.5 w-3.5" />
            <span>Favorites</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Trophy className="h-3.5 w-3.5" />
            <span>Rankings</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userCollections.map((collection) => (
          <Card key={collection.id} className="overflow-hidden hover:border-primary/50 transition-colors">
            <div className="relative">
              <img 
                src={getImageUrl(collection.imageUrl)} 
                alt={collection.name} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div>
                  <div className="text-muted-foreground">Floor</div>
                  <div className="font-medium">{formatCrypto(collection.floorPrice)} ETH</div>
                </div>
                <div>
                  <div className="text-muted-foreground">24h Volume</div>
                  <div className="font-medium">{formatCrypto(collection.volume24h)} ETH</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Owners</div>
                  <div className="font-medium">{collection.owners}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Items</div>
                  <div className="font-medium">{collection.totalSupply}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <CollectionDetailDialog collection={collection} />
              <Button variant="outline">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAxNkMwIDcuMTYzIDcuMTYzIDAgMTYgMFYwQzI0LjgzNyAwIDMyIDcuMTYzIDMyIDE2VjE2QzMyIDI0LjgzNyAyNC44MzcgMzIgMTYgMzJWMzJDNy4xNjMgMzIgMCAyNC44MzcgMCAxNlYxNloiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xXzMyKSIvPjxwYXRoIGQ9Ik0yMi45MDA2IDE2LjA2OThDMjIuOTAwNiAxMi4yMzI0IDE5Ljc5MTkgOS4xMjM5NyAxNS45NTM1IDkuMTIzOTdDMTIuMTE1MSA5LjEyMzk3IDkuMDA2MDEgMTIuMjMyNSA5LjAwNjAxIDE2LjA2OThDOS4wMDYwMSAxOS4zMzM1IDExLjI0MTkgMjIuMDQzMyAxNC4zMTYgMjIuODc2M1YxOC41OTE3SDEyLjUwNDJWMTYuMDY5OEgxNC4zMTZWMTQuMDk4NkMxNC4zMTYgMTIuMDAwNCAxNS41MzYxIDEwLjg2ODIgMTcuNDUyMyAxMC44NjgyQzE4LjM2MzggMTAuODY4MiAxOS4zMTI4IDExLjA2MTQgMTkuMzEyOCAxMS4wNjE0VjEyLjgwOTRIMTguMjc1MkMxNy4yNDk4IDEyLjgwOTQgMTYuOTM0NiAxMy40NzA1IDE2LjkzNDYgMTQuMTQ0OVYxNi4wNjk4SDE5LjIwOTdMMTguODQ1MSAxOC41OTE3SDE2LjkzNDZWMjIuODc2M0MyMC4wMDg2IDIyLjA0MzMgMjIuOTAwNiAxOS4zMzM0IDIyLjkwMDYgMTYuMDY5OFoiIGZpbGw9IndoaXRlIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzFfMzIiIHgxPSIxNiIgeTE9IjAiIHgyPSIxNiIgeTI9IjMyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzE4QUNGQSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAyODhEMSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==" 
                  alt="OpenSea" 
                  className="w-4 h-4 mr-2"
                />
                View on OpenSea
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NFTCollectionGallery;
