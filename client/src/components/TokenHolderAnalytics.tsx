import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Trophy, Wallet, PieChart, ArrowUpRight } from 'lucide-react';

interface TokenHolderAnalyticsProps {
  className?: string;
}

const TokenHolderAnalytics: React.FC<TokenHolderAnalyticsProps> = ({ 
  className = ''
}) => {
  // Sample holder data for visualization
  const holderStats = {
    totalHolders: 12867,
    growthRate: 8.3, // percentage growth in last 7 days
    averageHolding: 78500, // average tokens per holder
    newHolders24h: 324,
    distribution: [
      { category: "Whales", percentage: 15, count: 54, definition: ">1M tokens" },
      { category: "Large", percentage: 24, count: 278, definition: "100K-1M tokens" },
      { category: "Medium", percentage: 34, count: 4121, definition: "10K-100K tokens" },
      { category: "Small", percentage: 27, count: 8414, definition: "<10K tokens" },
    ],
    topWallets: [
      { address: "2Lp2SGS9AKYVKCorizjzJLPHn4swatnbvEQ2UB2bKorJy", holdings: 48500000, percentage: 4.85, tag: "Team Wallet" },
      { address: "5e7Z2cWkQKYWDvpaApCxmGZi1M2pHmxyKijJxbCfrkUy", holdings: 38750000, percentage: 3.88, tag: "Treasury" },
      { address: "9BvXaQVv9ZjRJicL3GtY2HuDLc46rLgyV3JtLEcXQHgf", holdings: 25600000, percentage: 2.56, tag: "Founder" },
      { address: "EB5ZhyBVJEbMFm8zduSG58xchZJvdNPB2N7JZPfLKRby", holdings: 18700000, percentage: 1.87, tag: "Marketing" },
      { address: "HEL9MLGNGvAeP7fJr6EqGPuLqKYsLNsXnUdHPbQYKJh3", holdings: 12800000, percentage: 1.28, tag: "Whale" },
    ]
  };
  
  // Formatting functions
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };
  
  const formatAddress = (address: string) => {
    if (!address) return '';
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Get color based on percentage (for distribution chart)
  const getDistributionColor = (index: number) => {
    const colors = [
      "from-[#ff00ff] to-[#ff77ff]", // Whales - Strong pink
      "from-[#aa00ff] to-[#cc66ff]", // Large - Purple
      "from-[#00e0ff] to-[#99f2ff]", // Medium - Cyan
      "from-[#00ffaa] to-[#99ffd6]"  // Small - Green
    ];
    return colors[index % colors.length];
  };
  
  return (
    <Card className={`bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3">
        <CardTitle className="text-lg font-bold text-white flex items-center">
          <Users className="mr-2 h-5 w-5 text-[#ff00ff]" />
          Holder Analytics
        </CardTitle>
        <CardDescription className="text-gray-400">
          Distribution and insights for CHONK9K token holders
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 space-y-6">
        {/* Holder Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
            <div className="text-xs text-gray-400 mb-1">Total Holders</div>
            <div className="text-xl font-bold text-white">
              {formatNumber(holderStats.totalHolders)}
            </div>
            <div className="text-xs text-green-400 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {holderStats.growthRate}% (7d)
            </div>
          </div>
          
          <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
            <div className="text-xs text-gray-400 mb-1">Avg. Holding</div>
            <div className="text-xl font-bold text-white">
              {formatNumber(holderStats.averageHolding)}
            </div>
          </div>
          
          <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
            <div className="text-xs text-gray-400 mb-1">New Holders (24h)</div>
            <div className="text-xl font-bold text-white">
              {formatNumber(holderStats.newHolders24h)}
            </div>
          </div>
          
          <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
            <div className="text-xs text-gray-400 mb-1">Whale Ratio</div>
            <div className="text-xl font-bold text-white">
              {holderStats.distribution[0].percentage}%
            </div>
          </div>
        </div>
        
        {/* Distribution Chart */}
        <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white flex items-center">
              <PieChart className="h-4 w-4 mr-2 text-[#00e0ff]" />
              Holder Distribution
            </h4>
            <Badge className="bg-[#00e0ff]/20 border-[#00e0ff]/30 text-[#00e0ff]">
              By Volume
            </Badge>
          </div>
          
          <div className="space-y-3">
            {holderStats.distribution.map((category, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <div className="text-white">{category.category}</div>
                  <div className="text-gray-400 text-xs flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {formatNumber(category.count)} · <span className="ml-1">{category.percentage}%</span>
                  </div>
                </div>
                <div className="relative">
                  <Progress 
                    value={category.percentage} 
                    className="h-2 bg-gray-800"
                  />
                  <div 
                    className={`absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r ${getDistributionColor(index)}`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">{category.definition}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Wallets */}
        <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-[#ff00ff]" />
              Top Holders
            </h4>
          </div>
          
          <div className="space-y-2">
            {holderStats.topWallets.map((wallet, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-[#ff00ff] to-[#00e0ff] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm text-white font-mono">{formatAddress(wallet.address)}</div>
                    {wallet.tag && (
                      <Badge 
                        variant="outline" 
                        className="text-[0.65rem] h-4 px-1 bg-gray-800/80 text-gray-300 border-gray-700"
                      >
                        {wallet.tag}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white">{formatNumber(wallet.holdings)}</div>
                  <div className="text-xs text-gray-400">{wallet.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenHolderAnalytics;