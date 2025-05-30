import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from 'lucide-react';

interface MarketStat {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
}

interface SocialStat {
  platform: string;
  metric: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

interface MarketDataPanelProps {
  marketStats: MarketStat[];
  socialStats: SocialStat[];
}

const MarketDataPanel: React.FC<MarketDataPanelProps> = ({ marketStats, socialStats }) => {
  return (
    <div className="space-y-6">
      <Card className="bg-black/60 backdrop-blur-xl rounded-xl border border-[#00e0ff]/30 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#00e0ff]/20 to-transparent border-b border-[#00e0ff]/30 pb-3">
          <CardTitle className="text-lg font-bold text-[#00e0ff] flex items-center">
            <span className="mr-2">📊</span>
            Market Data
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {marketStats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center">
                  {stat.icon && <div className="mr-3 bg-[#ff00ff]/10 p-1.5 rounded-full">{stat.icon}</div>}
                  <span className="text-sm text-gray-300">{stat.label}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium text-base">{stat.value}</div>
                  {stat.change && (
                    <div className={`text-xs flex items-center justify-end ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                      {stat.change}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3">
          <CardTitle className="text-lg font-bold text-[#ff00ff] flex items-center">
            <span className="mr-2">🌐</span>
            Social Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialStats.map((stat, index) => (
              <div key={index} className="border border-gray-800 rounded-lg p-3 bg-black/30">
                <div className="text-xs text-gray-400 mb-1">{stat.platform}</div>
                <div className="flex justify-between items-center">
                  <div className="text-white font-medium">{stat.value}</div>
                  {stat.change && (
                    <div className={`text-xs flex items-center ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                      {stat.change}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">{stat.metric}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketDataPanel;