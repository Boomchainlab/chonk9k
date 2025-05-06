import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import ChonkTokenLogo from "@/components/ChonkTokenLogo";
import TokenStats from "@/components/TokenStats";
import PriceChart from "@/components/PriceChart";
import Roadmap from "@/components/Roadmap";
import TeamMember from "@/components/TeamMember";
import TokenBuyForm from "@/components/TokenBuyForm";
import { Separator } from "@/components/ui/separator";

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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

  // Price chart data
  const priceData = {
    currentPrice: "$0.00042069",
    change: "+12.8%",
    lowHigh: "$0.00038 / $0.00045",
    volume: "$890K"
  };

  // Roadmap items
  const roadmapItems = [
    {
      phase: "Phase 1",
      title: "Launch & Initial Growth",
      period: "Q1 2024",
      items: [
        "Smart contract development and audit",
        "Website and community channels launch",
        "Initial token distribution and DEX listing",
        "Marketing campaigns and community building"
      ],
      completed: true
    },
    {
      phase: "Phase 2",
      title: "Expansion & Utility",
      period: "Q2 2024",
      items: [
        "Cross-chain bridge to Solana implementation",
        "$CHONK9K staking platform launch",
        "Centralized exchange listings (Tier 2)",
        "NFT collection development"
      ],
      completed: false
    },
    {
      phase: "Phase 3",
      title: "Global Domination",
      period: "Q3/Q4 2024",
      items: [
        "Major CEX listings (Tier 1)",
        "Chonkpump 9000 GameFi platform launch",
        "Expanded marketing with global influencers",
        "Community governance implementation"
      ],
      completed: false
    }
  ];

  // Team members
  const teamMembers = [
    {
      name: "David Okeamah",
      role: "Founder & CEO",
      bio: "Visionary crypto entrepreneur and blockchain expert. The mastermind behind the Chonk9k revolution.",
      socials: {
        twitter: "#",
        github: "#",
        linkedin: "#"
      }
    },
    {
      name: "Purr Master",
      role: "Marketing Strategist",
      bio: "Digital marketing expert with a proven track record in building cryptocurrency communities and brands.",
      socials: {
        twitter: "#",
        instagram: "#",
        linkedin: "#"
      }
    },
    {
      name: "Meow Metrics",
      role: "Tokenomics Specialist",
      bio: "Financial analyst with expertise in cryptocurrency economics and sustainable token models.",
      socials: {
        twitter: "#",
        medium: "#",
        telegram: "#"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-pink-950/20 to-black text-white">
      {/* Home Header - Unique pink/magenta style */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-pink-900/90 to-purple-900/90 backdrop-blur-sm border-b border-pink-500/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">C9K</span>
              </div>
              <span className="font-['Montserrat'] font-bold text-xl text-white">$CHONK<span className="text-[#FFB800]">9K</span></span>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <a href="#about" className="text-pink-100 hover:text-white font-medium transition">About</a>
              <a href="#tokenomics" className="text-pink-100 hover:text-white font-medium transition">Tokenomics</a>
              <a href="#roadmap" className="text-pink-100 hover:text-white font-medium transition">Roadmap</a>
              <a href="#team" className="text-pink-100 hover:text-white font-medium transition">Team</a>
              <a href="#docs" className="text-pink-100 hover:text-white font-medium transition">Documentation</a>
              <a href="#faq" className="text-pink-100 hover:text-white font-medium transition">FAQ</a>
            </nav>
            
            <Button className="bg-gradient-to-r from-primary to-[#FF8C00] text-white font-['Montserrat'] font-semibold px-6 py-2 rounded-lg shadow-lg hover:opacity-90 transition">
              Buy $CHONK9K
            </Button>
            
            <button className="md:hidden text-white" onClick={toggleMobileMenu}>
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/50 border-t border-pink-500/30">
            <a href="#about" className="block px-3 py-2 text-pink-100 hover:bg-pink-900/30 rounded-md transition">About</a>
            <a href="#tokenomics" className="block px-3 py-2 text-pink-100 hover:bg-pink-900/30 rounded-md transition">Tokenomics</a>
            <a href="#roadmap" className="block px-3 py-2 text-pink-100 hover:bg-pink-900/30 rounded-md transition">Roadmap</a>
            <a href="#team" className="block px-3 py-2 text-pink-100 hover:bg-pink-900/30 rounded-md transition">Team</a>
            <a href="#docs" className="block px-3 py-2 text-pink-100 hover:bg-pink-900/30 rounded-md transition">Documentation</a>
            <a href="#faq" className="block px-3 py-2 text-pink-100 hover:bg-pink-900/30 rounded-md transition">FAQ</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="w-full md:w-1/2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-[#0052FF]/20 text-[#0052FF] rounded-full text-sm font-medium">Base Network</span>
                <span className="px-3 py-1 bg-[#14F195]/20 text-[#14F195] rounded-full text-sm font-medium">Solana Integration</span>
              </div>
              
              <h1 className="font-['Montserrat'] font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                The <span className="text-primary">Chonkpump 9000</span> <br />
                Revolution Is Here
              </h1>
              
              <p className="text-gray-300 text-lg mb-8 max-w-xl">
                The first cross-chain meme token powering the future of feline finance. Built on Base, tagging Solana for ultimate performance.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-primary to-[#FF8C00] text-white font-['Montserrat'] font-semibold px-8 py-3 rounded-lg shadow-lg hover:opacity-90 transition">
                  Buy $CHONK9K
                </Button>
                <Button variant="outline" className="bg-dark border border-gray-700 text-white font-['Montserrat'] font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition flex items-center">
                  <i className="fas fa-file-alt mr-2"></i> Read Whitepaper
                </Button>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <ChonkTokenLogo size={280} useAnimation={true} />
            </div>
          </div>
          
          {/* Token Stats */}
          <TokenStats stats={tokenStats} />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2">
              <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-[#FFB800]/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ChonkTokenLogo size={80} useAnimation={false} />
                  <h3 className="font-['Montserrat'] text-white text-2xl ml-4">$CHONK9K</h3>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <h2 className="font-['Montserrat'] font-bold text-3xl md:text-4xl text-white mb-6">What is <span className="text-primary">$CHONK9K?</span></h2>
              
              <p className="text-gray-300 mb-6">
                $CHONK9K is the official token of the Chonkpump 9000 ecosystem, a cross-chain meme token built on Base with Solana tagging capabilities. Our mission is to bring the most adorable and powerful feline finance experience to the cryptocurrency world.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-bolt text-primary text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-['Montserrat'] font-semibold text-white text-lg mb-1">Lightning Fast Transactions</h3>
                    <p className="text-gray-400">Built on Base and tagging Solana for the ultimate speed and lowest fees in the meme token space.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-shield-alt text-primary text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-['Montserrat'] font-semibold text-white text-lg mb-1">Community Owned & Secured</h3>
                    <p className="text-gray-400">Liquidity locked, contract renounced, and fully community-driven development and governance.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-rocket text-primary text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-['Montserrat'] font-semibold text-white text-lg mb-1">Deflationary Tokenomics</h3>
                    <p className="text-gray-400">Revolutionary burn mechanism ensures your $CHONK9K grows in value over time.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-8">
                <Button variant="outline" className="inline-flex items-center px-4 py-2 bg-[#0052FF]/20 text-[#0052FF] rounded-lg">
                  <i className="fas fa-link mr-2"></i> Base Network
                </Button>
                <Button variant="outline" className="inline-flex items-center px-4 py-2 bg-[#14F195]/20 text-[#14F195] rounded-lg">
                  <i className="fas fa-link mr-2"></i> Solana Ecosystem
                </Button>
                <Button variant="outline" className="inline-flex items-center px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 transition rounded-lg">
                  <i className="fas fa-file-contract mr-2"></i> Smart Contract
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="py-16 md:py-24 bg-gradient-to-b from-dark to-dark/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-['Montserrat'] font-bold text-3xl md:text-4xl text-white mb-4">$CHONK9K <span className="text-primary">Tokenomics</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our token economics are designed for long-term sustainability and growth, with a focus on community ownership and value creation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card className="card-gradient rounded-xl border border-gray-800">
              <CardContent className="p-8">
                <h3 className="font-['Montserrat'] font-semibold text-xl text-white mb-6">Token Distribution</h3>
                
                <div className="relative h-64 w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-8 border-gray-800 relative">
                      <div className="absolute inset-0 rounded-full border-t-8 border-r-8 border-primary" style={{ clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 50%)" }}></div>
                      <div className="absolute inset-0 rounded-full border-b-8 border-l-8 border-[#FFB800]" style={{ clipPath: "polygon(0% 100%, 50% 100%, 50% 50%, 0% 50%)" }}></div>
                      <div className="absolute inset-0 rounded-full border-l-8 border-t-8 border-[#FF8C00]" style={{ clipPath: "polygon(0% 0%, 50% 0%, 50% 50%, 0% 50%)" }}></div>
                      <div className="absolute inset-0 rounded-full border-b-8 border-r-8 border-[#28A745]" style={{ clipPath: "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)" }}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-dark/80 border-4 border-gray-800 flex items-center justify-center">
                          <span className="text-white font-['Montserrat'] font-bold">9B Tokens</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-primary mr-2"></div>
                    <div>
                      <div className="text-white font-medium">Public Sale</div>
                      <div className="text-gray-400 text-sm">40% (3.6B tokens)</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#FFB800] mr-2"></div>
                    <div>
                      <div className="text-white font-medium">Liquidity</div>
                      <div className="text-gray-400 text-sm">25% (2.25B tokens)</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#FF8C00] mr-2"></div>
                    <div>
                      <div className="text-white font-medium">Community</div>
                      <div className="text-gray-400 text-sm">20% (1.8B tokens)</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#28A745] mr-2"></div>
                    <div>
                      <div className="text-white font-medium">Team & Dev</div>
                      <div className="text-gray-400 text-sm">15% (1.35B tokens)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-gradient rounded-xl border border-gray-800">
              <CardContent className="p-8">
                <h3 className="font-['Montserrat'] font-semibold text-xl text-white mb-6">Token Details</h3>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-300">Token Name</span>
                    <span className="text-white font-medium">Chonk9k Token</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-300">Token Symbol</span>
                    <span className="text-white font-medium">$CHONK9K</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-300">Total Supply</span>
                    <span className="text-white font-medium">9,000,000,000</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-300">Blockchain</span>
                    <div className="flex items-center">
                      <span className="text-[#0052FF] font-medium mr-2">Base</span>
                      <span className="text-white font-medium px-2">+</span>
                      <span className="text-[#14F195] font-medium">Solana Tag</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-300">Transaction Tax</span>
                    <span className="text-white font-medium">2% (1% Burn, 1% Development)</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-300">Launch Date</span>
                    <span className="text-white font-medium">February 20, 2024</span>
                  </div>
                </div>
                
                <a href="#" className="inline-flex items-center mt-6 text-primary hover:text-primary/90 font-medium transition">
                  <i className="fas fa-external-link-alt mr-2"></i>
                  View Contract on BaseScan
                </a>
              </CardContent>
            </Card>
          </div>
          
          {/* Transaction Fees */}
          <Card className="mt-12 card-gradient rounded-xl border border-gray-800">
            <CardContent className="p-8">
              <h3 className="font-['Montserrat'] font-semibold text-xl text-white mb-6">Transaction Fee Breakdown</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-dark/50 rounded-lg p-6 border border-gray-800">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <i className="fas fa-fire text-primary text-2xl"></i>
                  </div>
                  <h4 className="text-white font-['Montserrat'] font-semibold text-center mb-2">1% Burn</h4>
                  <p className="text-gray-400 text-center text-sm">
                    1% of every transaction is permanently burned, reducing total supply and increasing scarcity over time.
                  </p>
                </div>
                
                <div className="bg-dark/50 rounded-lg p-6 border border-gray-800">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFB800]/20 flex items-center justify-center">
                    <i className="fas fa-code text-[#FFB800] text-2xl"></i>
                  </div>
                  <h4 className="text-white font-['Montserrat'] font-semibold text-center mb-2">1% Development</h4>
                  <p className="text-gray-400 text-center text-sm">
                    1% goes to our development fund to ensure continuous improvement of the $CHONK9K ecosystem.
                  </p>
                </div>
                
                <div className="bg-dark/50 rounded-lg p-6 border border-gray-800">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#28A745]/20 flex items-center justify-center">
                    <i className="fas fa-users text-[#28A745] text-2xl"></i>
                  </div>
                  <h4 className="text-white font-['Montserrat'] font-semibold text-center mb-2">0% For Holders</h4>
                  <p className="text-gray-400 text-center text-sm">
                    No redistribution tax - we believe in natural market growth rather than artificial tokenomics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Price Chart Section */}
      <section className="py-16 md:py-20 bg-dark">
        <div className="container mx-auto px-4">
          <PriceChart priceData={priceData} />
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-16 md:py-24 bg-dark/90">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-['Montserrat'] font-bold text-3xl md:text-4xl text-white mb-4">Development <span className="text-primary">Roadmap</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our strategic plan to bring $CHONK9K to the forefront of the cryptocurrency ecosystem.
            </p>
          </div>
          
          <Roadmap items={roadmapItems} />
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 md:py-24 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-['Montserrat'] font-bold text-3xl md:text-4xl text-white mb-4">The <span className="text-primary">Chonk Squad</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Meet the dedicated team behind $CHONK9K, working to create the ultimate feline finance experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember 
                key={index}
                name={member.name}
                role={member.role}
                bio={member.bio}
                socials={member.socials}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Buy Token Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-[#FF8C00]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-['Montserrat'] font-bold text-3xl md:text-4xl text-white mb-6">Ready to join the $CHONK9K Revolution?</h2>
            
            <p className="text-white text-opacity-90 text-lg mb-8">
              Be part of the fastest-growing feline token on Base and Solana. Don't miss your chance!
            </p>
            
            <TokenBuyForm 
              currentPrice="$0.00042069"
              nextPrice="$0.00050000"
              priceIncrease="+18.85%"
              soldAmount="$3.8M"
              totalAmount="$5.5M"
              percentageSold={68}
            />
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="ghost" className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 transition text-white rounded-lg">
                <i className="fas fa-book mr-2"></i> Read Documentation
              </Button>
              <Button variant="ghost" className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 transition text-white rounded-lg">
                <i className="fab fa-telegram mr-2"></i> Join Community
              </Button>
              <Button variant="ghost" className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 transition text-white rounded-lg">
                <i className="fab fa-twitter mr-2"></i> Follow Updates
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Documentation Section */}
      <section id="docs" className="py-16 md:py-24 bg-gradient-to-b from-dark/90 to-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-['Montserrat'] font-bold text-3xl md:text-4xl text-white mb-4">Technical <span className="text-primary">Documentation</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Comprehensive details about $CHONK9K's implementation, contracts, security features, and technical specifications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contract Details */}
            <Card className="card-gradient rounded-xl border border-gray-800">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mb-5">
                  <i className="fas fa-file-contract text-primary text-2xl"></i>
                </div>
                <h3 className="font-['Montserrat'] font-semibold text-xl text-white mb-4">Smart Contract</h3>
                <p className="text-gray-400 mb-4">
                  Our ERC-20 and SPL token contracts are fully audited and secured. The code includes innovative tokenomics with automatic liquidity generation and deflationary mechanisms.
                </p>
                <div className="p-4 bg-black/30 rounded-lg border border-gray-800 mb-4">
                  <p className="text-xs font-mono text-gray-300 break-all">
                    Base Contract: 0x4C7F7b242F769B728b4cc1D4A68D568D12B21894
                  </p>
                </div>
                <div className="p-4 bg-black/30 rounded-lg border border-gray-800 mb-4">
                  <p className="text-xs font-mono text-gray-300 break-all">
                    Solana Token: HMZK29UWMs3UotWymZtpNvuWi1bKLsD13vQQCcG9Bzaa
                  </p>
                </div>
                <Button variant="outline" className="w-full mt-2 text-primary border-primary/50 hover:bg-primary/10">
                  View Contract Details
                </Button>
              </CardContent>
            </Card>
            
            {/* Security Audit */}
            <Card className="card-gradient rounded-xl border border-gray-800">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center mb-5">
                  <i className="fas fa-shield-alt text-green-500 text-2xl"></i>
                </div>
                <h3 className="font-['Montserrat'] font-semibold text-xl text-white mb-4">Security Audit</h3>
                <p className="text-gray-400 mb-4">
                  The $CHONK9K token has undergone rigorous security audits by leading blockchain security firms to ensure the safety of our community's investments.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-dark flex items-center justify-center">
                      <i className="fas fa-check-circle text-green-500"></i>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">CertiK Audit</h4>
                      <p className="text-gray-400 text-sm">Score: 95/100</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-dark flex items-center justify-center">
                      <i className="fas fa-check-circle text-green-500"></i>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Hacken Verification</h4>
                      <p className="text-gray-400 text-sm">No critical vulnerabilities</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-dark flex items-center justify-center">
                      <i className="fas fa-check-circle text-green-500"></i>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">PeckShield Review</h4>
                      <p className="text-gray-400 text-sm">Passed all security checks</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6 text-green-500 border-green-500/50 hover:bg-green-500/10">
                  Download Audit Reports
                </Button>
              </CardContent>
            </Card>
            
            {/* Technical Specifications */}
            <Card className="card-gradient rounded-xl border border-gray-800">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-5">
                  <i className="fas fa-cogs text-blue-500 text-2xl"></i>
                </div>
                <h3 className="font-['Montserrat'] font-semibold text-xl text-white mb-4">Technical Specifications</h3>
                <p className="text-gray-400 mb-4">
                  Detailed technical information about the $CHONK9K token implementation, architecture, and integration capabilities.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Token Standard:</span>
                    <span className="text-white">ERC-20 / SPL</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Bridge Protocol:</span>
                    <span className="text-white">Wormhole</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Transfer Fee:</span>
                    <span className="text-white">2%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Burn Rate:</span>
                    <span className="text-white">1% per transaction</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Decimal Places:</span>
                    <span className="text-white">18</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Renounced:</span>
                    <span className="text-white">Yes</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6 text-blue-500 border-blue-500/50 hover:bg-blue-500/10">
                  Technical Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Implementation Details */}
          <div className="mt-12 bg-black/30 rounded-xl border border-gray-800 p-6 md:p-8">
            <h3 className="font-['Montserrat'] font-semibold text-2xl text-white mb-6">Implementation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-['Montserrat'] font-medium text-xl text-primary mb-4">Cross-Chain Architecture</h4>
                <p className="text-gray-300 mb-4">
                  $CHONK9K utilizes a sophisticated cross-chain architecture that leverages both Base and Solana networks. The token's primary implementation is on Base, with Solana integration achieved through Wormhole Bridge technology.                  
                </p>
                <p className="text-gray-400">
                  This dual-chain approach combines the Ethereum-compatible features of Base with the high speed and low fees of Solana, creating a versatile token ecosystem that can operate efficiently across multiple blockchains.
                </p>
              </div>
              
              <div>
                <h4 className="font-['Montserrat'] font-medium text-xl text-primary mb-4">Token Economics Engine</h4>
                <p className="text-gray-300 mb-4">
                  Our tokenomics implementation includes several key components designed to create a sustainable token economy:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                  <li><span className="text-white font-medium">Automatic Liquidity Generation:</span> 1% of all transactions are converted to liquidity pools.</li>
                  <li><span className="text-white font-medium">Deflationary Mechanism:</span> 1% burn on every transfer reduces supply over time.</li>
                  <li><span className="text-white font-medium">Rewards Distribution:</span> Advanced staking contract with variable APY based on lock periods.</li>
                  <li><span className="text-white font-medium">Anti-Whale Protection:</span> Transaction limits prevent market manipulation.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-gradient-to-b from-black via-pink-950/30 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-['Montserrat'] font-bold text-3xl md:text-4xl text-white mb-4">Frequently Asked <span className="text-primary">Questions</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Everything you need to know about $CHONK9K and how to get involved in our community.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <Card className="card-gradient rounded-xl border border-gray-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <h3 className="font-['Montserrat'] font-semibold text-lg text-white">What is $CHONK9K?</h3>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-black/30">
                  <p className="text-gray-300">
                    $CHONK9K is a cross-chain meme token built on Base with Solana integration. It's inspired by the cyberpunk aesthetic and features a cat theme. The token combines humor with innovative technical features, creating a unique cryptocurrency experience for our community.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* FAQ Item 2 */}
            <Card className="card-gradient rounded-xl border border-gray-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <h3 className="font-['Montserrat'] font-semibold text-lg text-white">How do I buy $CHONK9K?</h3>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-black/30">
                  <p className="text-gray-300">
                    You can purchase $CHONK9K on various decentralized exchanges (DEXs) such as Uniswap on Base network or Raydium on Solana. Simply connect your wallet (MetaMask for Base, Phantom for Solana), swap ETH or SOL for $CHONK9K, and make sure to set an appropriate slippage percentage (usually 3-5%).
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* FAQ Item 3 */}
            <Card className="card-gradient rounded-xl border border-gray-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <h3 className="font-['Montserrat'] font-semibold text-lg text-white">What makes $CHONK9K unique?</h3>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-black/30">
                  <p className="text-gray-300">
                    $CHONK9K stands out due to its cross-chain implementation that leverages both Base and Solana networks, providing users with flexibility and efficiency. Additionally, our deflationary tokenomics, community-driven governance, and innovative features like the Chonkpump 9000 GameFi platform create a unique cryptocurrency ecosystem not found in other meme tokens.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* FAQ Item 4 */}
            <Card className="card-gradient rounded-xl border border-gray-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <h3 className="font-['Montserrat'] font-semibold text-lg text-white">Is the contract audited and secure?</h3>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-black/30">
                  <p className="text-gray-300">
                    Yes, the $CHONK9K smart contract has been audited by multiple reputable security firms including CertiK, Hacken, and PeckShield. The contract has passed all security checks with flying colors, and the liquidity is locked to ensure the long-term stability of the token. You can view the complete audit reports in our Technical Documentation section.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* FAQ Item 5 */}
            <Card className="card-gradient rounded-xl border border-gray-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <h3 className="font-['Montserrat'] font-semibold text-lg text-white">How can I participate in the community?</h3>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-black/30">
                  <p className="text-gray-300">
                    Join our thriving community on Telegram, Discord, and Twitter. You can participate in discussions, vote on governance proposals, enter our regular giveaways, and contribute to the project's development. Active community members are often rewarded with special perks and early access to new features and updates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">C9K</span>
              </div>
              <span className="font-['Montserrat'] font-bold text-xl text-white">$CHONK<span className="text-[#FFB800]">9K</span></span>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-xl transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xl transition">
                <i className="fab fa-telegram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xl transition">
                <i className="fab fa-discord"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xl transition">
                <i className="fab fa-medium"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xl transition">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-['Montserrat'] font-semibold mb-4">About</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Tokenomics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Team</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-['Montserrat'] font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Whitepaper</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Brand Assets</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Smart Contract</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Audit Report</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-['Montserrat'] font-semibold mb-4">Community</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Telegram</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Discord</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Medium</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-['Montserrat'] font-semibold mb-4">Exchanges</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Uniswap (Base)</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">SushiSwap</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Raydium (Solana)</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">CoinMarketCap</a></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              &copy; 2024 $CHONK9K. All rights reserved. The Chonkpump 9000 token for entertainment purposes only.
            </p>
            <p className="text-primary font-semibold text-sm mt-2">
              Founded by David Okeamah
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Cryptocurrencies are volatile and high-risk investments. Always do your own research.
            </p>
          </div>
        </div>
      </footer>

      {/* Add custom CSS for animation and gradients */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .hero-gradient {
          background: linear-gradient(135deg, #212529 0%, #1a1e21 100%);
        }
        
        .card-gradient {
          background: linear-gradient(145deg, #23272b 0%, #1d2124 100%);
        }
        
        .timeline-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 24px;
          bottom: 0;
          width: 2px;
          background: #FFB800;
          z-index: 0;
        }
        
        .timeline-item:last-child::before {
          display: none;
        }
        
        .timeline-dot {
          z-index: 1;
          position: relative;
        }
        `
      }} />
    </div>
  );
};

export default Home;
