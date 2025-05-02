import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ArrowDown, ArrowUp, ArrowUpRight, ChevronRight,
  Activity, BarChart3, Coins, DollarSign,
  ExternalLink, ListFilter, Loader2, Wallet, Droplets, Layers,
} from 'lucide-react';
import {
  getHistoricalPriceData, getRecentTokenTransactions,
  getEnhancedLiquidityPools, getTopTokenHolders,
  monitorTokenTransactions, TokenTransaction
} from '../lib/solanaMonitorService';
import { getBaseTransactions, EnhancedBaseTransaction } from '../lib/baseMonitorService';

const formatPrice = (price: number) => {
  return price.toLocaleString(undefined, {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8
  });
};

const formatAddress = (address?: string) => {
  if (!address) return '-';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const formatTimestamp = (timestamp: number) => {
  if (!timestamp) return '-';
  return new Date(timestamp * 1000).toLocaleString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
};

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'transfer':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'mint':
      return 'bg-green-500 hover:bg-green-600';
    case 'burn':
      return 'bg-red-500 hover:bg-red-600';
    case 'swap':
      return 'bg-purple-500 hover:bg-purple-600';
    case 'liquidity':
      return 'bg-amber-500 hover:bg-amber-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

const SolanaMonitor: React.FC = () => {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [holdings, setHoldings] = useState<{ holders: number, percentageHeld: number }>({ holders: 0, percentageHeld: 0 });
  const [liquidity, setLiquidity] = useState<{ pools: number, totalValueLocked: number }>({ pools: 0, totalValueLocked: 0 });
  const [priceLoading, setPriceLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [holdingsLoading, setHoldingsLoading] = useState(true);
  const [liquidityLoading, setLiquidityLoading] = useState(true);
  const [liveTx, setLiveTx] = useState<TokenTransaction[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPriceData();
    fetchTransactions();
    fetchHoldings();
    fetchLiquidity();

    // Set up transaction monitoring
    const stopMonitoring = monitorTokenTransactions((transaction) => {
      // Add new transaction to live feed
      setLiveTx(prev => [transaction, ...prev].slice(0, 5));
      
      // Show toast notification
      toast({
        title: `New ${transaction.type} Transaction`,
        description: `${transaction.amount.toLocaleString()} CHONK9K ${transaction.type === 'transfer' ? 'transferred' : transaction.type + 'ed'}`,
      });
    });

    return () => {
      // Clean up monitoring when component unmounts
      stopMonitoring();
    };
  }, []);

  const fetchPriceData = async () => {
    try {
      setPriceLoading(true);
      const data = await getHistoricalPriceData('day');
      setPriceData(data);
    } catch (error) {
      console.error('Error fetching price data:', error);
    } finally {
      setPriceLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setTransactionsLoading(true);
      const txs = await getRecentTokenTransactions(10);
      setTransactions(txs);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const fetchHoldings = async () => {
    try {
      setHoldingsLoading(true);
      const holders = await getTopTokenHolders();
      setHoldings({
        holders: holders.length,
        percentageHeld: holders.reduce((sum, holder) => sum + holder.percentage, 0)
      });
    } catch (error) {
      console.error('Error fetching holdings:', error);
    } finally {
      setHoldingsLoading(false);
    }
  };

  const fetchLiquidity = async () => {
    try {
      setLiquidityLoading(true);
      const pools = await getEnhancedLiquidityPools();
      setLiquidity({
        pools: pools.length,
        totalValueLocked: pools.reduce((sum, pool) => sum + pool.totalValueLocked, 0)
      });
    } catch (error) {
      console.error('Error fetching liquidity:', error);
    } finally {
      setLiquidityLoading(false);
    }
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

  const refreshAll = () => {
    fetchPriceData();
    fetchTransactions();
    fetchHoldings();
    fetchLiquidity();
    toast({
      title: 'Refreshing',
      description: 'Updating all dashboard data',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solana Monitor</h1>
          <p className="text-muted-foreground">
            Real-time CHONK9K token monitoring dashboard
          </p>
        </div>
        <Button onClick={refreshAll}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh All
        </Button>
      </div>

      {/* Price Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            {priceLoading ? (
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
          <CardFooter className="pt-0">
            <Link to="/token-price-tracker">
              <Button variant="link" size="sm" className="p-0 h-auto font-normal">
                View Price Chart
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Price Change (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            {priceLoading ? (
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
          <CardFooter className="pt-0">
            <Link to="/token-transactions">
              <Button variant="link" size="sm" className="p-0 h-auto font-normal">
                View Transactions
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Liquidity</CardTitle>
          </CardHeader>
          <CardContent>
            {liquidityLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">
                  {formatCurrency(liquidity.totalValueLocked)}
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Link to="/liquidity-pools">
              <Button variant="link" size="sm" className="p-0 h-auto font-normal">
                View {liquidity.pools} Pools
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Token Holders</CardTitle>
          </CardHeader>
          <CardContent>
            {holdingsLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="flex items-center space-x-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">
                  {holdings.holders}
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Link to="/token-holders">
              <Button variant="link" size="sm" className="p-0 h-auto font-normal">
                View Holders
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Price Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle>Price Chart (24h)</CardTitle>
              <CardDescription>
                CHONK9K price history on Solana
              </CardDescription>
            </div>
            <Link to="/token-price-tracker">
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" /> Detailed Chart
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {priceLoading ? (
            <div className="w-full h-[250px] flex items-center justify-center">
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : priceData.length === 0 ? (
            <div className="w-full h-[250px] flex items-center justify-center text-muted-foreground">
              No price data available
            </div>
          ) : (
            <div className="w-full h-[250px]">
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
                    tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--muted))' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value.toFixed(8)}`} 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--muted))' }}
                    tickCount={5}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(8)}`, 'Price']}
                    labelFormatter={(timestamp) => new Date(timestamp as number).toLocaleString()}
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

      {/* Base Chain Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Base Chain Activity</CardTitle>
              <CardDescription>
                CHONK9K transactions on Base blockchain
              </CardDescription>
            </div>
            <Link to="/base-transactions">
              <Button variant="outline" size="sm">
                <Layers className="mr-2 h-4 w-4" /> View Transactions
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <Layers className="h-16 w-16 mx-auto mb-4 text-[#0052FF]" />
            <h3 className="text-lg font-semibold mb-2">Base Chain Integration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              CHONK9K is now available on Base, Coinbase's Layer 2 blockchain built on Ethereum.
              Track contract deployments, token transfers, and more.
            </p>
            <Link to="/base-transactions">
              <Button variant="default">
                <Layers className="mr-2 h-4 w-4" /> Explore Base Chain Transactions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Live Transactions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Latest CHONK9K token activity
                </CardDescription>
              </div>
              <Link to="/token-transactions">
                <Button variant="outline" size="sm">
                  <Activity className="mr-2 h-4 w-4" /> View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No recent transactions found
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.signature} className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Badge className={getTypeBadgeColor(tx.type)}>
                        {tx.type}
                      </Badge>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {formatAddress(tx.fromAddress)} → {formatAddress(tx.toAddress)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(tx.blockTime)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">
                        {tx.amount.toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => window.open(`https://solscan.io/tx/${tx.signature}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Transaction Feed */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  Live Transaction Feed
                </CardTitle>
                <CardDescription>
                  Real-time token activity notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {liveTx.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Waiting for new transactions...</p>
                <p className="text-xs">Live updates will appear here automatically</p>
              </div>
            ) : (
              <div className="space-y-3">
                {liveTx.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg border-2 border-green-500/30 bg-green-500/5 animate-pulse hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Badge className={getTypeBadgeColor(tx.type)}>
                        {tx.type}
                      </Badge>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {formatAddress(tx.fromAddress)} → {formatAddress(tx.toAddress)}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                          Live Transaction
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">
                        {tx.amount.toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => window.open(`https://solscan.io/tx/${tx.signature}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SolanaMonitor;

// Import this icon in the file to fix Lucide issue
const RefreshCw = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);
