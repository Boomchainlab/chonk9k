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
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Clock, ExternalLink, Users, Wallet } from 'lucide-react';
import { getTopTokenHolders, TokenHolder } from '../lib/solanaMonitorService';

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

const formatNumber = (num: number) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

const formatPercentage = (percentage: number) => {
  return `${percentage.toFixed(2)}%`;
};

const formatTime = (timestamp?: number) => {
  if (!timestamp) return 'N/A';
  
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

const TokenHolders: React.FC = () => {
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchHolders = async () => {
    try {
      setLoading(true);
      const data = await getTopTokenHolders(50);
      setHolders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching token holders:', err);
      setError('Failed to load token holders. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load token holders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolders();
  }, []);

  const handleRefresh = () => {
    fetchHolders();
    toast({
      title: 'Refreshing',
      description: 'Fetching the latest token holder data',
    });
  };

  const openExplorer = (address: string) => {
    window.open(`https://solscan.io/account/${address}`, '_blank');
  };

  // Calculate total tokens held by top holders
  const totalTokensHeld = holders.reduce((total, holder) => total + holder.balance, 0);
  const totalPercentageHeld = holders.reduce((total, holder) => total + holder.percentage, 0);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CHONK9K Token Holders</h1>
          <p className="text-muted-foreground">
            View top token holders and distribution
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Holders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{holders.length}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Percentage Held</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="flex items-center space-x-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{formatPercentage(totalPercentageHeld)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Token Holders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Token Holders</CardTitle>
          <CardDescription>
            Largest CHONK9K token holders on Solana
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                onClick={fetchHolders}
              >
                Try Again
              </Button>
            </div>
          ) : holders.length === 0 ? (
            // Empty state
            <div className="p-4 text-center">
              <p className="text-muted-foreground">
                No token holders found
              </p>
            </div>
          ) : (
            // Holders table
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                    <TableHead className="hidden md:table-cell">Distribution</TableHead>
                    <TableHead className="text-right">Last Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holders.map((holder, index) => (
                    <TableRow key={holder.address}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        {formatAddress(holder.address)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(holder.balance)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPercentage(holder.percentage)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Progress value={holder.percentage} className="h-2" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formatTime(holder.lastActivity)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openExplorer(holder.address)}
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
      </Card>
    </div>
  );
};

export default TokenHolders;
