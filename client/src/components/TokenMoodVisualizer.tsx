import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type TokenMood = 
  | 'ecstatic' // >10%
  | 'happy'    // 5-10%
  | 'optimistic' // 1-5%
  | 'neutral'   // -1% to 1%
  | 'concerned' // -1% to -5%
  | 'worried'   // -5% to -10%
  | 'panic'     // <-10%;

interface TokenMoodVisualizerProps {
  timeframe?: 'day' | 'week' | 'month';
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  customClass?: string;
}

const TokenMoodVisualizer: React.FC<TokenMoodVisualizerProps> = ({
  timeframe = 'day',
  size = 'md',
  showDetails = true,
  customClass = '',
}) => {
  const [mood, setMood] = useState<TokenMood>('neutral');
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
  const [animating, setAnimating] = useState(false);
  const [timeframeState, setTimeframe] = useState<'day' | 'week' | 'month'>(timeframe);
  
  // When parent component changes the timeframe prop, update our internal state
  useEffect(() => {
    setTimeframe(timeframe);
  }, [timeframe]);

  // Fetch token price data from CoinMarketCap API wrapper
  const { data: tokenData, isLoading, error } = useQuery<any>({
    queryKey: ['/api/crypto/search/CHONK9K'],
    staleTime: 60000, // Refresh data every 60 seconds
  });

  // Determine mood based on price change percentage
  useEffect(() => {    
    if (tokenData?.data?.CHONK9K) {
      const priceData = tokenData.data.CHONK9K;
      let change: number;

      // Select the appropriate timeframe
      if (timeframeState === 'day') {
        change = priceData.quote?.USD?.percent_change_24h || 0;
      } else if (timeframeState === 'week') {
        change = priceData.quote?.USD?.percent_change_7d || 0;
      } else {
        change = priceData.quote?.USD?.percent_change_30d || 0;
      }
      
      setPriceChangePercent(change);
      setMood(determineMood(change));

      // Trigger animation when mood changes
      setAnimating(true);
      setTimeout(() => setAnimating(false), 1000);
    }
  }, [tokenData, timeframeState]);

  const determineMood = (changePercent: number): TokenMood => {
    if (changePercent > 10) return 'ecstatic';
    if (changePercent > 5) return 'happy';
    if (changePercent > 1) return 'optimistic';
    if (changePercent >= -1) return 'neutral';
    if (changePercent >= -5) return 'concerned';
    if (changePercent >= -10) return 'worried';
    return 'panic';
  };

  const getMoodEmoji = (mood: TokenMood): string => {
    switch(mood) {
      case 'ecstatic': return '🚀';
      case 'happy': return '😄';
      case 'optimistic': return '😊';
      case 'neutral': return '😐';
      case 'concerned': return '🙁';
      case 'worried': return '😨';
      case 'panic': return '😱';
      default: return '😐';
    }
  };

  const getMoodColor = (mood: TokenMood): string => {
    switch(mood) {
      case 'ecstatic': return 'text-fuchsia-500';
      case 'happy': return 'text-green-500';
      case 'optimistic': return 'text-emerald-400';
      case 'neutral': return 'text-blue-400';
      case 'concerned': return 'text-yellow-500';
      case 'worried': return 'text-amber-500';
      case 'panic': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getMoodBgColor = (mood: TokenMood): string => {
    switch(mood) {
      case 'ecstatic': return 'bg-fuchsia-100 dark:bg-fuchsia-950';
      case 'happy': return 'bg-green-100 dark:bg-green-950';
      case 'optimistic': return 'bg-emerald-100 dark:bg-emerald-950';
      case 'neutral': return 'bg-blue-100 dark:bg-blue-950';
      case 'concerned': return 'bg-yellow-100 dark:bg-yellow-950';
      case 'worried': return 'bg-amber-100 dark:bg-amber-950';
      case 'panic': return 'bg-red-100 dark:bg-red-950';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const getMoodBorderColor = (mood: TokenMood): string => {
    switch(mood) {
      case 'ecstatic': return 'border-fuchsia-300 dark:border-fuchsia-800';
      case 'happy': return 'border-green-300 dark:border-green-800';
      case 'optimistic': return 'border-emerald-300 dark:border-emerald-800';
      case 'neutral': return 'border-blue-300 dark:border-blue-800';
      case 'concerned': return 'border-yellow-300 dark:border-yellow-800';
      case 'worried': return 'border-amber-300 dark:border-amber-800';
      case 'panic': return 'border-red-300 dark:border-red-800';
      default: return 'border-gray-300 dark:border-gray-700';
    }
  };

  const getMoodText = (mood: TokenMood): string => {
    switch(mood) {
      case 'ecstatic': return 'Ecstatic';
      case 'happy': return 'Happy';
      case 'optimistic': return 'Optimistic';
      case 'neutral': return 'Neutral';
      case 'concerned': return 'Concerned';
      case 'worried': return 'Worried';
      case 'panic': return 'Panic';
      default: return 'Unknown';
    }
  };

  const getMoodDescription = (mood: TokenMood): string => {
    switch(mood) {
      case 'ecstatic': return 'CHONK9K is mooning! All systems go! 🚀';
      case 'happy': return 'CHONK9K is on a strong uptrend. HODLers rejoice!';
      case 'optimistic': return 'CHONK9K is showing positive momentum. Things are looking good!';
      case 'neutral': return 'CHONK9K is stable. The market is in equilibrium.';
      case 'concerned': return 'CHONK9K is experiencing a slight dip. Keep an eye on the market.';
      case 'worried': return 'CHONK9K is in a downtrend. Market sentiment is negative.';
      case 'panic': return 'CHONK9K is experiencing significant losses. High volatility detected!';
      default: return 'Market status unknown.';
    }
  };

  const getAnimationClass = (mood: TokenMood): string => {
    if (!animating) return '';
    
    switch(mood) {
      case 'ecstatic': return 'animate-bounce';
      case 'happy': return 'animate-pulse';
      case 'optimistic': return 'animate-pulse';
      case 'neutral': return '';
      case 'concerned': return 'animate-pulse';
      case 'worried': return 'animate-pulse';
      case 'panic': return 'animate-ping';
      default: return '';
    }
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Dynamic sizing classes
  const sizeClasses = {
    sm: 'p-4 text-xl',
    md: 'p-6 text-3xl',
    lg: 'p-8 text-5xl'
  };

  if (isLoading) {
    return (
      <Card className={cn('shadow-lg', customClass)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-center">CHONK9K Mood-o-Meter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn('shadow-lg bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800', customClass)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-red-600 dark:text-red-400">Error Loading Mood</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6">
            <div className="text-4xl mb-4">😵</div>
            <p className="text-red-600 dark:text-red-400 text-center">Unable to fetch token price data. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('shadow-lg', customClass)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>CHONK9K Mood-o-Meter</CardTitle>
          <Badge variant="outline" className={getMoodColor(mood)}>
            {getMoodText(mood)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeframe">Timeframe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual" className="space-y-4">
            <div 
              className={cn(
                'flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-300 space-y-4',
                getMoodBgColor(mood),
                getMoodBorderColor(mood),
                sizeClasses[size]
              )}
            >
              <div className={cn('transition-all', getAnimationClass(mood))}>
                <div className={cn('text-center mb-2', getMoodColor(mood))}>
                  {getMoodEmoji(mood)}
                </div>
                <div className="text-center font-bold mb-1">
                  {getMoodText(mood)}
                </div>
              </div>
              
              {showDetails && (
                <div className="text-center">
                  <div className={`text-lg font-semibold ${priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPercentage(priceChangePercent)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {timeframeState === 'day' ? '24hr' : timeframeState === 'week' ? '7d' : '30d'} change
                  </p>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{getMoodDescription(mood)}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 border rounded-lg">
                <h3 className="font-medium">Current Price</h3>
                <div className="text-2xl font-bold">
                  ${tokenData?.data?.CHONK9K?.quote?.USD?.price?.toFixed(8) || '0.00'}
                </div>
              </div>
              
              <div className="space-y-2 p-4 border rounded-lg">
                <h3 className="font-medium">Market Cap</h3>
                <div className="text-2xl font-bold">
                  ${tokenData?.data?.CHONK9K?.quote?.USD?.market_cap?.toLocaleString() || '0'}
                </div>
              </div>
              
              <div className="space-y-2 p-4 border rounded-lg">
                <h3 className="font-medium">24h Trading Volume</h3>
                <div className="text-2xl font-bold">
                  ${tokenData?.data?.CHONK9K?.quote?.USD?.volume_24h?.toLocaleString() || '0'}
                </div>
              </div>
              
              <div className="space-y-2 p-4 border rounded-lg">
                <h3 className="font-medium">Circulating Supply</h3>
                <div className="text-2xl font-bold">
                  {tokenData?.data?.CHONK9K?.circulating_supply?.toLocaleString() || '0'} CHONK9K
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-3">Mood Analysis</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {getMoodDescription(mood)}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm">Updated: {new Date().toLocaleTimeString()}</span>
                <Badge variant="secondary" className={getMoodColor(mood)}>
                  {getMoodText(mood)}
                </Badge>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="timeframe" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => timeframeState !== 'day' && setTimeframe('day')}
                className={cn(
                  'p-4 border rounded-lg transition-all hover:bg-muted',
                  timeframeState === 'day' ? 'border-primary bg-primary/10' : ''
                )}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">24 Hours</span>
                  <Badge variant="outline">
                    {formatPercentage(tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_24h || 0)}
                  </Badge>
                </div>
              </button>
              
              <button 
                onClick={() => timeframeState !== 'week' && setTimeframe('week')}
                className={cn(
                  'p-4 border rounded-lg transition-all hover:bg-muted',
                  timeframeState === 'week' ? 'border-primary bg-primary/10' : ''
                )}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">7 Days</span>
                  <Badge variant="outline">
                    {formatPercentage(tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_7d || 0)}
                  </Badge>
                </div>
              </button>
              
              <button 
                onClick={() => timeframeState !== 'month' && setTimeframe('month')}
                className={cn(
                  'p-4 border rounded-lg transition-all hover:bg-muted',
                  timeframeState === 'month' ? 'border-primary bg-primary/10' : ''
                )}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">30 Days</span>
                  <Badge variant="outline">
                    {formatPercentage(tokenData?.data?.CHONK9K?.quote?.USD?.percent_change_30d || 0)}
                  </Badge>
                </div>
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TokenMoodVisualizer;