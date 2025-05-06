import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, AreaChart } from 'lucide-react';
import type { TokenMarketData } from '@/services/tokenMarketService';

interface ChonkMoodIndicatorProps {
  marketData: TokenMarketData;
  className?: string;
}

const ChonkMoodIndicator: React.FC<ChonkMoodIndicatorProps> = ({ 
  marketData,
  className = ''
}) => {
  // Determine Chonk's mood based on various market factors
  const mood = useMemo(() => {
    // Extract key metrics
    const priceChange = parseFloat(marketData.priceChange24h);
    const trendingScore = marketData.trending.overall;
    const volumeChange = ((parseFloat(marketData.volume24h) - 5000000) / 5000000) * 100; // Simulated relative to average
    
    // Calculate mood score (-100 to +100)
    let moodScore = 0;
    
    // Price change impact (heavily weighted)
    moodScore += priceChange * 3;
    
    // Trending sentiment impact
    moodScore += (trendingScore - 50) * 0.8;
    
    // Volume change impact
    moodScore += volumeChange * 0.4;
    
    // Map to mood categories
    if (moodScore > 50) return 'ecstatic';
    if (moodScore > 30) return 'excited';
    if (moodScore > 10) return 'happy';
    if (moodScore > -10) return 'neutral';
    if (moodScore > -30) return 'concerned';
    if (moodScore > -50) return 'worried';
    return 'fearful';
  }, [marketData]);
  
  // Get the mood description and color
  const getMoodDetails = (mood: string) => {
    const details = {
      ecstatic: {
        color: 'from-[#ff00ff] to-[#00e0ff]',
        title: 'CYBER CHONK IS ECSTATIC',
        description: 'The pump is unstoppable! Chonk is experiencing pure cybernetic bliss!',
        emoji: '🚀',
        bgColor: 'bg-[#ff00ff]/20',
        borderColor: 'border-[#ff00ff]',
        textColor: 'text-[#ff00ff]',
        expression: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Ecstatic face with stars in eyes -->
            <circle cx="50" cy="50" r="45" fill="#000" stroke="url(#ecstaticGradient)" stroke-width="3" />
            <defs>
              <linearGradient id="ecstaticGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ff00ff" />
                <stop offset="100%" stop-color="#00e0ff" />
              </linearGradient>
            </defs>
            <!-- Star-shaped eyes -->
            <path d="M35,40 L38,35 L41,40 L46,37 L43,42 L48,45 L43,48 L46,53 L41,50 L38,55 L35,50 L30,53 L33,48 L28,45 L33,42 L30,37 Z" fill="#ff00ff" />
            <path d="M65,40 L68,35 L71,40 L76,37 L73,42 L78,45 L73,48 L76,53 L71,50 L68,55 L65,50 L60,53 L63,48 L58,45 L63,42 L60,37 Z" fill="#00e0ff" />
            <!-- Big smile with laugh lines -->
            <path d="M30,55 C40,75 60,75 70,55" fill="none" stroke="#ff00ff" stroke-width="3" />
            <path d="M25,45 C28,42 31,42 33,45" fill="none" stroke="#ff00ff" stroke-width="1.5" />
            <path d="M75,45 C72,42 69,42 67,45" fill="none" stroke="#00e0ff" stroke-width="1.5" />
            <!-- Digital sparkles -->
            <circle cx="20" cy="30" r="2" fill="#ff00ff"><animate attributeName="opacity" from="1" to="0" dur="0.8s" repeatCount="indefinite" /></circle>
            <circle cx="80" cy="30" r="2" fill="#00e0ff"><animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" /></circle>
            <circle cx="25" cy="70" r="2" fill="#ff00ff"><animate attributeName="opacity" from="1" to="0" dur="1.2s" repeatCount="indefinite" /></circle>
            <circle cx="75" cy="70" r="2" fill="#00e0ff"><animate attributeName="opacity" from="1" to="0" dur="0.9s" repeatCount="indefinite" /></circle>
          </svg>
        `
      },
      excited: {
        color: 'from-[#00e0ff] to-[#00aaff]',
        title: 'CYBER CHONK IS EXCITED',
        description: 'The charts are looking bullish! Chonk is full of cyber energy!',
        emoji: '⚡',
        bgColor: 'bg-[#00e0ff]/20',
        borderColor: 'border-[#00e0ff]',
        textColor: 'text-[#00e0ff]',
        expression: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Excited face -->
            <circle cx="50" cy="50" r="45" fill="#000" stroke="url(#excitedGradient)" stroke-width="3" />
            <defs>
              <linearGradient id="excitedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00e0ff" />
                <stop offset="100%" stop-color="#00aaff" />
              </linearGradient>
            </defs>
            <!-- Lightning bolt eyes -->
            <path d="M35,35 L38,41 L33,44 L40,52 L37,42 L42,39 Z" fill="#00e0ff" />
            <path d="M65,35 L68,41 L63,44 L70,52 L67,42 L72,39 Z" fill="#00e0ff" />
            <!-- Big smile -->
            <path d="M30,60 C40,72 60,72 70,60" fill="none" stroke="#00e0ff" stroke-width="3" />
            <!-- Excited eyebrows -->
            <path d="M25,30 L45,30" fill="none" stroke="#00e0ff" stroke-width="2" />
            <path d="M55,30 L75,30" fill="none" stroke="#00e0ff" stroke-width="2" />
          </svg>
        `
      },
      happy: {
        color: 'from-[#00ff95] to-[#00e0ff]',
        title: 'CYBER CHONK IS HAPPY',
        description: 'Markets are looking good. Chonk is pleased with the gains!',
        emoji: '😺',
        bgColor: 'bg-[#00ff95]/20',
        borderColor: 'border-[#00ff95]',
        textColor: 'text-[#00ff95]',
        expression: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Happy face -->
            <circle cx="50" cy="50" r="45" fill="#000" stroke="url(#happyGradient)" stroke-width="3" />
            <defs>
              <linearGradient id="happyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00ff95" />
                <stop offset="100%" stop-color="#00e0ff" />
              </linearGradient>
            </defs>
            <!-- Normal eyes -->
            <circle cx="35" cy="40" r="7" fill="#00ff95" />
            <circle cx="65" cy="40" r="7" fill="#00e0ff" />
            <!-- Happy smile -->
            <path d="M30,55 C40,70 60,70 70,55" fill="none" stroke="#00ff95" stroke-width="3" />
          </svg>
        `
      },
      neutral: {
        color: 'from-[#b0b0b0] to-[#808080]',
        title: 'CYBER CHONK IS NEUTRAL',
        description: 'The market is stable. Chonk is monitoring the situation.',
        emoji: '😐',
        bgColor: 'bg-gray-500/20',
        borderColor: 'border-gray-500',
        textColor: 'text-gray-400',
        expression: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Neutral face -->
            <circle cx="50" cy="50" r="45" fill="#000" stroke="#808080" stroke-width="3" />
            <!-- Digital eyes -->
            <rect x="25" y="40" width="20" height="5" rx="2" fill="#a0a0a0" />
            <rect x="55" y="40" width="20" height="5" rx="2" fill="#a0a0a0" />
            <!-- Straight line mouth -->
            <line x1="35" y1="65" x2="65" y2="65" stroke="#808080" stroke-width="3" stroke-linecap="round" />
            <!-- Digital noise -->
            <rect x="30" y="30" width="2" height="2" fill="#808080" />
            <rect x="68" y="32" width="2" height="2" fill="#808080" />
            <rect x="45" y="75" width="2" height="2" fill="#808080" />
          </svg>
        `
      },
      concerned: {
        color: 'from-[#ffcc00] to-[#ff9900]',
        title: 'CYBER CHONK IS CONCERNED',
        description: 'Market conditions are uncertain. Chonk is cautiously monitoring.',
        emoji: '😾',
        bgColor: 'bg-[#ffcc00]/20',
        borderColor: 'border-[#ffcc00]',
        textColor: 'text-[#ffcc00]',
        expression: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Concerned face -->
            <circle cx="50" cy="50" r="45" fill="#000" stroke="url(#concernedGradient)" stroke-width="3" />
            <defs>
              <linearGradient id="concernedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffcc00" />
                <stop offset="100%" stop-color="#ff9900" />
              </linearGradient>
            </defs>
            <!-- Narrowed eyes -->
            <ellipse cx="35" cy="40" rx="8" ry="5" fill="#ffcc00" />
            <ellipse cx="65" cy="40" rx="8" ry="5" fill="#ff9900" />
            <!-- Slightly concerned mouth -->
            <path d="M35,65 C45,60 55,60 65,65" fill="none" stroke="#ffcc00" stroke-width="3" />
            <!-- Concerned eyebrows -->
            <path d="M25,30 L38,35" fill="none" stroke="#ffcc00" stroke-width="2" />
            <path d="M75,30 L62,35" fill="none" stroke="#ff9900" stroke-width="2" />
          </svg>
        `
      },
      worried: {
        color: 'from-[#ff9900] to-[#ff3300]',
        title: 'CYBER CHONK IS WORRIED',
        description: 'Market conditions look bearish. Chonk is concerned about the dip.',
        emoji: '😿',
        bgColor: 'bg-[#ff9900]/20',
        borderColor: 'border-[#ff9900]',
        textColor: 'text-[#ff9900]',
        expression: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Worried face -->
            <circle cx="50" cy="50" r="45" fill="#000" stroke="url(#worriedGradient)" stroke-width="3" />
            <defs>
              <linearGradient id="worriedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ff9900" />
                <stop offset="100%" stop-color="#ff3300" />
              </linearGradient>
            </defs>
            <!-- Worried eyes -->
            <ellipse cx="35" cy="40" rx="7" ry="6" fill="#ff9900" />
            <ellipse cx="65" cy="40" rx="7" ry="6" fill="#ff3300" />
            <!-- Digital eye glint -->
            <rect x="32" y="37" width="3" height="3" fill="#fff" opacity="0.7" />
            <rect x="62" y="37" width="3" height="3" fill="#fff" opacity="0.7" />
            <!-- Worried mouth -->
            <path d="M35,70 C45,60 55,60 65,70" fill="none" stroke="#ff9900" stroke-width="3" />
            <!-- Worried eyebrows -->
            <path d="M25,30 L40,37" fill="none" stroke="#ff9900" stroke-width="2" />
            <path d="M75,30 L60,37" fill="none" stroke="#ff3300" stroke-width="2" />
          </svg>
        `
      },
      fearful: {
        color: 'from-[#ff3300] to-[#ff0000]',
        title: 'CYBER CHONK IS FEARFUL',
        description: 'The market is down bad. Chonk is experiencing maximum cyber anxiety!',
        emoji: '🙀',
        bgColor: 'bg-[#ff0000]/20',
        borderColor: 'border-[#ff0000]',
        textColor: 'text-[#ff0000]',
        expression: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Fearful face -->
            <circle cx="50" cy="50" r="45" fill="#000" stroke="url(#fearfulGradient)" stroke-width="3" />
            <defs>
              <linearGradient id="fearfulGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ff3300" />
                <stop offset="100%" stop-color="#ff0000" />
              </linearGradient>
            </defs>
            <!-- Wide shocked eyes -->
            <ellipse cx="35" cy="40" rx="8" ry="10" fill="#ff3300" />
            <ellipse cx="65" cy="40" rx="8" ry="10" fill="#ff0000" />
            <!-- Pupil glints -->
            <circle cx="35" cy="40" r="3" fill="#fff" />
            <circle cx="65" cy="40" r="3" fill="#fff" />
            <!-- Shocked open mouth -->
            <ellipse cx="50" cy="70" rx="15" ry="10" fill="#ff0000" opacity="0.7" />
            <ellipse cx="50" cy="70" rx="10" ry="6" fill="#000" />
            <!-- Vertical "error" lines -->
            <line x1="15" y1="30" x2="15" y2="40" stroke="#ff0000" stroke-width="1" />
            <line x1="85" y1="30" x2="85" y2="40" stroke="#ff0000" stroke-width="1" />
            <line x1="20" y1="60" x2="20" y2="75" stroke="#ff0000" stroke-width="1" />
            <line x1="80" y1="60" x2="80" y2="75" stroke="#ff0000" stroke-width="1" />
            <!-- Fearful raised eyebrows -->
            <path d="M25,25 L40,30" fill="none" stroke="#ff3300" stroke-width="2" />
            <path d="M75,25 L60,30" fill="none" stroke="#ff0000" stroke-width="2" />
          </svg>
        `
      }
    };
    
    return details[mood as keyof typeof details];
  };
  
  const moodDetails = getMoodDetails(mood);
  
  return (
    <Card className={`bg-black/60 backdrop-blur-xl rounded-xl border ${moodDetails.borderColor}/30 shadow-lg overflow-hidden ${className}`}>
      <CardHeader className={`bg-gradient-to-r from-${moodDetails.bgColor} to-transparent border-b ${moodDetails.borderColor}/30 pb-3`}>
        <CardTitle className="text-lg font-bold text-white flex items-center justify-between">
          <div className="flex items-center">
            <Brain className={`mr-2 h-5 w-5 ${moodDetails.textColor}`} />
            <span>Cyber Chonk Mood</span>
          </div>
          <Badge className={`${moodDetails.bgColor} ${moodDetails.textColor} border ${moodDetails.borderColor}/50`}>
            {mood.toUpperCase()}
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-400">
          AI-powered sentiment analysis based on market performance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center">
          <div className="w-1/3">
            <div 
              className="w-24 h-24 mx-auto" 
              dangerouslySetInnerHTML={{ __html: moodDetails.expression }}
            />
          </div>
          <div className="w-2/3">
            <h3 className={`text-lg font-bold ${moodDetails.textColor} mb-1`}>
              {moodDetails.title}
            </h3>
            <p className="text-gray-300 text-sm">
              {moodDetails.description}
            </p>
            
            <div className="mt-2 flex space-x-2">
              <Badge className={`${moodDetails.bgColor} ${moodDetails.textColor} border ${moodDetails.borderColor}/50`}>
                <AreaChart className="mr-1 h-3 w-3" />
                {parseFloat(marketData.priceChange24h) >= 0 ? '+' : ''}{marketData.priceChange24h}%
              </Badge>
              <Badge className={`${moodDetails.bgColor} ${moodDetails.textColor} border ${moodDetails.borderColor}/50`}>
                <Zap className="mr-1 h-3 w-3" />
                {marketData.trending.overall}/100
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 p-3 rounded-lg border border-gray-800 text-sm text-gray-300">
          <p>
            <span className="text-white font-medium">Mood Factors:</span> Price movements, social sentiment, trading volume, market volatility, and community activity all influence Cyber Chonk's mood.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChonkMoodIndicator;