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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Filter, Clock, ArrowUpRight, WalletIcon, CodeSquare, Layers, LayersIcon } from 'lucide-react';
import { getBaseTransactions, EnhancedBaseTransaction } from '../lib/baseMonitorService';

const formatAddress = (address: string | null): string => {
  if (!address) return '-';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatTimestamp = (timestamp?: number): string => {
  if (!timestamp) return '-';
  return new Date(timestamp * 1000).toLocaleString();
};

const formatBlockNumber = (blockNum: number): string => {
  return blockNum.toLocaleString();
};

// Badge color based on transaction type
const getTypeBadgeColor = (type: string): string => {
  switch (type) {
    case 'contract_creation':
      return 'bg-purple-500 hover:bg-purple-600';
    case 'contract_interaction':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'token_transfer':
      return 'bg-green-500 hover:bg-green-600';
    case 'deposit':
      return 'bg-amber-500 hover:bg-amber-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

// Badge color based on transaction status
const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'success':
      return 'bg-green-500 hover:bg-green-600';
    case 'failed':
      return 'bg-red-500 hover:bg-red-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

const BaseTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<EnhancedBaseTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const txs = await getBaseTransactions(20);
      setTransactions(txs);
      setError(null);
    } catch (err) {
      console.error('Error fetching Base transactions:', err);
      setError('Failed to load transactions. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load Base transaction history',
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
      description: 'Fetching the latest Base transactions',
    });
  };

  const openExplorer = (txHash: string) => {
    window.open(`https://basescan.org/tx/${txHash}`, '_blank');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Base Transactions</h1>
          <p className="text-muted-foreground">
            View CHONK9K token transactions on Base blockchain
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
                Recent Base blockchain activity
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <LayersIcon className="h-4 w-4 text-primary" />
              <span className="text-sm">
                {transactions.length} transactions found
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="token_transfer">Token Transfers</TabsTrigger>
              <TabsTrigger value="contract_creation">Contract Creation</TabsTrigger>
              <TabsTrigger value="contract_interaction">Contract Interaction</TabsTrigger>
              <TabsTrigger value="deposit">Deposits (L1→L2)</TabsTrigger>
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
                    No {activeTab === 'all' ? '' : activeTab.replace('_', ' ')} transactions found
                  </p>
                </div>
              ) : (
                // Transaction table
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Block</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Gas Used</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((tx) => (
                        <TableRow key={tx.transactionHash}>
                          <TableCell>
                            <Badge className={getTypeBadgeColor(tx.type)}>
                              {tx.type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-xs">
                              {formatBlockNumber(tx.blockNumber)}
                            </span>
                          </TableCell>
                          <TableCell>{formatTimestamp(tx.timestamp)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <WalletIcon className="h-3 w-3 text-muted-foreground" />
                              <span>{formatAddress(tx.from)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {tx.to ? (
                              <div className="flex items-center gap-1">
                                <WalletIcon className="h-3 w-3 text-muted-foreground" />
                                <span>{formatAddress(tx.to)}</span>
                              </div>
                            ) : tx.contractAddress ? (
                              <div className="flex items-center gap-1">
                                <CodeSquare className="h-3 w-3 text-purple-500" />
                                <span>{formatAddress(tx.contractAddress)}</span>
                              </div>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(tx.status)}>
                              {tx.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            {tx.formattedGasUsed}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openExplorer(tx.transactionHash)}
                              title="View on BaseScan"
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

export default BaseTransactions;
