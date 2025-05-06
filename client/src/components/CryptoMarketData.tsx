import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Percent,
  DollarSign,
  BarChart3,
  Globe,
  ExternalLink
} from "lucide-react";

// Define prop types for the component
interface CryptoMarketDataProps {
  tokenSymbol: string;
}

// Format numbers for display
const formatNumber = (num: number, decimals: number = 2) => {
  if (num === undefined || num === null) return "N/A";
  
  // Handle very large numbers
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(decimals)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(decimals)}M`;
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(decimals)}K`;
  }
  
  return `$${num.toFixed(decimals)}`;
};

// Format percentage for display
const formatPercent = (percent: number) => {
  if (percent === undefined || percent === null) return "N/A";
  return `${percent.toFixed(2)}%`;
};

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export default function CryptoMarketData({ tokenSymbol }: CryptoMarketDataProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch token data from CoinMarketCap API
  const { data: tokenData, isLoading: tokenLoading, error: tokenError } = useQuery({
    queryKey: ['/api/crypto/search', tokenSymbol],
    queryFn: () => fetch(`/api/crypto/search/${tokenSymbol}`).then(res => res.json()),
    refetchInterval: 60000, // Refresh every minute
    enabled: !!tokenSymbol,
  });
  
  // Fetch market pairs data
  const { data: marketPairsData, isLoading: pairsLoading } = useQuery({
    queryKey: ['/api/crypto/market-pairs', tokenSymbol],
    queryFn: () => fetch(`/api/crypto/market-pairs/${tokenSymbol}`).then(res => res.json()),
    refetchInterval: 300000, // Refresh every 5 minutes
    enabled: !!tokenSymbol && activeTab === "exchanges",
  });
  
  // Fetch marketplace listings from our database
  const { data: marketplaceListings, isLoading: listingsLoading } = useQuery({
    queryKey: ['/api/marketplace/listings'],
    queryFn: () => fetch('/api/marketplace/listings?active=true').then(res => res.json()),
    enabled: activeTab === "exchanges",
  });
  
  // Extract token data and chart data from API response
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    if (tokenData && tokenData.data && tokenData.data[tokenSymbol]) {
      const token = tokenData.data[tokenSymbol];
      setTokenInfo(token);
      
      // Prepare chart data (using sample data for now)
      // In a real implementation, you would use historical data from the API
      const priceData = [
        { name: '1d', value: token.quote.USD.percent_change_24h },
        { name: '7d', value: token.quote.USD.percent_change_7d },
        { name: '30d', value: token.quote.USD.percent_change_30d },
        { name: '60d', value: token.quote.USD.percent_change_60d },
        { name: '90d', value: token.quote.USD.percent_change_90d },
      ];
      setChartData(priceData);
    }
  }, [tokenData, tokenSymbol]);
  
  // Loading state
  if (tokenLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (tokenError) {
    return (
      <Card className="bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Market Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Unable to fetch market data for {tokenSymbol}. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
  
  // If token info is not available
  if (!tokenInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{tokenSymbol} Market Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Token information for {tokenSymbol} is not yet available on CoinMarketCap.
            Check back later for real-time market data.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Valid data - Token has been found
  const usdData = tokenInfo.quote.USD;
  const priceChangeColor = usdData.percent_change_24h >= 0 ? "text-green-500" : "text-red-500";
  const priceChangeIcon = usdData.percent_change_24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {tokenInfo.name} ({tokenInfo.symbol})
            <Badge variant="outline" className="ml-2">Rank #{tokenInfo.cmc_rank}</Badge>
          </div>
          <div className={`flex items-center gap-1 ${priceChangeColor}`}>
            {priceChangeIcon}
            {formatPercent(usdData.percent_change_24h)}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-card p-3">
                <div className="text-muted-foreground flex items-center text-xs mb-1">
                  <DollarSign className="h-3 w-3 mr-1" /> Price
                </div>
                <div className="text-xl font-bold">{formatNumber(usdData.price, usdData.price < 1 ? 8 : 2)}</div>
              </div>
              
              <div className="rounded-lg bg-card p-3">
                <div className="text-muted-foreground flex items-center text-xs mb-1">
                  <BarChart3 className="h-3 w-3 mr-1" /> Market Cap
                </div>
                <div className="text-xl font-bold">{formatNumber(usdData.market_cap)}</div>
              </div>
              
              <div className="rounded-lg bg-card p-3">
                <div className="text-muted-foreground flex items-center text-xs mb-1">
                  <Percent className="h-3 w-3 mr-1" /> 7d Change
                </div>
                <div className={`text-xl font-bold ${usdData.percent_change_7d >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {formatPercent(usdData.percent_change_7d)}
                </div>
              </div>
              
              <div className="rounded-lg bg-card p-3">
                <div className="text-muted-foreground flex items-center text-xs mb-1">
                  <Globe className="h-3 w-3 mr-1" /> Volume (24h)
                </div>
                <div className="text-xl font-bold">{formatNumber(usdData.volume_24h)}</div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Token Information</h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Market Cap</TableCell>
                    <TableCell>{formatNumber(usdData.market_cap)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Circulating Supply</TableCell>
                    <TableCell>{tokenInfo.circulating_supply.toLocaleString()} {tokenInfo.symbol}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Supply</TableCell>
                    <TableCell>
                      {tokenInfo.total_supply ? tokenInfo.total_supply.toLocaleString() : "∞"} {tokenInfo.symbol}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Max Supply</TableCell>
                    <TableCell>
                      {tokenInfo.max_supply ? tokenInfo.max_supply.toLocaleString() : "∞"} {tokenInfo.symbol}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">All-Time High</TableCell>
                    <TableCell>Coming soon</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Listed Since</TableCell>
                    <TableCell>{formatDate(tokenInfo.date_added)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Charts Tab */}
          <TabsContent value="charts">
            <div className="p-1">
              <h3 className="text-lg font-medium mb-3">Price Change</h3>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(2)}%`, 'Change']}
                      labelFormatter={(label) => `Period: ${label}`}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="currentColor"
                      className="fill-primary"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Period Changes</h4>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">1h</TableCell>
                        <TableCell className={usdData.percent_change_1h >= 0 ? "text-green-500" : "text-red-500"}>
                          {formatPercent(usdData.percent_change_1h)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">24h</TableCell>
                        <TableCell className={usdData.percent_change_24h >= 0 ? "text-green-500" : "text-red-500"}>
                          {formatPercent(usdData.percent_change_24h)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">7d</TableCell>
                        <TableCell className={usdData.percent_change_7d >= 0 ? "text-green-500" : "text-red-500"}>
                          {formatPercent(usdData.percent_change_7d)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Extended Changes</h4>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">30d</TableCell>
                        <TableCell className={usdData.percent_change_30d >= 0 ? "text-green-500" : "text-red-500"}>
                          {formatPercent(usdData.percent_change_30d)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">60d</TableCell>
                        <TableCell className={usdData.percent_change_60d >= 0 ? "text-green-500" : "text-red-500"}>
                          {formatPercent(usdData.percent_change_60d)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">90d</TableCell>
                        <TableCell className={usdData.percent_change_90d >= 0 ? "text-green-500" : "text-red-500"}>
                          {formatPercent(usdData.percent_change_90d)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Exchanges Tab */}
          <TabsContent value="exchanges">
            {(pairsLoading || listingsLoading) ? (
              <div className="flex justify-center p-8">
                <p>Loading exchange data...</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-3">Available on Exchanges</h3>
                
                {marketplaceListings && marketplaceListings.length > 0 ? (
                  <div className="space-y-3">
                    {marketplaceListings.map((listing: any) => (
                      <div key={listing.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-md overflow-hidden">
                            <img 
                              src={listing.logo} 
                              alt={listing.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{listing.name}</h4>
                            <p className="text-sm text-muted-foreground">Pair: {listing.tradingPair}</p>
                          </div>
                        </div>
                        <a 
                          href={listing.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-primary hover:underline"
                        >
                          Trade <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-muted-foreground">
                      No official marketplaces or exchanges are currently listed for {tokenSymbol}.
                      Check back soon for updated listings.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}