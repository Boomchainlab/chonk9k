import React, { useState } from 'react';
import { useChonkWallet } from '@/hooks/useChonkWallet';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewChonkLogo from '@/components/NewChonkLogo';
import PriceChart from '@/components/PriceChart';
import TokenStats from '@/components/TokenStats';
import LivePrice from '@/components/LivePrice';
import AnimatedChonkCharacter from '@/components/AnimatedChonkCharacter';

const Dashboard = () => {
  const { connectWallet, account, balance } = useChonkWallet();
  const [activeTab, setActiveTab] = useState("tokenomics");

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-white">
      {/* Hero Section with City Background */}
      <div className="relative overflow-hidden">
        {/* Cityscape Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-50" 
          style={{ 
            backgroundImage: 'url(/images/cyber_city_background.png)',
            filter: 'brightness(0.6) contrast(1.2)'
          }}>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Stats Panel */}
            <div className="lg:col-span-3">
              <Card className="bg-black/50 backdrop-blur-md border border-[#00e0ff]/30 rounded-xl overflow-hidden h-full">
                <div className="bg-gradient-to-r from-[#ff00ff]/20 to-[#00e0ff]/20 px-4 py-3 border-b border-[#00e0ff]/30">
                  <h3 className="text-lg font-bold text-[#00e0ff] flex items-center">
                    <span className="mr-2 text-2xl">ℂ</span>
                    <span>TOKENOMICS</span>
                  </h3>
                </div>
                <CardContent className="p-4 space-y-4">
                  {/* Price Box */}
                  <div className="bg-black/60 rounded-lg p-3 border border-[#ff00ff]/30">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Current Price</span>
                      <span className="text-xs px-2 py-1 bg-[#ff00ff]/20 text-[#ff00ff] rounded-full">LIVE</span>
                    </div>
                    <div className="mt-2">
                      <LivePrice showCard={false} size="lg" className="flex items-baseline" />
                    </div>
                  </div>
                  
                  {/* Token Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-sm text-gray-400">Market Cap</span>
                      <span className="text-sm text-white">$4.2M</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-sm text-gray-400">24h Volume</span>
                      <span className="text-sm text-white">$890K</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-sm text-gray-400">Holders</span>
                      <span className="text-sm text-white">9,420</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-sm text-gray-400">Total Supply</span>
                      <span className="text-sm text-white">9,000,000,000</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-sm text-gray-400">Circ. Supply</span>
                      <span className="text-sm text-white">6,420,000,000</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-400">Fee</span>
                      <span className="text-sm text-white">2% (1% Burn, 1% Dev)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Center Column - Main Content */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] mb-4">
                  CHONK HARD,<br/>PUMP HARDER!
                </h1>
              </div>
              
              {/* Main Hero Cat */}
              <div className="flex justify-center my-4">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#00e0ff] opacity-30 blur-xl"></div>
                  <div className="relative z-10">
                    <NewChonkLogo size="large" isAnimated={true} />
                  </div>
                </div>
              </div>
              
              {/* Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <Card className="bg-black/50 backdrop-blur-md border border-[#ff00ff]/30 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,0,255,0.5)]">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-16 h-16 mb-3">
                      <NewChonkLogo size="small" />
                    </div>
                    <h3 className="text-xl font-bold text-[#ff00ff] mb-2">TOKENOMICS</h3>
                    <p className="text-gray-400 text-sm mb-4">Revolutionary burn mechanism with 1% burn and 1% development fee built into each transaction.</p>
                    <Button variant="outline" className="mt-auto w-full bg-[#ff00ff]/20 text-[#ff00ff] border-[#ff00ff]/50 hover:bg-[#ff00ff]/30">
                      VIEW DETAILS
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/50 backdrop-blur-md border border-[#00e0ff]/30 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,224,255,0.5)]">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-16 h-16 mb-3">
                      <NewChonkLogo size="small" />
                    </div>
                    <h3 className="text-xl font-bold text-[#00e0ff] mb-2">HOW TO BUY</h3>
                    <p className="text-gray-400 text-sm mb-4">Connect your wallet and buy $CHONK9K directly on our platform or through supported DEXes.</p>
                    <Button variant="outline" className="mt-auto w-full bg-[#00e0ff]/20 text-[#00e0ff] border-[#00e0ff]/50 hover:bg-[#00e0ff]/30">
                      BUY NOW
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/50 backdrop-blur-md border border-[#9945FF]/30 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(153,69,255,0.5)]">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-16 h-16 mb-3">
                      <NewChonkLogo size="small" />
                    </div>
                    <h3 className="text-xl font-bold text-[#9945FF] mb-2">SOLANA BRIDGE</h3>
                    <p className="text-gray-400 text-sm mb-4">Seamlessly bridge your $CHONK9K between Base and Solana for maximum flexibility.</p>
                    <Button variant="outline" className="mt-auto w-full bg-[#9945FF]/20 text-[#9945FF] border-[#9945FF]/50 hover:bg-[#9945FF]/30">
                      BRIDGE TOKENS
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Right Column - Live Price & Buy Button */}
            <div className="lg:col-span-3">
              <Card className="bg-black/50 backdrop-blur-md border border-[#ff00ff]/30 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#ff00ff]/20 to-[#00e0ff]/20 px-4 py-3 border-b border-[#ff00ff]/30">
                  <h3 className="text-lg font-bold text-[#ff00ff] flex items-center">
                    <span className="mr-2">⚡</span>
                    <span>LIVE PRICE</span>
                  </h3>
                </div>
                <CardContent className="p-4 flex flex-col space-y-4">
                  <LivePrice className="mb-4" />
                  <div className="h-40 w-full">
                    <PriceChart priceData={{
                      currentPrice: "$0.00042069",
                      change: "+12.8%",
                      lowHigh: "$0.00038 / $0.00045",
                      volume: "$890K"
                    }} />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-black/60 rounded-lg p-4 border border-[#00e0ff]/30">
                      <h4 className="text-center text-lg font-bold text-[#00e0ff] mb-2">HOW TO BUY?</h4>
                      <div className="flex flex-col space-y-2">
                        <Button className="w-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90 transition-opacity">
                          BUY WITH WALLET
                        </Button>
                        <Button className="w-full bg-black/50 border border-[#00e0ff] text-[#00e0ff] hover:bg-[#00e0ff]/20 transition-colors">
                          BUY ON UNISWAP
                        </Button>
                      </div>
                    </div>
                    
                    {!account ? (
                      <div className="flex justify-center">
                        <Button 
                          onClick={connectWallet}
                          className="w-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90 transition-opacity"
                        >
                          CONNECT WALLET
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-black/60 rounded-lg p-3 border border-[#00e0ff]/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-400">Connected Wallet</p>
                            <p className="text-sm text-[#00e0ff]">
                              {account.substring(0, 6)}...{account.substring(account.length - 4)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Balance</p>
                            <p className="text-sm text-[#00e0ff]">{balance || '0'} CHONK</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
