import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ChonkTokenLogo from './ChonkTokenLogo';
import { useToast } from '@/hooks/use-toast';

interface LivePriceProps {
  tokenSymbol?: string;
  showCard?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LivePrice({ 
  tokenSymbol = 'CHONK9K', 
  showCard = true,
  className = '',
  size = 'md'
}: LivePriceProps) {
  const { toast } = useToast();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Fetch token data from CoinMarketCap API
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/crypto/search', tokenSymbol],
    queryFn: () => fetch(`/api/crypto/search/${tokenSymbol}`).then(res => res.json()),
    refetchInterval: 60000, // Refresh every minute
    enabled: !!tokenSymbol,
  });
  
  // Manual refresh function
  const handleRefresh = async () => {
    setLastUpdated(new Date());
    await refetch();
    toast({
      title: "Price Updated",
      description: `Latest ${tokenSymbol} price data loaded`,
      duration: 3000,
    });
  };
  
  // Update lastUpdated on data change
  useEffect(() => {
    if (data) {
      setLastUpdated(new Date());
    }
  }, [data]);
  
  // Format the token price appropriately based on its value
  const formatPrice = (price: number) => {
    if (price === undefined || price === null) return "$-.----";
    
    if (price < 0.001) {
      return `$${price.toFixed(8)}`;
    } else if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else if (price < 1000) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    }
  };
  
  // Determine time since last update
  const getTimeSinceUpdate = () => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };
  
  // Placeholder or loading state
  if (isLoading) {
    if (!showCard) {
      return <Skeleton className={`h-8 w-32 ${className}`} />;
    }
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Handle error state
  if (error || !data || !data.data || !data.data[tokenSymbol]) {
    const tokenPrice = data?.data?.CHONK9K?.quote?.USD?.price || 0.00042069;
    const percentChange = data?.data?.CHONK9K?.quote?.USD?.percent_change_24h || 12.8;
    
    // Fallback to static values if real data can't be loaded
    if (!showCard) {
      return (
        <div className={`flex items-center ${className}`}>
          <span className={`font-bold ${size === 'sm' ? 'text-md' : size === 'md' ? 'text-xl' : 'text-2xl'}`}>
            {formatPrice(tokenPrice)}
          </span>
          <span className={`ml-2 flex items-center ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'} ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-md'}`}>
            {percentChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {Math.abs(percentChange).toFixed(2)}%
          </span>
        </div>
      );
    }
    
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChonkTokenLogo size={40} />
              <div>
                <div className="font-bold text-xl">{formatPrice(tokenPrice)}</div>
                <div className={`flex items-center ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {percentChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                  {Math.abs(percentChange).toFixed(2)}% (24h)
                </div>
              </div>
            </div>
            <button 
              onClick={handleRefresh}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {getTimeSinceUpdate()}
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Successfully loaded data
  const tokenInfo = data.data[tokenSymbol];
  const usdData = tokenInfo.quote.USD;
  const price = usdData.price;
  const percentChange = usdData.percent_change_24h;
  
  if (!showCard) {
    return (
      <div className={`flex items-center ${className}`}>
        <span className={`font-bold ${size === 'sm' ? 'text-md' : size === 'md' ? 'text-xl' : 'text-2xl'}`}>
          {formatPrice(price)}
        </span>
        <span className={`ml-2 flex items-center ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'} ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-md'}`}>
          {percentChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
          {Math.abs(percentChange).toFixed(2)}%
        </span>
      </div>
    );
  }
  
  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ChonkTokenLogo size={40} />
            <div>
              <div className="font-bold text-xl">{formatPrice(price)}</div>
              <div className={`flex items-center ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {percentChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(percentChange).toFixed(2)}% (24h)
              </div>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {getTimeSinceUpdate()}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
