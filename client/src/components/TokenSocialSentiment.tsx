import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, TrendingUp, Globe, Twitter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TokenSocialSentimentProps {
  className?: string;
}

const TokenSocialSentiment: React.FC<TokenSocialSentimentProps> = ({ 
  className = ''
}) => {
  // Sample social sentiment data
  const sentimentData = {
    lastUpdated: new Date(),
    overall: 82, // overall sentiment score (0-100)
    change24h: 3.7, // percentage change in last 24h
    sentiment: {
      positive: 67,
      neutral: 28,
      negative: 5
    },
    volume: {
      total24h: 15764,
      change24h: 12.8,
    },
    sources: [
      { name: "Twitter", count: 7854, sentiment: 79, change: 8.4 },
      { name: "Discord", count: 4212, sentiment: 85, change: 5.2 },
      { name: "Telegram", count: 2580, sentiment: 81, change: 3.7 },
      { name: "Reddit", count: 880, sentiment: 72, change: -2.3 },
      { name: "YouTube", count: 238, sentiment: 91, change: 15.1 }
    ],
    trending: [
      { tag: "#CHONK9K", count: 3570, change: 22.4 },
      { tag: "#CHONKPUMP", count: 2190, change: 17.8 },
      { tag: "#CyberChonk", count: 1850, change: 11.2 },
      { tag: "#CHONKarmy", count: 1200, change: 8.5 },
      { tag: "#CHONKholder", count: 980, change: 5.3 }
    ]
  };
  
  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };
  
  // Get sentiment color
  const getSentimentColor = (score: number) => {
    if (score >= 75) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };
  
  // Get change icon and color
  const getChangeDisplay = (change: number) => {
    return {
      icon: change >= 0 ? ArrowUpRight : ArrowDownRight,
      color: change >= 0 ? "text-green-400" : "text-red-400",
      text: `${Math.abs(change).toFixed(1)}%`
    };
  };
  
  return (
    <Card className={`bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3">
        <CardTitle className="text-lg font-bold text-white flex items-center">
          <MessageCircle className="mr-2 h-5 w-5 text-[#ff00ff]" />
          Social Sentiment
        </CardTitle>
        <CardDescription className="text-gray-400">
          Community sentiment and social media activity
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 space-y-6">
        {/* Overall Sentiment */}
        <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white">Sentiment Score</h4>
            <Badge className={`${getSentimentColor(sentimentData.overall)} bg-black/50 border border-current`}>
              {sentimentData.overall}/100
            </Badge>
          </div>
          
          <div className="relative pt-1">
            <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-800">
              <div 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-500 to-[#00e0ff]"
                style={{ width: `${sentimentData.overall}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mt-2 flex justify-between items-center text-xs">
            <div className="flex items-center">
              <span className="text-gray-400 mr-1">24h change:</span>
              <span className={getChangeDisplay(sentimentData.change24h).color}>
                {React.createElement(getChangeDisplay(sentimentData.change24h).icon, { className: "inline h-3 w-3 mr-0.5" })}
                {getChangeDisplay(sentimentData.change24h).text}
              </span>
            </div>
            <div className="text-gray-500 text-[0.65rem]">
              Updated {sentimentData.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        {/* Sentiment Distribution */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-black/30 p-2 rounded-lg border border-gray-800 text-center">
            <div className="text-green-400 text-xl font-bold">{sentimentData.sentiment.positive}%</div>
            <div className="text-xs text-gray-400">Positive</div>
          </div>
          <div className="bg-black/30 p-2 rounded-lg border border-gray-800 text-center">
            <div className="text-yellow-400 text-xl font-bold">{sentimentData.sentiment.neutral}%</div>
            <div className="text-xs text-gray-400">Neutral</div>
          </div>
          <div className="bg-black/30 p-2 rounded-lg border border-gray-800 text-center">
            <div className="text-red-400 text-xl font-bold">{sentimentData.sentiment.negative}%</div>
            <div className="text-xs text-gray-400">Negative</div>
          </div>
        </div>
        
        {/* Social Volume */}
        <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-white text-sm flex items-center">
              <Globe className="h-3.5 w-3.5 mr-1 text-[#00e0ff]" />
              Social Volume (24h)
            </h4>
            <div className="flex items-center text-sm">
              <span className="text-white font-medium">{formatNumber(sentimentData.volume.total24h)}</span>
              <span className={`ml-2 text-xs ${getChangeDisplay(sentimentData.volume.change24h).color} flex items-center`}>
                {React.createElement(getChangeDisplay(sentimentData.volume.change24h).icon, { className: "h-3 w-3 mr-0.5" })}
                {getChangeDisplay(sentimentData.volume.change24h).text}
              </span>
            </div>
          </div>
        </div>
        
        {/* Sources Breakdown */}
        <div className="space-y-3">
          <h4 className="text-white text-sm">Top Sources</h4>
          
          {sentimentData.sources.map((source, index) => (
            <div key={index} className="flex items-center justify-between bg-black/20 p-2 rounded-lg hover:bg-black/30 transition-colors">
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  {source.name === "Twitter" && <Twitter className="h-4 w-4 text-blue-400" />}
                  {source.name === "Discord" && <div className="text-indigo-400 text-sm"><i className="discord icon">Discord</i></div>}
                  {source.name === "Telegram" && <div className="text-blue-400 text-sm"><i className="telegram icon">Telegram</i></div>}
                  {source.name === "Reddit" && <div className="text-orange-400 text-sm"><i className="reddit icon">Reddit</i></div>}
                  {source.name === "YouTube" && <div className="text-red-400 text-sm"><i className="youtube icon">YouTube</i></div>}
                </div>
                <div className="text-sm text-white">{source.name}</div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-400">{formatNumber(source.count)}</div>
                <div className={`text-xs ${getSentimentColor(source.sentiment)}`}>{source.sentiment}</div>
                <div className={`text-xs ${getChangeDisplay(source.change).color} flex items-center`}>
                  {React.createElement(getChangeDisplay(source.change).icon, { className: "h-3 w-3 mr-0.5" })}
                  {getChangeDisplay(source.change).text}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Trending Tags */}
        <div className="space-y-2">
          <h4 className="text-white text-sm flex items-center">
            <TrendingUp className="h-3.5 w-3.5 mr-1 text-[#ff00ff]" />
            Trending Tags
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {sentimentData.trending.map((tag, index) => (
              <Badge 
                key={index} 
                className="bg-[#ff00ff]/10 hover:bg-[#ff00ff]/20 border-[#ff00ff]/30 text-white py-1 transition-colors cursor-pointer"
              >
                {tag.tag}
                <span className="ml-1 text-xs text-gray-400">{formatNumber(tag.count)}</span>
                <span className={`ml-1 text-xs ${getChangeDisplay(tag.change).color}`}>
                  {React.createElement(getChangeDisplay(tag.change).icon, { className: "inline h-2 w-2" })}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenSocialSentiment;