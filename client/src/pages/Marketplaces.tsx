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
import { ExternalLink, Globe, TrendingUp } from "lucide-react";
import CryptoMarketData from "@/components/CryptoMarketData";

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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="token">Token Market Data</TabsTrigger>
            <TabsTrigger value="exchanges">Exchange Listings</TabsTrigger>
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
              ) : listings && Array.isArray(listings) && listings.length > 0 ? (
                listings.map((listing: any) => (
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
                          <span className="font-medium">{listing.tradingPair}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Listed Since:</span>
                          <span>{formatDate(listing.listedDate)}</span>
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
        </Tabs>
      </div>
    </div>
  );
}