import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Clock, Droplets, ExternalLink, Percent, RefreshCw, TrendingUp } from 'lucide-react';
import { getEnhancedLiquidityPools, EnhancedLiquidityPool } from '../lib/solanaMonitorService';

const formatLargeNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toFixed(2);
};

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatPercentage = (num: number) => {
  return `${num.toFixed(2)}%`;
};

const formatTime = (timestamp: number) => {
  // Get the time difference in minutes
  const diff = Math.floor((Date.now() - timestamp) / (1000 * 60));
  
  if (diff < 1) {
    return 'just now';
  }
  if (diff < 60) {
    return `${diff} ${diff === 1 ? 'min' : 'mins'} ago`;
  }
  
  const hours = Math.floor(diff / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? 'day' : 'days'} ago`;
};

const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'raydium':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'orca':
      return 'bg-green-500 hover:bg-green-600';
    case 'jupiter':
      return 'bg-purple-500 hover:bg-purple-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

const LiquidityPools: React.FC = () => {
  const [pools, setPools] = useState<EnhancedLiquidityPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPools = async () => {
    try {
      setLoading(true);
      const liquidityPools = await getEnhancedLiquidityPools();
      setPools(liquidityPools);
      setError(null);
    } catch (err) {
      console.error('Error fetching liquidity pools:', err);
      setError('Failed to load liquidity pools. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load liquidity pools',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  const handleRefresh = () => {
    fetchPools();
    toast({
      title: 'Refreshing',
      description: 'Fetching the latest liquidity pool data',
    });
  };

  const openExplorer = (address: string) => {
    window.open(`https://solscan.io/account/${address}`, '_blank');
  };

  // Calculate total locked value across all pools
  const totalLockedValue = pools.reduce((total, pool) => total + pool.totalValueLocked, 0);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CHONK9K Liquidity Pools</h1>
          <p className="text-muted-foreground">
            View active liquidity pools and their performance
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pools</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{pools.length}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{formatCurrency(totalLockedValue)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best APR</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">
                  {pools.length > 0 ? formatPercentage(Math.max(...pools.map(p => p.apr || 0))) : '0.00%'}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Liquidity Pools Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Liquidity Pools</CardTitle>
          <CardDescription>
            All active CHONK9K liquidity pools across DEXes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            // Loading skeleton
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="p-4 text-center">
              <p className="text-red-500">{error}</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={fetchPools}
              >
                Try Again
              </Button>
            </div>
          ) : pools.length === 0 ? (
            // Empty state
            <div className="p-4 text-center">
              <p className="text-muted-foreground">
                No liquidity pools found
              </p>
            </div>
          ) : (
            // Pools table
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>Pair</TableHead>
                    <TableHead className="text-right">TVL</TableHead>
                    <TableHead className="text-right">APR</TableHead>
                    <TableHead className="text-right">24h Volume</TableHead>
                    <TableHead className="text-right">Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pools.map((pool) => (
                    <TableRow key={pool.id}>
                      <TableCell>
                        <Badge className={getPlatformColor(pool.platform)}>
                          {pool.platform}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">CHONK9K/{pool.pairedTokenSymbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatLargeNumber(pool.tokenAmount)} CHONK9K / {formatLargeNumber(pool.pairedTokenAmount)} {pool.pairedTokenSymbol}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(pool.totalValueLocked)}
                      </TableCell>
                      <TableCell className="text-right">
                        {pool.apr ? formatPercentage(pool.apr) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {pool.volume24h ? formatCurrency(pool.volume24h) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formatTime(pool.lastUpdated)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openExplorer(pool.address)}
                          title="View on Solscan"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t bg-muted/50 p-2">
          <div className="text-xs text-muted-foreground w-full text-center">
            Data may be delayed. APR values are estimates and subject to change based on market conditions.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LiquidityPools;
