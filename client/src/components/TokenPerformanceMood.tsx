import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import ChonkMoodIndicator from './ChonkMoodIndicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TokenPerformanceMoodProps {
  className?: string;
}

const TokenPerformanceMood: React.FC<TokenPerformanceMoodProps> = ({ className = '' }) => {
  // Fetch token price data from CoinMarketCap API wrapper
  const { data: tokenData, isLoading } = useQuery({
    queryKey: ['/api/crypto/search/CHONK9K'],
    staleTime: 60000, // Refresh data every 60 seconds
  });

  const formatPercentage = (value: number | undefined): string => {
    if (value === undefined) return '0.00%';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getPercentageColor = (value: number | undefined): string => {
    if (value === undefined) return 'text-muted-foreground';
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  // Format the timestamp from the API
  const getFormattedTimestamp = (): string => {
    if (!tokenData?.status?.timestamp) return 'Unknown';
    try {
      const date = new Date(tokenData.status.timestamp);
      return date.toLocaleString();
    } catch (e) {
      return tokenData.status.timestamp;
    }
  };

  // Format price with appropriate decimals
  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return '$0.00';
    
    // If price is very small (less than 0.01), show more decimal places
    if (price < 0.01) {
      return `$${price.toFixed(8)}`;
    }
    
    // Otherwise show standard 2 decimal places
    return `$${price.toFixed(2)}`;
  };

  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-center">CHONK9K Token Performance</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-around mb-6">
          {/* Large Chonk Mood Indicator */}
          <div className="mb-4 sm:mb-0">
            <ChonkMoodIndicator size="lg" />
          </div>
          
          {/* Current Price and Change */}
          <div className="text-center">
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-40 mx-auto mb-2" />
                <Skeleton className="h-6 w-28 mx-auto" />
              </>
            ) : (
              <>
                <div className="text-3xl font-bold">
                  {formatPrice(tokenData?.data?.CHONK9K?.quote?.USD?.price)}
                </div>
                <div className={`text-lg font-medium ${getPercentageColor(tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_24h)}`}>
                  {formatPercentage(tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_24h)} (24h)
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Performance Tabs */}
        <Tabs defaultValue="trends">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends">Price Trends</TabsTrigger>
            <TabsTrigger value="details">Market Details</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          </TabsList>
          
          {/* Price Trends Tab */}
          <TabsContent value="trends" className="space-y-4 pt-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">1 Hour Change</div>
                  <div className={`font-medium ${getPercentageColor(tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_1h)}`}>
                    {formatPercentage(tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_1h)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">24 Hour Change</div>
                  <div className={`font-medium ${getPercentageColor(tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_24h)}`}>
                    {formatPercentage(tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_24h)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">7 Day Change</div>
                  <div className={`font-medium ${getPercentageColor(tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_7d)}`}>
                    {formatPercentage(tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_7d)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">30 Day Change</div>
                  <div className={`font-medium ${getPercentageColor(tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_30d)}`}>
                    {formatPercentage(tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_30d)}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Market Details Tab */}
          <TabsContent value="details" className="space-y-4 pt-4">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Market Cap</div>
                  <div className="font-medium">
                    ${tokenData?.data?.CHONK9K?.quote?.USD?.market_cap?.toLocaleString() || '0'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">24h Volume</div>
                  <div className="font-medium">
                    ${tokenData?.data?.CHONK9K?.quote?.USD?.volume_24h?.toLocaleString() || '0'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Circulating Supply</div>
                  <div className="font-medium">
                    {tokenData?.data?.CHONK9K?.circulating_supply?.toLocaleString() || '0'} CHONK9K
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Total Supply</div>
                  <div className="font-medium">
                    {tokenData?.data?.CHONK9K?.total_supply?.toLocaleString() || '0'} CHONK9K
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Sentiment Tab */}
          <TabsContent value="sentiment" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Mood Based on Price Action</span>
                <div className="flex items-center space-x-2">
                  <ChonkMoodIndicator size="sm" showDetails={false} />
                  <span className="text-sm font-medium">
                    {tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_24h >= 5 ? 'Bullish' :
                      tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_24h <= -5 ? 'Bearish' : 'Neutral'}
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground text-right">
                Last updated: {getFormattedTimestamp()}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TokenPerformanceMood;
