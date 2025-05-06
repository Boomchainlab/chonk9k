import React, { useState, useEffect } from 'react';
import { getCurrentSlot, getCurrentBlockTime } from '@/lib/solanaConnection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export interface SolanaConnectionStatusProps {
  className?: string;
}

const SolanaConnectionStatus: React.FC<SolanaConnectionStatusProps> = ({ className }) => {
  const [currentSlot, setCurrentSlot] = useState<number | null>(null);
  const [blockTime, setBlockTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSolanaInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const slot = await getCurrentSlot();
      setCurrentSlot(slot);
      
      const time = await getCurrentBlockTime();
      setBlockTime(time);
    } catch (err) {
      console.error('Error fetching Solana info:', err);
      setError('Failed to connect to Solana');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolanaInfo();
    
    // Auto-refresh every 30 seconds
    const intervalId = setInterval(fetchSolanaInfo, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const formatBlockTime = (timestamp: number | null) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    return date.toLocaleTimeString();
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Solana Network Status</CardTitle>
          <Badge 
            variant={error ? "destructive" : "default"}
            className="px-2 py-1"
          >
            {error ? 'Disconnected' : 'Connected'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Slot</p>
              <p className="font-medium">{loading ? 'Loading...' : currentSlot?.toLocaleString() || 'Unknown'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Block Time</p>
              <p className="font-medium">{loading ? 'Loading...' : formatBlockTime(blockTime)}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchSolanaInfo} 
              disabled={loading}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SolanaConnectionStatus;
