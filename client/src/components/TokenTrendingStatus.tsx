import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, TrendingUp, BarChart3, Trophy, Star, Search, Layers, Building, Globe } from 'lucide-react';
import { TrendingStatus } from '@/services/tokenMarketService';

interface TokenTrendingStatusProps {
  trendingData: TrendingStatus;
  className?: string;
}

const TokenTrendingStatus: React.FC<TokenTrendingStatusProps> = ({ 
  trendingData,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'all' | 'trackers' | 'exchanges' | 'explorers'>('all');
  
  const getHeatColor = (heatScore?: number) => {
    if (!heatScore) return 'bg-gray-700';
    
    if (heatScore >= 90) return 'bg-red-500';
    if (heatScore >= 70) return 'bg-orange-500';
    if (heatScore >= 50) return 'bg-yellow-500';
    if (heatScore >= 30) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  // Helper to categorize platforms
  const isPlatformTracker = (platform: string): boolean => {
    const trackersList = ['CoinGecko', 'CoinMarketCap', 'DexScreener', 'DexTools', 'CryptoRank', 'LiveCoinWatch', 'CoinStats', 'CoinCodex', 'Bitverse'];
    return trackersList.includes(platform);
  };
  
  const isPlatformExchange = (platform: string): boolean => {
    const exchangesList = ['Binance', 'OKX', 'Bybit', 'KuCoin', 'Raydium', 'Jupiter', 'Uniswap', 'PancakeSwap'];
    return exchangesList.includes(platform);
  };
  
  const isPlatformExplorer = (platform: string): boolean => {
    const explorersList = ['Solscan', 'Solana FM', 'Etherscan', 'BscScan', 'BaseScan'];
    return explorersList.includes(platform);
  };

  const getPlatformIcon = (platform: string) => {
    // Platform icon mapping with real SVG logos
    const getIconImg = (platformName: string) => {
      const iconPath = `/images/platforms/${platformName.toLowerCase().replace(/\s+/g, '')}.svg`;
      return (
        <div className="w-6 h-6 rounded-full overflow-hidden bg-black/20">
          <img 
            src={iconPath} 
            alt={platformName} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop
              // Default fallback icon with first letter of platform name
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-xs">${platformName.charAt(0)}</div>`;
              }
            }}
          />
        </div>
      );
    };

    // Platform icon mapping
    const platformIcons: Record<string, React.ReactNode> = {
      // Tracking sites
      'CoinGecko': getIconImg('coingecko'),
      'CoinMarketCap': getIconImg('coinmarketcap'),
      'DexScreener': getIconImg('dexscreener'),
      'DexTools': getIconImg('dextools'),
      'CryptoRank': getIconImg('cryptorank'),
      'LiveCoinWatch': getIconImg('livecoinwatch'),
      'CoinStats': getIconImg('coinstats'),
      'CoinCodex': getIconImg('coincodex'),
      'Bitverse': getIconImg('bitverse'),
      
      // Blockchain explorers
      'Solscan': getIconImg('solscan'),
      'Solana FM': getIconImg('solanafm'),
      'Etherscan': getIconImg('etherscan'),
      'BscScan': getIconImg('bscscan'),
      'BaseScan': getIconImg('basescan'),
      
      // Exchanges
      'Binance': getIconImg('binance'),
      'OKX': getIconImg('okx'),
      'Bybit': getIconImg('bybit'),
      'KuCoin': getIconImg('kucoin'),
      'Raydium': getIconImg('raydium'),
      'Jupiter': getIconImg('jupiter'),
      'Uniswap': getIconImg('uniswap'),
      'PancakeSwap': getIconImg('pancakeswap'),
      'Orca': getIconImg('orca'),
      
      // CHONKPUMP 9000
      'CHONKPUMP': getIconImg('chonkpump'),
      
      'default': <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-xs">?</div>
    };

    return platformIcons[platform] || platformIcons.default;
  };
  
  // Filter platforms based on view mode
  const filteredPlatforms = trendingData.platforms.filter(platform => {
    if (viewMode === 'all') return true;
    if (viewMode === 'trackers') return isPlatformTracker(platform.name);
    if (viewMode === 'exchanges') return isPlatformExchange(platform.name);
    if (viewMode === 'explorers') return isPlatformExplorer(platform.name);
    return true;
  });

  // Sort platforms by heat score (highest first)
  const sortedPlatforms = [...filteredPlatforms].sort((a, b) => 
    (b.heatScore || 0) - (a.heatScore || 0)
  );

  return (
    <Card className={`bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center">
            <Flame className="mr-2 h-5 w-5 text-[#ff00ff]" />
            Trending Status
          </CardTitle>
          <Badge 
            variant="outline" 
            className="bg-gradient-to-r from-red-500/20 to-yellow-500/20 text-white border-red-500/30"
          >
            {trendingData.overall.toFixed(0)}/100 Heat
          </Badge>
        </div>
        <CardDescription className="text-gray-400">
          Token trending status across platforms
        </CardDescription>
      </CardHeader>

      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800">
        {/* View mode tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
          <TabsList className="bg-black/60 p-1 mb-1">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="trackers" className="text-xs">
              <Search className="h-3 w-3 mr-1" />
              Trackers
            </TabsTrigger>
            <TabsTrigger value="exchanges" className="text-xs">
              <Building className="h-3 w-3 mr-1" />
              Exchanges
            </TabsTrigger>
            <TabsTrigger value="explorers" className="text-xs">
              <Layers className="h-3 w-3 mr-1" />
              Explorers
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Overall heat gauge */}
        <div className="mb-6">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm text-gray-400">Overall Trending Heat</span>
            <span className="text-white font-medium">{trendingData.overall.toFixed(0)}/100</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500" 
              style={{ width: `${trendingData.overall}%` }}
            />
          </div>
        </div>

        {/* Platform trending details */}
        <div className="space-y-3 max-h-[350px] overflow-y-auto scrollbar scrollbar-thumb-[#ff00ff]/20 scrollbar-track-transparent scrollbar-thumb-rounded">
          {sortedPlatforms.map((platform, index) => (
            <div key={index} className="bg-black/30 p-3 rounded-lg border border-gray-800 hover:border-[#00e0ff]/30 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {getPlatformIcon(platform.name)}
                  <div className="ml-3">
                    <div className="text-white flex items-center">
                      {platform.name}
                      {isPlatformTracker(platform.name) && (
                        <Badge variant="outline" className="ml-2 py-0 px-1 text-[10px] bg-purple-500/20 border-purple-500/30 text-purple-300">
                          Tracker
                        </Badge>
                      )}
                      {isPlatformExchange(platform.name) && (
                        <Badge variant="outline" className="ml-2 py-0 px-1 text-[10px] bg-blue-500/20 border-blue-500/30 text-blue-300">
                          Exchange
                        </Badge>
                      )}
                      {isPlatformExplorer(platform.name) && (
                        <Badge variant="outline" className="ml-2 py-0 px-1 text-[10px] bg-green-500/20 border-green-500/30 text-green-300">
                          Explorer
                        </Badge>
                      )}
                    </div>
                    {platform.rank && (
                      <div className="text-xs text-gray-400 flex items-center">
                        <Trophy className="h-3 w-3 mr-1" />
                        Rank #{platform.rank}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  {platform.heatScore && (
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full mr-1.5 animate-pulse" style={{ backgroundColor: getHeatColor(platform.heatScore) }} />
                      <span className="text-white">{platform.heatScore.toFixed(0)}</span>
                    </div>
                  )}
                  {platform.trending && (
                    <div className="flex items-center text-xs mt-1">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
                      <span className="text-green-400">Trending</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Heat indicator bar */}
              {platform.heatScore && (
                <div className="w-full h-1.5 bg-gray-800 mt-3 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getHeatColor(platform.heatScore)}`} 
                    style={{ width: `${platform.heatScore}%` }}
                  />
                </div>
              )}
            </div>
          ))}
          
          {sortedPlatforms.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Globe className="h-12 w-12 mx-auto opacity-20 mb-3" />
              <p>No platforms found for the selected filter.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenTrendingStatus;