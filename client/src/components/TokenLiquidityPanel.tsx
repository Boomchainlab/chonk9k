import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropletIcon, TrendingUp, BarChart3, Percent, DollarSign, ExternalLink, Globe, ArrowUpDown } from 'lucide-react';
import { TokenLiquidity } from '@/services/tokenMarketService';

interface TokenLiquidityPanelProps {
  liquidityData: TokenLiquidity[];
  className?: string;
}

const TokenLiquidityPanel: React.FC<TokenLiquidityPanelProps> = ({ 
  liquidityData,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'all' | 'dexes' | 'cexes'>('all');
  
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  // Helper to categorize exchanges
  const isDefi = (platform: string): boolean => {
    const dexList = ['Raydium', 'Jupiter', 'Orca', 'Uniswap', 'SushiSwap', 'PancakeSwap', 'Biswap', 'BaseSwap', 'Meteora'];
    return dexList.includes(platform);
  };
  
  const isCex = (platform: string): boolean => {
    const cexList = ['Binance', 'OKX', 'Bybit', 'Kucoin', 'Gate.io', 'MEXC', 'Bitget'];
    return cexList.includes(platform);
  };

  const getPlatformIcon = (platform: string) => {
    // Platform icon mapping with real SVG logos
    const getIconImg = (platformName: string) => {
      const iconPath = `/images/platforms/${platformName.toLowerCase().replace(/\s+/g, '').replace('.', '')}.svg`;
      return (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-black/20 border border-gray-700">
          <img 
            src={iconPath} 
            alt={platformName} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop
              // Different background colors for different platforms
              const platformColors: Record<string, string> = {
                // Solana DEXes
                'Raydium': 'bg-blue-500',
                'Jupiter': 'bg-purple-500',
                'Orca': 'bg-teal-500',
                'Meteora': 'bg-indigo-500',
                // Ethereum DEXes
                'Uniswap': 'bg-pink-500',
                'SushiSwap': 'bg-orange-500',
                // BSC DEXes
                'PancakeSwap': 'bg-yellow-500',
                'Biswap': 'bg-amber-600',
                // Base DEX
                'BaseSwap': 'bg-blue-700',
                // CEXes
                'Binance': 'bg-yellow-400',
                'OKX': 'bg-blue-400',
                'Bybit': 'bg-red-500',
                'Kucoin': 'bg-green-600',
                'Gate.io': 'bg-red-600',
                'MEXC': 'bg-blue-600',
                'Bitget': 'bg-indigo-600',
                'default': 'bg-gray-500'
              };
              
              const bgColor = platformColors[platformName] || platformColors.default;
              
              // Default fallback icon with first letter of platform name
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full rounded-full ${bgColor} flex items-center justify-center"><span class="text-white text-xs font-bold">${platformName.charAt(0)}</span></div>`;
              }
            }}
          />
        </div>
      );
    };
    
    // Special handling for CHONKPUMP 9000
    if (platform === 'CHONKPUMP 9000') {
      return getIconImg('chonkpump');
    }

    return getIconImg(platform);
  };

  // Filter data based on view mode
  const filteredData = liquidityData.filter(item => {
    if (viewMode === 'all') return true;
    if (viewMode === 'dexes') return isDefi(item.platform);
    if (viewMode === 'cexes') return isCex(item.platform);
    return true;
  });
  
  // Sort data by liquidity (highest first)
  const sortedData = [...filteredData].sort((a, b) => 
    parseFloat(b.liquidityUSD) - parseFloat(a.liquidityUSD)
  );

  // Calculate total liquidity for the current filter
  const totalLiquidity = sortedData.reduce(
    (sum, item) => sum + parseFloat(item.liquidityUSD), 
    0
  );
  
  // Calculate total liquidity for DEXes and CEXes
  const totalDexLiquidity = liquidityData
    .filter(item => isDefi(item.platform))
    .reduce((sum, item) => sum + parseFloat(item.liquidityUSD), 0);
    
  const totalCexLiquidity = liquidityData
    .filter(item => isCex(item.platform))
    .reduce((sum, item) => sum + parseFloat(item.liquidityUSD), 0);

  return (
    <Card className={`bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center">
            <DropletIcon className="mr-2 h-5 w-5 text-[#ff00ff]" />
            Liquidity Distribution
          </CardTitle>
          <Badge variant="outline" className="bg-[#00e0ff]/20 text-[#00e0ff] border-[#00e0ff]/50">
            {formatCurrency(totalLiquidity.toString())} Total
          </Badge>
        </div>
        <CardDescription className="text-gray-400">
          Token liquidity across DEXs and CEXs
        </CardDescription>
      </CardHeader>

      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800">
        {/* View mode tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'all' | 'dexes' | 'cexes')} className="w-full">
          <TabsList className="bg-black/60 p-1 mb-1">
            <TabsTrigger value="all" className="text-xs">
              All Exchanges
            </TabsTrigger>
            <TabsTrigger value="dexes" className="text-xs">
              <Badge variant="outline" className="bg-purple-500/20 mr-1 py-0 px-1 border-none text-[10px]">
                {formatCurrency(totalDexLiquidity.toString())}
              </Badge>
              DEXes
            </TabsTrigger>
            <TabsTrigger value="cexes" className="text-xs">
              <Badge variant="outline" className="bg-blue-500/20 mr-1 py-0 px-1 border-none text-[10px]">
                {formatCurrency(totalCexLiquidity.toString())}
              </Badge>
              CEXes
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CardContent className="p-4 space-y-4 max-h-[500px] overflow-y-auto scrollbar scrollbar-thumb-[#ff00ff]/20 scrollbar-track-transparent scrollbar-thumb-rounded">
        {sortedData.map((item, index) => {
          // Calculate the percentage of total liquidity
          const percentage = (parseFloat(item.liquidityUSD) / totalLiquidity * 100).toFixed(1);
          
          return (
            <div key={index} className="bg-black/30 p-3 rounded-lg border border-gray-800 hover:border-[#00e0ff]/50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  {getPlatformIcon(item.platform)}
                  <div className="ml-3">
                    <div className="text-white flex items-center">
                      {item.platform}
                      {isDefi(item.platform) && (
                        <Badge variant="outline" className="ml-2 py-0 px-1 text-[10px] bg-purple-500/20 border-purple-500/30 text-purple-300">
                          DEX
                        </Badge>
                      )}
                      {isCex(item.platform) && (
                        <Badge variant="outline" className="ml-2 py-0 px-1 text-[10px] bg-blue-500/20 border-blue-500/30 text-blue-300">
                          CEX
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">{item.tokenPair}</div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-black/50 border-gray-700 text-xs">
                  {percentage}%
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div>
                  <div className="text-xs text-gray-400 flex items-center">
                    <DropletIcon className="h-3 w-3 mr-1" />
                    Liquidity
                  </div>
                  <div className="text-sm text-white">{formatCurrency(item.liquidityUSD)}</div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-400 flex items-center">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Volume 24h
                  </div>
                  <div className="text-sm text-white">{formatCurrency(item.volume24h)}</div>
                </div>
                
                <div>
                  {item.apr ? (
                    <>
                      <div className="text-xs text-gray-400 flex items-center">
                        <Percent className="h-3 w-3 mr-1" />
                        APR
                      </div>
                      <div className="text-sm text-green-400">{item.apr}%</div>
                    </>
                  ) : item.tvl ? (
                    <>
                      <div className="text-xs text-gray-400 flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        TVL
                      </div>
                      <div className="text-sm text-white">{formatCurrency(item.tvl)}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-gray-400 flex items-center">
                        <ArrowUpDown className="h-3 w-3 mr-1" />
                        Market Type
                      </div>
                      <div className="text-sm text-white">Spot</div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Progress bar representing percentage of total liquidity */}
              <div className="w-full bg-gray-900 h-1 mt-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isDefi(item.platform) ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
                  style={{ width: `${percentage}%` }} 
                />
              </div>
            </div>
          );
        })}
        
        {sortedData.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Globe className="h-12 w-12 mx-auto opacity-20 mb-3" />
            <p>No exchanges found for the selected filter.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenLiquidityPanel;