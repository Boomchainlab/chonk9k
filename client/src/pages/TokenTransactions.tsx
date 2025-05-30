import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, ArrowDownUp, Circle, ExternalLink, Filter } from 'lucide-react';
import { getRecentTokenTransactions, TokenTransaction } from '../lib/solanaMonitorService';

const formatAddress = (address?: string) => {
  if (!address) return '-';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const formatTimestamp = (timestamp: number) => {
  if (!timestamp) return '-';
  return new Date(timestamp * 1000).toLocaleString();
};

// Badge color based on transaction type
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

const TokenTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const txs = await getRecentTokenTransactions(50);
      setTransactions(txs);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load transaction history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'all') return true;
    return tx.type === activeTab;
  });

  const handleRefresh = () => {
    fetchTransactions();
    toast({
      title: 'Refreshing',
      description: 'Fetching the latest transactions',
    });
  };

  const openExplorer = (signature: string) => {
    window.open(`https://solscan.io/tx/${signature}`, '_blank');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CHONK9K Transactions</h1>
          <p className="text-muted-foreground">
            View recent token transactions on the Solana blockchain
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Recent CHONK9K token activity on Solana
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm">
                {transactions.length} transactions found
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="transfer">Transfers</TabsTrigger>
              <TabsTrigger value="swap">Swaps</TabsTrigger>
              <TabsTrigger value="mint">Mints</TabsTrigger>
              <TabsTrigger value="burn">Burns</TabsTrigger>
              <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                // Loading skeleton
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
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
                    onClick={fetchTransactions}
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredTransactions.length === 0 ? (
                // Empty state
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">
                    No {activeTab === 'all' ? '' : activeTab} transactions found
                  </p>
                </div>
              ) : (
                // Transaction table
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((tx) => (
                        <TableRow key={tx.signature}>
                          <TableCell>
                            <Badge className={getTypeBadgeColor(tx.type)}>
                              {tx.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatTimestamp(tx.blockTime)}</TableCell>
                          <TableCell>{formatAddress(tx.fromAddress)}</TableCell>
                          <TableCell>{formatAddress(tx.toAddress)}</TableCell>
                          <TableCell className="text-right font-mono">
                            {tx.amount.toLocaleString(undefined, { 
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openExplorer(tx.signature)}
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenTransactions;
