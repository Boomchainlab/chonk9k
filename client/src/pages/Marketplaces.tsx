import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Globe, TrendingUp, Sparkles } from "lucide-react";
import CryptoMarketData from "@/components/CryptoMarketData";
import NftCollectionCard from "@/components/NftCollectionCard";

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function Marketplaces() {
  const [activeTab, setActiveTab] = useState("token");
  
  // Fetch marketplace listings from our database
  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['/api/marketplace/listings'],
    queryFn: () => fetch('/api/marketplace/listings?active=true').then(res => res.json()),
  });

  // Filter NFT collections and exchange listings
  const nftCollections = listings?.filter((listing: any) => 
    listing.name.includes('NFT') || listing.trading_pair.includes('CYBER')
  ) || [];
  
  const exchangeListings = listings?.filter((listing: any) => 
    !listing.name.includes('NFT') && !listing.trading_pair.includes('CYBER')
  ) || [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplaces & Exchanges</h1>
          <p className="text-muted-foreground mt-2">
            Track $Chonk9k token listings and market data across various exchanges.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="token">Token Market Data</TabsTrigger>
            <TabsTrigger value="exchanges">Exchange Listings</TabsTrigger>
            <TabsTrigger value="nft" className="relative">
              NFT Collections
              <Badge variant="secondary" className="absolute -top-2 -right-2 px-1.5 py-0 text-[10px] h-4">
                New
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          {/* Token Market Data Tab */}
          <TabsContent value="token" className="mt-6">
            <CryptoMarketData tokenSymbol="CHONK9K" />
          </TabsContent>
          
          {/* Exchange Listings Tab */}
          <TabsContent value="exchanges" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                <p>Loading exchange listings...</p>
              ) : error ? (
                <p className="text-red-500">Error loading exchange listings</p>
              ) : exchangeListings.length > 0 ? (
                exchangeListings.map((listing: any) => (
                  <Card key={listing.id} className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 overflow-hidden rounded-md">
                          <img 
                            src={listing.logo} 
                            alt={listing.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardTitle className="text-xl">{listing.name}</CardTitle>
                      </div>
                      <Button variant="outline" size="icon" asChild>
                        <a href={listing.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Trading Pair:</span>
                          <span className="font-medium">{listing.trading_pair}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Listed Since:</span>
                          <span>{formatDate(listing.listed_date)}</span>
                        </div>
                        {listing.description && (
                          <p className="text-sm text-muted-foreground pt-2">
                            {listing.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="border-t bg-muted/50 px-6 py-3">
                      <a 
                        href={listing.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center space-x-2 text-primary"
                      >
                        <TrendingUp className="h-4 w-4" />
                        <span>Trade on {listing.name}</span>
                      </a>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <Globe className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Exchange Listings Yet</h3>
                  <p className="text-muted-foreground mt-2">
                    $Chonk9k is not yet listed on any exchanges. Check back soon for updates!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* NFT Collections Tab */}
          <TabsContent value="nft" className="mt-6">
            <div className="rounded-lg border border-primary/10 bg-primary/5 p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Cyber Chonk NFT Collections</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Explore exclusive Chonk9k NFT collections with unique utilities and benefits for holders. 
                NFT owners receive special privileges in the Chonk9k ecosystem including enhanced mining rewards and governance rights.
              </p>
              <p className="text-xs text-primary mt-2">Contract address: HMZK29UWMs3UotWymZtpNvuWi1bKLsD13vQQCcG9Bzaa</p>
            </div>

            {isLoading ? (
              <p>Loading NFT collections...</p>
            ) : error ? (
              <p className="text-red-500">Error loading NFT collections</p>
            ) : nftCollections.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {nftCollections.map((collection: any) => (
                  <NftCollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <Globe className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No NFT Collections Yet</h3>
                <p className="text-muted-foreground mt-2">
                  No Chonk9k NFT collections are available yet. Check back soon for upcoming drops!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}