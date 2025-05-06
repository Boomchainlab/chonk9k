import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Info, BarChart2, Shield, LayoutDashboard, AreaChart, Layers, Activity, Users, MessageCircle, Wallet } from 'lucide-react';

import ChonkTokenLogo from '@/components/ChonkTokenLogo';
import TokenMarketStatsLive from '@/components/TokenMarketStatsLive';
import TokenAuditStatus from '@/components/TokenAuditStatus';
import TokenLiquidityPanel from '@/components/TokenLiquidityPanel';
import TokenTrendingStatus from '@/components/TokenTrendingStatus';
import TokenContractsDisplay from '@/components/TokenContractsDisplay';
import TokenPriceChart from '@/components/TokenPriceChart';
import TokenHolderAnalytics from '@/components/TokenHolderAnalytics';
import TokenSocialSentiment from '@/components/TokenSocialSentiment';
import TokenBalanceTracker from '@/components/TokenBalanceTracker';
import ChonkMoodIndicator from '@/components/ChonkMoodIndicator';
import tokenMarketService from '@/services/tokenMarketService';
import type { TokenMarketData } from '@/services/tokenMarketService';

const TokenDetails: React.FC = () => {
  const [marketData, setMarketData] = useState<TokenMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    const initMarketData = async () => {
      try {
        const data = await tokenMarketService.getCurrentMarketData();
        setMarketData(data);
      } catch (error) {
        console.error('Error fetching initial market data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initMarketData();
    
    // Set up real-time data updates
    const unsubscribe = tokenMarketService.subscribeToMarketUpdates(newData => {
      setMarketData(newData);
    }, 3000); // Update every 3 seconds
    
    return () => unsubscribe(); // Clean up on unmount
  }, []);
  
  if (loading || !marketData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 relative">
            <ChonkTokenLogo size={80} useAnimation={true} />
          </div>
          <p className="text-white mt-4 animate-pulse">Loading token data...</p>
        </div>
      </div>
    );
  }
  
  const isPriceChangePositive = parseFloat(marketData.priceChange24h) >= 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-white">
      {/* Token Header - Unique indigo/blue style */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 backdrop-blur-md border-b border-indigo-500/30 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:justify-between">            
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-12 h-12 md:w-16 md:h-16 mr-4">
                <ChonkTokenLogo size={64} useAnimation={false} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">CHONK 9000</h1>
                <div className="flex items-center text-gray-400 text-sm">
                  <span className="mr-2">$CHONK9K</span>
                  <span className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">TOKEN</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-2xl md:text-3xl font-bold text-[#00e0ff]">
                ${parseFloat(marketData.price).toFixed(8)}
              </div>
              <div className={`flex items-center text-sm ${isPriceChangePositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPriceChangePositive ? '▲' : '▼'} {marketData.priceChange24h}% (24h)
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            <Button variant="outline" size="sm" className="bg-black/40 border-[#00e0ff]/50 text-[#00e0ff] hover:bg-[#00e0ff]/20">
              <ExternalLink className="h-4 w-4 mr-1" />
              Website
            </Button>
            <Button variant="outline" size="sm" className="bg-black/40 border-[#ff00ff]/50 text-[#ff00ff] hover:bg-[#ff00ff]/20">
              Buy $CHONK9K
            </Button>
            <Button variant="outline" size="sm" className="bg-black/40 border-gray-700 text-gray-400 hover:bg-gray-800">
              <Info className="h-4 w-4 mr-1" />
              Tokenomics
            </Button>
            <Button variant="outline" size="sm" className="bg-black/40 border-gray-700 text-gray-400 hover:bg-gray-800">
              <Shield className="h-4 w-4 mr-1" />
              Audit Report
            </Button>
          </div>
        </div>
      </div>
      
      {/* Token Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-black/50 border border-[#ff00ff]/20 p-1">
            <TabsTrigger value="overview" className="text-sm data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-white">
              <LayoutDashboard className="h-4 w-4 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="markets" className="text-sm data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-white">
              <BarChart2 className="h-4 w-4 mr-1" />
              Markets
            </TabsTrigger>
            <TabsTrigger value="contracts" className="text-sm data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-white">
              <Layers className="h-4 w-4 mr-1" />
              Contracts
            </TabsTrigger>
            <TabsTrigger value="activities" className="text-sm data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-1" />
              Activities
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Market Stats */}
              <div className="lg:col-span-8">
                <TokenMarketStatsLive marketData={marketData} />
              </div>
              
              {/* Trending Status */}
              <div className="lg:col-span-4">
                <TokenTrendingStatus trendingData={marketData.trending} />
              </div>
              
              {/* Price Chart */}
              <div className="lg:col-span-8">
                <TokenPriceChart marketData={marketData} />
              </div>
              
              {/* Mood Indicator */}
              <div className="lg:col-span-4">
                <ChonkMoodIndicator marketData={marketData} />
              </div>
              
              {/* Holder Analytics */}
              <div className="lg:col-span-6">
                <TokenHolderAnalytics />
              </div>
              
              {/* Social Sentiment */}
              <div className="lg:col-span-6">
                <TokenSocialSentiment />
              </div>
            </div>
          </TabsContent>
          
          {/* Markets Tab */}
          <TabsContent value="markets" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Liquidity Panel */}
              <div className="lg:col-span-8">
                <TokenLiquidityPanel liquidityData={marketData.liquidity} />
              </div>
              
              {/* Market Stats */}
              <div className="lg:col-span-4">
                <TokenMarketStatsLive marketData={marketData} />
              </div>
              
              {/* Trading Volume Chart (Placeholder) */}
              <div className="lg:col-span-12">
                <Card className="bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3">
                    <CardTitle className="text-lg font-bold text-white flex items-center">
                      <BarChart2 className="mr-2 h-5 w-5 text-[#ff00ff]" />
                      Trading Volume (24h)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="bg-black/40 rounded-lg border border-gray-800 h-60 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart2 className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-400">Trading volume chart will be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Contracts Tab */}
          <TabsContent value="contracts" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Contract Addresses */}
              <div className="lg:col-span-8">
                <TokenContractsDisplay auditStatus={marketData.auditStatus} />
              </div>
              
              {/* Audit Status */}
              <div className="lg:col-span-4">
                <TokenAuditStatus auditData={marketData.auditStatus} />
              </div>
              
              {/* Token Information */}
              <div className="lg:col-span-12">
                <Card className="bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3">
                    <CardTitle className="text-lg font-bold text-white flex items-center">
                      <Info className="mr-2 h-5 w-5 text-[#ff00ff]" />
                      Token Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                        <h3 className="text-white font-medium mb-3">General</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Token Name</span>
                            <span className="text-sm text-white">CHONK 9000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Symbol</span>
                            <span className="text-sm text-white">CHONK9K</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Decimals</span>
                            <span className="text-sm text-white">9</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Total Supply</span>
                            <span className="text-sm text-white">{formatNumber(marketData.totalSupply)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                        <h3 className="text-white font-medium mb-3">Tokenomics</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Circulating Supply</span>
                            <span className="text-sm text-white">{formatNumber(marketData.circulatingSupply)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Burned Tokens</span>
                            <span className="text-sm text-white">140,000,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Max Supply</span>
                            <span className="text-sm text-white">1,000,000,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Launch Date</span>
                            <span className="text-sm text-white">Apr 2, 2025</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                        <h3 className="text-white font-medium mb-3">Features</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Transfer Fee</span>
                            <span className="text-sm text-white">None</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Mintable</span>
                            <span className="text-sm text-white">No</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Burnable</span>
                            <span className="text-sm text-white">Yes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Token Type</span>
                            <span className="text-sm text-white">SPL Token</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Activities Tab */}
          <TabsContent value="activities" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Balance Tracker */}
              <div className="lg:col-span-8">
                <TokenBalanceTracker />
              </div>
              
              {/* Social Activity */}
              <div className="lg:col-span-4">
                <Card className="bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden h-full">
                  <CardHeader className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3">
                    <CardTitle className="text-lg font-bold text-white flex items-center">
                      <MessageCircle className="mr-2 h-5 w-5 text-[#ff00ff]" />
                      Community Activity
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Latest community updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Activity Items */}
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="p-3 bg-black/30 rounded-lg border border-gray-800 hover:border-[#ff00ff]/30 transition-colors cursor-pointer">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#00e0ff] mr-2 flex items-center justify-center">
                              <ChonkTokenLogo size={24} useAnimation={false} />
                            </div>
                            <div>
                              <div className="text-sm text-white">CHONK9K Official</div>
                              <div className="text-xs text-gray-400">{new Date().toLocaleDateString()}</div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">
                            {item === 1 && "Big news! New exchange listing coming next week. Stay tuned! 🚀"}
                            {item === 2 && "Community AMA session scheduled for tomorrow at 3PM UTC!"}
                            {item === 3 && "Phase 2 roadmap milestone achieved! CHONKPUMP 9000 now live."}
                            {item === 4 && "CHONK9K featured on CoinGecko's trending page today! 🔥"}
                          </p>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/10">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Helper function to format large numbers
const formatNumber = (value: string) => {
  const num = parseInt(value);
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(2)}B`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toLocaleString();
};

export default TokenDetails;