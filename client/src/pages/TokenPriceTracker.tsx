import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowDown, ArrowUp, Clock, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { getHistoricalPriceData, TokenPriceDataPoint } from '../lib/solanaMonitorService';

const formatPrice = (price: number) => {
  return price.toLocaleString(undefined, {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8
  });
};

const formatMarketCap = (marketCap: number) => {
  if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toFixed(2)}M`;
  }
  if (marketCap >= 1000) {
    return `$${(marketCap / 1000).toFixed(2)}K`;
  }
  return `$${marketCap.toFixed(2)}`;
};

const formatVolume = (volume: number) => {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(2)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K`;
  }
  return volume.toFixed(2);
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateWithDay = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const TokenPriceTracker: React.FC = () => {
  const [priceData, setPriceData] = useState<TokenPriceDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPriceData = async (selectedTimeframe: 'day' | 'week' | 'month') => {
    try {
      setLoading(true);
      const data = await getHistoricalPriceData(selectedTimeframe);
      setPriceData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching price data:', err);
      setError('Failed to load price data. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load price data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceData(timeframe);
  }, [timeframe]);

  const handleRefresh = () => {
    fetchPriceData(timeframe);
    toast({
      title: 'Refreshing',
      description: 'Fetching the latest price data',
    });
  };

  // Calculate price change percentage
  const calculatePriceChange = () => {
    if (priceData.length < 2) return { value: 0, percentage: 0 };
    
    const firstPrice = priceData[0].price;
    const lastPrice = priceData[priceData.length - 1].price;
    
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;
    
    return { value: change, percentage };
  };

  const priceChange = calculatePriceChange();
  const isPositive = priceChange.percentage >= 0;

  // Format time based on selected timeframe
  const formatChartTime = (timestamp: number) => {
    switch (timeframe) {
      case 'day':
        return formatDate(timestamp);
      case 'week':
      case 'month':
        return formatDateWithDay(timestamp);
      default:
        return formatDate(timestamp);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CHONK9K Price Tracker</h1>
          <p className="text-muted-foreground">
            Monitor price trends and market activity
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Price Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">
                  ${priceData.length > 0 ? formatPrice(priceData[priceData.length - 1].price) : '0.00000000'}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Price Change</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="flex items-center space-x-2">
                {isPositive ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {priceChange.percentage.toFixed(2)}%
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">
                  {priceData.length > 0 ? formatMarketCap(priceData[priceData.length - 1].marketCap) : '$0'}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Price Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle>Price Chart</CardTitle>
              <CardDescription>
                CHONK9K price history on Solana
              </CardDescription>
            </div>
            <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
              <TabsList>
                <TabsTrigger value="day">24h</TabsTrigger>
                <TabsTrigger value="week">7d</TabsTrigger>
                <TabsTrigger value="month">30d</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="w-full h-[350px] flex items-center justify-center">
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : error ? (
            <div className="w-full h-[350px] flex flex-col items-center justify-center">
              <p className="text-red-500">{error}</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => fetchPriceData(timeframe)}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={priceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatChartTime} 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--muted))' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value.toFixed(8)}`} 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--muted))' }}
                    tickCount={6}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(8)}`, 'Price']}
                    labelFormatter={(timestamp) => formatChartTime(timestamp as number)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#priceGradient)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Volume</CardTitle>
          <CardDescription>
            CHONK9K trading volume over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="w-full h-[250px] flex items-center justify-center">
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : error ? (
            <div className="w-full h-[250px] flex flex-col items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatChartTime}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--muted))' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatVolume(value)}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--muted))' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatVolume(value), 'Volume']}
                    labelFormatter={(timestamp) => formatChartTime(timestamp as number)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Bar 
                    dataKey="volume" 
                    fill="hsl(var(--primary))" 
                    opacity={0.8}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenPriceTracker;
