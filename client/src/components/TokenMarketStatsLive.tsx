import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, BarChart2, Users, Layers, TrendingUp, DollarSign, Flame, Clock } from 'lucide-react';
import { TokenMarketData } from '@/services/tokenMarketService';
import ChonkTokenLogo from './ChonkTokenLogo';

interface TokenMarketStatsLiveProps {
  marketData: TokenMarketData;
  updateInterval?: number; // ms
  className?: string;
}

const TokenMarketStatsLive: React.FC<TokenMarketStatsLiveProps> = ({ 
  marketData, 
  updateInterval = 1000,
  className = '' 
}) => {
  const [marketStats, setMarketStats] = useState<TokenMarketData>(marketData);
  const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);
  const [lastPrice, setLastPrice] = useState<number>(parseFloat(marketData.price));
  
  // Update state when props change
  useEffect(() => {
    const currentPrice = parseFloat(marketData.price);
    const previousPrice = lastPrice;
    
    if (currentPrice > previousPrice) {
      setPriceFlash('up');
    } else if (currentPrice < previousPrice) {
      setPriceFlash('down');
    }
    
    setLastPrice(currentPrice);
    setMarketStats(marketData);
    
    // Clear flash effect after animation completes
    const timeout = setTimeout(() => {
      setPriceFlash(null);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [marketData, lastPrice]);
  
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };
  
  const formatNumber = (value: string) => {
    const num = parseInt(value);
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toString();
  };
  
  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString();
  };
  
  const isPriceChangePositive = parseFloat(marketStats.priceChange24h) >= 0;
  
  const stats = [
    {
      label: "Market Cap",
      value: formatCurrency(marketStats.marketCap),
      icon: <TrendingUp className="h-4 w-4 text-[#ff00ff]" />
    },
    {
      label: "24h Volume",
      value: formatCurrency(marketStats.volume24h),
      icon: <BarChart2 className="h-4 w-4 text-[#ff00ff]" />
    },
    {
      label: "Circulating Supply",
      value: formatNumber(marketStats.circulatingSupply),
      icon: <Layers className="h-4 w-4 text-[#ff00ff]" />
    },
    {
      label: "Total Supply",
      value: formatNumber(marketStats.totalSupply),
      icon: <Layers className="h-4 w-4 text-[#ff00ff]" />
    }
  ];
  
  return (
    <Card className={`bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center">
            <BarChart2 className="mr-2 h-5 w-5 text-[#ff00ff]" />
            Market Stats
          </CardTitle>
          <Badge variant="outline" className="bg-black/50 text-[#00e0ff] border-[#00e0ff]/50 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
        <CardDescription className="text-gray-400">
          Real-time token metrics updated at {formatTimestamp(marketStats.lastUpdated)}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-black/40 p-4 rounded-lg border border-[#00e0ff]/20">
          <div className="flex items-center mb-3 md:mb-0">
            <div className="w-10 h-10 mr-3">
              <ChonkTokenLogo size={32} useAnimation={false} />
            </div>
            <div>
              <h3 className="text-white font-medium">CHONK9K Price</h3>
              <div className="text-gray-400 text-xs">24h Change</div>
            </div>
          </div>
          
          <div className="text-right">
            <div 
              className={`text-2xl font-bold ${priceFlash === 'up' ? 'text-green-400 animate-pulse' : priceFlash === 'down' ? 'text-red-400 animate-pulse' : 'text-[#00e0ff]'}`}
            >
              ${parseFloat(marketStats.price).toFixed(8)}
            </div>
            <div className={`flex items-center justify-end text-sm ${isPriceChangePositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPriceChangePositive ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {marketStats.priceChange24h}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="bg-black/30 p-3 rounded-lg border border-gray-800">
              <div className="flex items-center mb-1">
                <div className="mr-1">{stat.icon}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
              <div className="text-sm text-white font-medium">{stat.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenMarketStatsLive;