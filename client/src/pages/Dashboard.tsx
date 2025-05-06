import React, { useState, useEffect } from 'react';
import { useChonkWallet } from '@/hooks/useChonkWallet';
import WalletConnectingOverlay from '@/components/WalletConnectingOverlay';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, BarChart2, Users, Layers, TrendingUp, Flame, Plus, ExternalLink } from 'lucide-react';

import ChonkTokenLogo from '@/components/ChonkTokenLogo';
import PriceChart from '@/components/PriceChart';
import TokenStats from '@/components/TokenStats';
import LivePrice from '@/components/LivePrice';
import AnimatedChonkCharacter from '@/components/AnimatedChonkCharacter';
import TokenDistributionChart from '@/components/TokenDistributionChart';
import MarketDataPanel from '@/components/MarketDataPanel';
import ExchangeListings from '@/components/ExchangeListings';
import CommunityUpdates from '@/components/CommunityUpdates';
import TokenClaimCard from '@/components/TokenClaimCard';

const Dashboard = () => {
  const { connectWallet, account, getTokenBalance } = useChonkWallet();
  const [balance, setBalance] = useState<string | null>(null);
  
  // Get token balance when account is connected
  useEffect(() => {
    if (account) {
      getTokenBalance(account.chainType).then(setBalance);
    }
  }, [account, getTokenBalance]);
  const [activeTab, setActiveTab] = useState("overview");

  // Token Stats Data
  const tokenStats = [
    {
      label: "Current Price",
      value: "$0.00042069",
      change: "+12.8%",
      period: "24h"
    },
    {
      label: "Market Cap",
      value: "$4.2M",
      change: "+9.3%",
      period: "24h"
    },
    {
      label: "Trading Volume",
      value: "$890K",
      change: "+24.5%",
      period: "24h"
    },
    {
      label: "Holders",
      value: "9,420",
      change: "+342",
      period: "24h"
    }
  ];

  // Token Distribution Data
  const distributionData = [
    { name: "Public Sale", value: 40, color: "#ff00ff" },
    { name: "Liquidity", value: 25, color: "#00e0ff" },
    { name: "Community", value: 20, color: "#8400ff" },
    { name: "Team & Dev", value: 15, color: "#ff00a2" }
  ];
  
  // Market Stats Data
  const marketStats = [
    {
      label: "Market Cap",
      value: "$4,200,690",
      change: "+9.3%",
      isPositive: true,
      icon: <TrendingUp className="h-4 w-4 text-[#ff00ff]" />
    },
    {
      label: "24h Volume",
      value: "$890,420",
      change: "+24.5%",
      isPositive: true,
      icon: <BarChart2 className="h-4 w-4 text-[#ff00ff]" />
    },
    {
      label: "Holders",
      value: "9,420",
      change: "+342",
      isPositive: true,
      icon: <Users className="h-4 w-4 text-[#ff00ff]" />
    },
    {
      label: "Total Supply",
      value: "1,000,000,000",
      icon: <Layers className="h-4 w-4 text-[#ff00ff]" />
    },
    {
      label: "Burned",
      value: "123,456,789",
      change: "+2.1%",
      isPositive: true,
      icon: <Flame className="h-4 w-4 text-[#ff00ff]" />
    }
  ];
  
  // Social Stats Data
  const socialStats = [
    {
      platform: "Twitter",
      metric: "Followers",
      value: "42.8K",
      change: "+2.3K",
      isPositive: true,
    },
    {
      platform: "Telegram",
      metric: "Members",
      value: "26.9K",
      change: "+1.5K",
      isPositive: true,
    },
    {
      platform: "Discord",
      metric: "Members",
      value: "18.5K",
      change: "+960",
      isPositive: true,
    },
    {
      platform: "GitHub",
      metric: "Stars",
      value: "1.2K",
      change: "+108",
      isPositive: true,
    }
  ];
  
  // Exchange Listings
  const exchangeListings = [
    {
      name: "Uniswap",
      logo: "/images/exchanges/uniswap.svg",
      url: "https://app.uniswap.org/",
      tradingPair: "CHONK9K/ETH",
      liquidityRating: 5,
      volume24h: "$432K",
      tag: "HOT" as "HOT"
    },
    {
      name: "Raydium",
      logo: "/images/exchanges/raydium.svg",
      url: "https://raydium.io/",
      tradingPair: "CHONK9K/USDC",
      liquidityRating: 4,
      volume24h: "$285K",
    },
    {
      name: "Jupiter",
      logo: "/images/exchanges/jupiter.svg",
      url: "https://jup.ag/",
      tradingPair: "CHONK9K/SOL",
      liquidityRating: 4,
      volume24h: "$142K",
    },
    {
      name: "Orca",
      logo: "/images/exchanges/orca.svg",
      url: "https://www.orca.so/",
      tradingPair: "CHONK9K/SOL",
      liquidityRating: 3,
      volume24h: "$98K",
    },
    {
      name: "Bybit",
      logo: "/images/exchanges/bybit.svg",
      url: "https://www.bybit.com/",
      tradingPair: "CHONK9K/USDT",
      liquidityRating: 5,
      volume24h: "$1.2M",
      tag: "NEW" as "NEW"
    }
  ];
  
  // Community Updates
  const communityUpdates = [
    {
      type: "news" as "news",
      title: "CHONK9K Now Available on Bybit!",
      date: "May 3, 2025",
      summary: "We're excited to announce that $CHONK9K is now listed on Bybit, one of the largest cryptocurrency exchanges globally. This marks a significant milestone in our journey.",
      url: "#",
      imageUrl: "/images/news/bybit-listing.jpg"
    },
    {
      type: "twitter" as "twitter",
      title: "JUST IN: $CHONK9K reaches 10,000 holders milestone! Community strength keeps growing! 💪🚀",
      author: "@CHONK9K_Official",
      date: "May 2, 2025",
      url: "https://twitter.com/"
    },
    {
      type: "medium" as "medium",
      title: "CHONK9K Roadmap 2025: Plans for Multi-Chain Expansion and DAO Governance",
      date: "April 29, 2025",
      summary: "Our latest roadmap details the upcoming features including cross-chain interoperability, enhanced DAO governance, and new staking rewards mechanism.",
      url: "https://medium.com/"
    },
    {
      type: "discord" as "discord",
      title: "Join our AMA session with the core development team - May 5th at 7PM UTC",
      date: "April 28, 2025",
      url: "https://discord.com/"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-white">
      {/* Hero Section with City Background */}
      <div className="relative overflow-hidden">
        {/* Cyberspace Background - Unique futuristic style */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-50" 
          style={{ 
            backgroundImage: 'url(/images/cyber_city_background.png)',
            filter: 'brightness(0.5) contrast(1.3) saturate(1.2)'
          }}>
        </div>
        {/* Gradient overlay for dashboard */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-transparent to-black/70 z-0"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
          {/* Top Hero Section */}
          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Logo and Title */}
              <div className="lg:col-span-7 text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] mb-4">
                  CHONK HARD,<br/>PUMP HARDER!
                </h1>
                <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto lg:mx-0">
                  The Ultimate Meme Token on Solana with real utility, active community, and innovative tokenomics.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Button 
                    className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90 transition-opacity"
                    onClick={() => !account && connectWallet('phantom', 'solana')}
                  >
                    {account ? 'Dashboard' : 'Connect Wallet'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-black/40 border-[#ff00ff]/50 text-[#ff00ff] hover:bg-[#ff00ff]/20"
                  >
                    Buy $CHONK9K
                  </Button>
                </div>
              </div>
              
              {/* Main Hero Cat */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#00e0ff] opacity-30 blur-xl"></div>
                  <div className="relative z-10">
                    <ChonkTokenLogo size={280} useAnimation={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Live Price Banner */}
          <div className="bg-black/60 backdrop-blur-md border border-[#00e0ff]/30 rounded-xl p-4 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
              <div className="md:col-span-2">
                <LivePrice showCard={false} size="lg" className="flex items-baseline justify-center md:justify-start" />
              </div>
              <div className="md:col-span-3 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-sm text-gray-400">24h Change</p>
                  <p className="text-green-500 font-medium">+12.8%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Market Cap</p>
                  <p className="text-white font-medium">$4.2M</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Volume</p>
                  <p className="text-white font-medium">$890K</p>
                </div>
              </div>
              <div className="md:col-span-1 flex justify-center md:justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-black/40 border-[#00e0ff]/50 text-[#00e0ff] hover:bg-[#00e0ff]/20"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  More
                </Button>
              </div>
            </div>
          </div>
          
          {/* Dashboard Tabs */}
          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-black/50 border border-[#ff00ff]/20 p-1 w-full flex justify-start overflow-x-auto">
                <TabsTrigger value="overview" className="text-sm data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-white">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="token" className="text-sm data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-white">
                  Token
                </TabsTrigger>
                <TabsTrigger value="charts" className="text-sm data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-white">
                  Charts
                </TabsTrigger>
                <TabsTrigger value="community" className="text-sm data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-white">
                  Community
                </TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Enhanced Price Chart */}
                  <div className="lg:col-span-8">
                    <PriceChart 
                      priceData={{
                        currentPrice: "$0.00042069",
                        change: "+12.8%",
                        lowHigh: "$0.00038 / $0.00045",
                        volume: "$890K"
                      }}
                      showExternalLink={true}
                    />
                  </div>
                  
                  {/* Market Data */}
                  <div className="lg:col-span-4">
                    <MarketDataPanel 
                      marketStats={marketStats}
                      socialStats={socialStats}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Token Tab */}
              <TabsContent value="token" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Token Distribution Chart */}
                  <div className="lg:col-span-6">
                    <TokenDistributionChart data={distributionData} />
                  </div>
                  
                  {/* Exchange Listings */}
                  <div className="lg:col-span-6">
                    <ExchangeListings exchanges={exchangeListings} />
                  </div>
                  
                  {/* Connected Wallet & Balance */}
                  <div className="lg:col-span-12">
                    {!account ? (
                      <Card className="bg-black/60 backdrop-blur-md border border-[#ff00ff]/30 rounded-xl overflow-hidden">
                        <CardContent className="p-6 text-center">
                          <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
                          <p className="text-gray-400 text-sm mb-4">Connect your wallet to view your $CHONK9K balance and access exclusive features.</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            <div 
                              onClick={() => connectWallet('phantom', 'solana')}
                              className="bg-black/50 p-3 rounded-lg border border-[#ab9ff2]/50 hover:border-[#ab9ff2] cursor-pointer transition-all hover:scale-105"
                            >
                              <div className="flex flex-col items-center">
                                <img src="/images/wallets/phantom.svg" alt="Phantom" className="w-12 h-12 mb-2" />
                                <span className="text-sm text-white">Phantom</span>
                              </div>
                            </div>
                            
                            <div 
                              onClick={() => connectWallet('solflare', 'solana')}
                              className="bg-black/50 p-3 rounded-lg border border-[#FC9D0F]/50 hover:border-[#FC9D0F] cursor-pointer transition-all hover:scale-105"
                            >
                              <div className="flex flex-col items-center">
                                <img src="/images/wallets/solflare.svg" alt="Solflare" className="w-12 h-12 mb-2" />
                                <span className="text-sm text-white">Solflare</span>
                              </div>
                            </div>
                            
                            <div 
                              onClick={() => connectWallet('metamask', 'solana')}
                              className="bg-black/50 p-3 rounded-lg border border-[#F6851B]/50 hover:border-[#F6851B] cursor-pointer transition-all hover:scale-105"
                            >
                              <div className="flex flex-col items-center">
                                <img src="/images/wallets/metamask.svg" alt="MetaMask" className="w-12 h-12 mb-2" />
                                <span className="text-sm text-white">MetaMask</span>
                              </div>
                            </div>
                            
                            <div 
                              onClick={() => connectWallet('phantom', 'solana')}
                              className="bg-black/50 p-3 rounded-lg border border-[#3B99FC]/50 hover:border-[#3B99FC] cursor-pointer transition-all hover:scale-105"
                            >
                              <div className="flex flex-col items-center">
                                <img src="/images/wallets/walletconnect.svg" alt="WalletConnect" className="w-12 h-12 mb-2" />
                                <span className="text-sm text-white">WalletConnect</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={(e) => {
                              e.preventDefault();
                              connectWallet('phantom', 'solana');
                            }}
                            className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90 transition-opacity w-full"
                          >
                            Connect Wallet
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="bg-black/60 backdrop-blur-md border border-[#00e0ff]/30 rounded-xl overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                              <h3 className="text-xl font-bold text-white">Connected Wallet</h3>
                              <div className="flex items-center mt-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] flex items-center justify-center mr-2">
                                  <span className="text-white text-xs font-bold">SOL</span>
                                </div>
                                <p className="text-[#00e0ff] text-lg">
                                  {account.address.substring(0, 6)}...{account.address.substring(account.address.length - 4)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="bg-black/40 px-6 py-4 rounded-lg border border-[#00e0ff]/30">
                              <p className="text-sm text-gray-400 mb-1">Your $CHONK9K Balance</p>
                              <div className="flex items-center">
                                <div className="w-8 h-8 mr-2">
                                  <ChonkTokenLogo size={32} useAnimation={false} />
                                </div>
                                <p className="text-2xl font-bold text-[#00e0ff]">{balance || '0'}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  
                  {/* Token Claim Card */}
                  <div className="lg:col-span-6">
                    <TokenClaimCard />
                  </div>
                </div>
              </TabsContent>
              
              {/* Charts Tab */}
              <TabsContent value="charts" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Enhanced Price Chart - Full Width */}
                  <div className="lg:col-span-12">
                    <PriceChart 
                      priceData={{
                        currentPrice: "$0.00042069",
                        change: "+12.8%",
                        lowHigh: "$0.00038 / $0.00045",
                        volume: "$890K"
                      }}
                      showExternalLink={true}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Community Tab */}
              <TabsContent value="community" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Community Updates */}
                  <div className="lg:col-span-7">
                    <CommunityUpdates updates={communityUpdates} />
                  </div>
                  
                  {/* Social Stats & Quick Links */}
                  <div className="lg:col-span-5">
                    <Card className="bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden mb-6">
                      <div className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3 px-4 pt-4">
                        <h3 className="text-lg font-bold text-[#ff00ff] flex items-center">
                          <Users className="mr-2 h-5 w-5" />
                          Community Stats
                        </h3>
                      </div>
                      <CardContent className="p-4 space-y-4">
                        {socialStats.map((stat, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-gray-800">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-black/80 flex items-center justify-center mr-3 overflow-hidden">
                                <img 
                                  src={`/images/social/${stat.platform.toLowerCase()}.svg`} 
                                  alt={stat.platform}
                                  onError={(e) => {
                                    // Fallback if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/social/default.svg';
                                  }}
                                  className="h-4 w-4"
                                />
                              </div>
                              <div>
                                <div className="text-sm text-white">{stat.platform}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-medium">{stat.value}</div>
                              {stat.change && (
                                <div className={`text-xs flex items-center justify-end ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                  {stat.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                                  {stat.change}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3 px-4 pt-4">
                        <h3 className="text-lg font-bold text-[#ff00ff] flex items-center">
                          <span className="mr-2">🔗</span>
                          Quick Links
                        </h3>
                      </div>
                      <CardContent className="p-4 grid grid-cols-2 gap-3">
                        <Button variant="outline" className="bg-[#1DA1F2]/10 border-[#1DA1F2]/50 text-white hover:bg-[#1DA1F2]/20">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 fill-[#1DA1F2]" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          Twitter
                        </Button>
                        <Button variant="outline" className="bg-[#5865F2]/10 border-[#5865F2]/50 text-white hover:bg-[#5865F2]/20">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 fill-[#5865F2]" viewBox="0 0 24 24">
                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3864-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.955-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.955-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                          </svg>
                          Discord
                        </Button>
                        <Button variant="outline" className="bg-[#25D366]/10 border-[#25D366]/50 text-white hover:bg-[#25D366]/20">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 fill-[#25D366]" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          Telegram
                        </Button>
                        <Button variant="outline" className="bg-[#333]/10 border-[#333]/50 text-white hover:bg-[#333]/20">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 fill-white" viewBox="0 0 24 24">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                          </svg>
                          GitHub
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="bg-black/50 backdrop-blur-md border border-[#ff00ff]/30 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,0,255,0.5)]">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-14 h-14 mb-3 flex items-center justify-center rounded-full bg-[#ff00ff]/20">
                  <Flame className="h-7 w-7 text-[#ff00ff]" />
                </div>
                <h3 className="text-xl font-bold text-[#ff00ff] mb-2">TOKENOMICS</h3>
                <p className="text-gray-400 text-sm mb-4 flex-grow">Revolutionary burn mechanism with 1% burn and 1% development fee built into each transaction.</p>
                <Button variant="outline" className="mt-auto w-full bg-[#ff00ff]/20 text-[#ff00ff] border-[#ff00ff]/50 hover:bg-[#ff00ff]/30">
                  VIEW DETAILS
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-black/50 backdrop-blur-md border border-[#00e0ff]/30 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,224,255,0.5)]">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-14 h-14 mb-3 flex items-center justify-center rounded-full bg-[#00e0ff]/20">
                  <Plus className="h-7 w-7 text-[#00e0ff]" />
                </div>
                <h3 className="text-xl font-bold text-[#00e0ff] mb-2">HOW TO BUY</h3>
                <p className="text-gray-400 text-sm mb-4 flex-grow">Connect your wallet and buy $CHONK9K directly on our platform or through supported DEXes.</p>
                <Button variant="outline" className="mt-auto w-full bg-[#00e0ff]/20 text-[#00e0ff] border-[#00e0ff]/50 hover:bg-[#00e0ff]/30">
                  BUY NOW
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-black/50 backdrop-blur-md border border-[#9945FF]/30 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(153,69,255,0.5)]">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-14 h-14 mb-3 flex items-center justify-center rounded-full bg-[#9945FF]/20">
                  <Layers className="h-7 w-7 text-[#9945FF]" />
                </div>
                <h3 className="text-xl font-bold text-[#9945FF] mb-2">MULTI-CHAIN</h3>
                <p className="text-gray-400 text-sm mb-4 flex-grow">Seamlessly bridge your $CHONK9K between multiple blockchains including Solana, Base, and Ethereum.</p>
                <Button variant="outline" className="mt-auto w-full bg-[#9945FF]/20 text-[#9945FF] border-[#9945FF]/50 hover:bg-[#9945FF]/30">
                  EXPLORE CHAINS
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Animated Chonk Character */}
          <div className="flex justify-center mt-10">
            <AnimatedChonkCharacter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
