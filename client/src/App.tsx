import { Switch, Route, Link } from "wouter";
import NFTStakingDemo from "@/pages/NFTStakingDemo";
import Fundraising from "@/pages/Fundraising";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import * as Sentry from '@sentry/react';
import { withErrorBoundary, initSentry } from "./lib/sentry";
import Footer from "@/components/Footer";
import NewChonkLogo from "@/components/NewChonkLogo";
import ChonkTokenLogo from "@/components/ChonkTokenLogo";
import LivePriceHeader from "@/components/LivePriceHeader";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import BadgeAdmin from "@/pages/BadgeAdmin";
import TriviaPage from "@/pages/TriviaPage";
import TriviaPopupManager from "@/components/TriviaPopupManager";
import TriviaAdmin from "@/pages/TriviaAdmin";
import CryptoPayments from "@/pages/CryptoPayments";
import Marketplaces from "@/pages/Marketplaces";
import MarketplaceAdmin from "@/pages/MarketplaceAdmin";
import NftCollectionDetail from "@/pages/NftCollectionDetail";
import Mining from "@/pages/Mining";
import TokenDetails from "@/pages/TokenDetails";
import { WalletProvider } from "@/hooks/useChonkWallet";
import MultiWalletConnect from "@/components/MultiWalletConnect";
import GamifiedWalletConnect from "@/components/GamifiedWalletConnect";
import SimpleGamifiedWalletConnect from "@/components/SimpleGamifiedWalletConnect";
import ImprovedGamifiedWalletConnect from "@/components/ImprovedGamifiedWalletConnect";
import TokenPage from "@/pages/TokenPage";
import TokenBranding from "@/pages/TokenBranding";
import TokenMood from "@/pages/TokenMood";
import EmbedWidget from "@/pages/EmbedWidget";
import EmbedLayout from "@/pages/EmbedLayout";
import WordPressIntegration from "@/pages/WordPressIntegration";
import SpinWheel from "@/pages/SpinWheel";
import WalletFeatures from "@/pages/WalletFeatures";
import AnimatedChonkCharacter from "@/components/AnimatedChonkCharacter";
import { useLocation } from "wouter";
import { useState, useEffect } from 'react';
import QuizPage from "@/pages/QuizPage";
import SolanaMonitor from "@/pages/SolanaMonitor";
import TokenTransactions from "@/pages/TokenTransactions";
import TokenPriceTracker from "@/pages/TokenPriceTracker";
import LiquidityPools from "@/pages/LiquidityPools";
import TokenHolders from "@/pages/TokenHolders";
import BaseTransactions from "@/pages/BaseTransactions";
import TokenMoodVisualizerPage from "@/pages/TokenMoodVisualizer";
import BlockchainStreams from "@/pages/BlockchainStreams";
import SolanaStatusPage from "@/pages/SolanaStatus";
import TokenContracts from "@/pages/TokenContracts";
import Payments from "@/pages/Payments";
import SolanaNameService from "@/pages/SolanaNameService";
import TokenGovernance from "@/pages/TokenGovernance";
import TokenListings from "@/pages/TokenListings";
import NetworkPassports from "@/pages/NetworkPassports";
import ChonkPad from "@/pages/ChonkPad";
import ChonkPadLaunchDetail from "@/pages/ChonkPadLaunchDetail";
import UnstoppableDomainsPage from "@/pages/UnstoppableDomainsPage";
import UnstoppableDomainsAdmin from "@/pages/UnstoppableDomainsAdmin";

// Header component with navigation
function Header() {
  const [location] = useLocation();
  const isDashboard = location === '/';
  const isTokenPage = location.includes('/token');
  const isMarketplace = location.includes('market') || location.includes('exchange');
  const isFeatures = location.includes('trivia') || location.includes('spin') || location.includes('mining');
  
  // Function to test Sentry error tracking
  const handleErrorTest = () => {
    try {
      // This will cause an error for testing purposes
      console.log("Testing error tracking");
      throw new Error("Manual error test from header");
    } catch (error) {
      // We'll capture this error with Sentry
      import('./lib/sentry').then(({ captureException, captureMessage }) => {
        captureMessage("User manually triggered an error test", "info");
        captureException(error, {
          component: 'Header',
          action: 'handleErrorTest',
          user_triggered: true
        });
      });
    }
  };
  
  // Get the appropriate header style based on the current page
  const getHeaderStyle = () => {
    if (isDashboard) {
      return "bg-black/80 backdrop-blur-md border-b border-[#ff00ff]/30 text-white";
    } else if (isTokenPage) {
      return "bg-gradient-to-br from-purple-900 to-indigo-900 border-b border-indigo-500/30 text-white shadow-lg";
    } else if (isMarketplace) {
      return "bg-gradient-to-r from-amber-900 to-orange-900 border-b border-amber-500/30 text-white shadow-md";
    } else if (isFeatures) {
      return "bg-gradient-to-r from-emerald-900 to-teal-900 border-b border-emerald-500/30 text-white shadow-md";
    } else {
      return "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md";
    }
  };

  return (
    <header className={getHeaderStyle()}>
      <div className="container mx-auto px-4 py-3">
        {/* Top section with logo and price */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          <div className="flex w-full md:w-auto justify-between items-center">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <ChonkTokenLogo size={40} useAnimation={false} />
              <span className="text-xl font-bold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">CHONK 9000</span>
            </Link>
            
            <div className="flex items-center gap-3 md:hidden">
              <LivePriceHeader />
              <AnimatedChonkCharacter />
            </div>
          </div>
          
          {/* Primary navigation */}
          <nav className="flex flex-wrap justify-center gap-1 md:gap-2 items-center w-full md:w-auto">
            {/* Main Links - Always visible */}
            <div className="flex flex-wrap justify-center gap-3 p-2 bg-black/30 rounded-lg">
              <Link href="/" className={`transition-colors font-medium px-2 py-1 ${isDashboard ? 'text-[#ff00ff] hover:text-[#ff00ff]/80' : 'hover:text-pink-200'}`}>
                Home
              </Link>
              <div className="relative group">
                <Link href="/token" className={`transition-colors font-medium px-2 py-1 flex items-center ${isDashboard ? 'text-[#ff00ff] hover:text-[#ff00ff]/80' : 'hover:text-pink-200'}`}>
                  Token <span className="ml-1">▾</span>
                </Link>
                <div className="absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-black/80 backdrop-blur-md border border-pink-500/30 text-white z-50 invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100 transform origin-top-left scale-95 group-hover:scale-100">
                  <div className="py-1">
                    <Link href="/token" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                      Overview
                    </Link>
                    <Link href="/token/details" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm flex items-center">
                      <span className="w-2 h-2 bg-[#00e0ff] rounded-full mr-2"></span>
                      Token Details
                    </Link>
                    <Link href="/token/branding" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                      Branding
                    </Link>
                    <Link href="/token/mood" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                      Mood Tracker
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/crypto" className={`transition-colors font-medium px-2 py-1 ${isDashboard ? 'text-[#00e0ff] hover:text-[#00e0ff]/80' : 'hover:text-pink-200'}`}>
                Buy/Sell
              </Link>
              <Link href="/payments" className={`transition-colors font-medium px-2 py-1 flex items-center ${isDashboard ? 'text-[#00e0ff] hover:text-[#00e0ff]/80' : 'hover:text-pink-200'}`}>
                Payments
                <span className="ml-1 px-1.5 py-0.5 text-[9px] bg-blue-500 rounded text-white">NEW</span>
              </Link>
              <Link href="/marketplaces" className={`transition-colors font-medium px-2 py-1 ${isDashboard ? 'text-[#ff00ff] hover:text-[#ff00ff]/80' : 'hover:text-pink-200'}`}>
                Exchanges
              </Link>
              <Link href="/profile/1" className={`transition-colors font-medium px-2 py-1 ${isDashboard ? 'text-[#00e0ff] hover:text-[#00e0ff]/80' : 'hover:text-pink-200'}`}>
                Profile
              </Link>
            </div>
            
            {/* Featured Items */}
            <div className="flex flex-wrap justify-center gap-2 p-2 bg-gradient-to-r from-pink-900/30 to-indigo-900/30 rounded-lg">
              <Link href="/network-passports" className={`transition-colors ${isDashboard ? 'text-[#00e0ff] hover:text-[#00e0ff]/80' : 'hover:text-pink-200'}`}>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-900/60 rounded">
                  <span className="px-1.5 py-0.5 text-[9px] bg-indigo-500 rounded text-white">NEW</span>
                  Blockchain Passports
                </span>
              </Link>
              
              <Link href="/token-listings" className={`transition-colors ${isDashboard ? 'text-[#ff00ff] hover:text-[#ff00ff]/80' : 'hover:text-pink-200'}`}>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-900/60 rounded">
                  <span className="px-1.5 py-0.5 text-[9px] bg-amber-500 rounded text-white">New</span>
                  Token Listings
                </span>
              </Link>
              
              <Link href="/token-governance" className={`transition-colors ${isDashboard ? 'text-[#00e0ff] hover:text-[#00e0ff]/80' : 'hover:text-pink-200'}`}>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/60 rounded">
                  <span className="px-1.5 py-0.5 text-[9px] bg-green-600 rounded text-white">DAO</span>
                  Governance
                </span>
              </Link>
              
              <Link href="/fundraising" className={`transition-colors ${isDashboard ? 'text-[#00e0ff] hover:text-[#00e0ff]/80' : 'hover:text-pink-200'}`}>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/60 rounded border border-green-500 animate-pulse">
                  <span className="px-1.5 py-0.5 text-[9px] bg-green-500 rounded text-white">FUND</span>
                  Youth Web3 Initiative
                </span>
              </Link>
            </div>
          </nav>
          
          {/* Secondary navigation in desktop */}
          <div className="hidden md:flex items-center gap-3">
            <LivePriceHeader />
            <AnimatedChonkCharacter />
            <div className="relative group">
              <button className="px-3 py-1.5 bg-purple-600/50 text-white rounded-md hover:bg-purple-600/70 transition-colors">
                More ▾
              </button>
              <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-black/80 backdrop-blur-md border border-pink-500/30 text-white z-50 invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100 transform origin-top scale-95 group-hover:scale-100">
                <div className="px-2 py-2">
                  <div className="font-semibold px-3 py-1 text-xs uppercase text-pink-300 mb-1">Features</div>
                  <Link href="/mining" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Mining
                  </Link>
                  <Link href="/trivia" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Trivia
                  </Link>
                  <Link href="/spin" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Spin Wheel
                  </Link>
                  <Link href="/payments" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm flex items-center bg-blue-900/20 border border-blue-500/30 my-1">
                    <span className="flex-1">Fiat24 Payments</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-blue-500 rounded text-white">NEW</span>
                  </Link>
                  <Link href="/chonkpad" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm flex items-center bg-amber-900/20 border border-amber-500/30 my-1">
                    <span className="flex-1">ChonkPad Launchpad</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-amber-500 rounded text-white">HOT</span>
                  </Link>
                  <Link href="/nft-staking" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm flex items-center bg-purple-900/20 border border-purple-500/30 my-1">
                    <span className="flex-1">NFT Staking Demo</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-purple-500 rounded text-white">NEW</span>
                  </Link>
                  <Link href="/fundraising" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm flex items-center bg-green-900/20 border border-green-500/30 my-1">
                    <span className="flex-1">Youth Web3 Initiative</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-green-500 rounded text-white">FUND</span>
                  </Link>
                  
                  <div className="font-semibold px-3 py-1 mt-2 text-xs uppercase text-pink-300 mb-1">Blockchain</div>
                  <Link href="/token-contracts" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    <span className="inline-flex items-center gap-1">
                      Contracts <span className="px-1 py-0.5 text-[9px] bg-pink-700/50 rounded">Multi-Chain</span>
                    </span>
                  </Link>
                  <Link href="/solana-name-service" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    <span className="inline-flex items-center gap-1">
                      <span className="px-1.5 py-0.5 text-[9px] bg-purple-600 rounded text-white">SNS</span> Domains
                    </span>
                  </Link>
                  <Link href="/unstoppable-domains" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    <span className="inline-flex items-center gap-1">
                      <span className="px-1.5 py-0.5 text-[9px] bg-indigo-600 rounded text-white">NFT</span> Unstoppable Domains
                    </span>
                  </Link>
                  <Link href="/solana-monitor" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    <span className="inline-flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Monitor
                    </span>
                  </Link>
                  <Link href="/solana-status" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    <span className="inline-flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> Solana Status
                    </span>
                  </Link>
                  
                  <div className="font-semibold px-3 py-1 mt-2 text-xs uppercase text-pink-300 mb-1">Admin</div>
                  <Link href="/admin/marketplace" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Marketplace Admin
                  </Link>
                  <Link href="/admin/badges" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Badge Admin
                  </Link>
                  <Link href="/admin/trivia" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Trivia Admin
                  </Link>
                  <Link href="/admin/unstoppable-domains" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Unstoppable Domains Admin
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile secondary navigation */}
        <div className="md:hidden flex flex-wrap justify-center gap-2 mt-3">
          <div className="relative inline-block text-left w-full max-w-xs mx-auto">
            <button 
              onClick={() => {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                  mobileMenu.classList.toggle('hidden');
                }
              }}
              className="w-full px-3 py-1.5 bg-purple-600/50 text-white rounded-md hover:bg-purple-600/70 transition-colors"
            >
              More Features ▾
            </button>
            <div id="mobile-menu" className="hidden mt-2 w-full rounded-md shadow-lg bg-black/80 backdrop-blur-md border border-pink-500/30 text-white z-50">
              <div className="px-2 py-2">
                <div className="mb-2 px-3 py-1 text-xs uppercase text-pink-300 border-b border-pink-500/30">
                  Token Pages
                </div>
                <div className="grid grid-cols-2 gap-1 mb-3 px-2">
                  <Link href="/token/details" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm bg-gradient-to-r from-[#ff00ff]/20 to-transparent border border-[#ff00ff]/30">
                    Token Details
                  </Link>
                  <Link href="/token/branding" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Token Branding
                  </Link>
                  <Link href="/token/mood" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Mood Tracker
                  </Link>
                  <Link href="/token-contracts" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Contracts
                  </Link>
                </div>
                
                <div className="mb-2 px-3 py-1 text-xs uppercase text-pink-300 border-b border-pink-500/30">
                  Features
                </div>
                <div className="grid grid-cols-2 gap-1 mb-2 px-2">
                  <Link href="/mining" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Mining
                  </Link>
                  <Link href="/trivia" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Trivia
                  </Link>
                  <Link href="/spin" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Spin Wheel
                  </Link>
                  <Link href="/payments" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm bg-blue-900/20 border border-blue-500/30 flex items-center">
                    <span className="flex-1">Payments</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-blue-500 rounded text-white">NEW</span>
                  </Link>
                  <Link href="/chonkpad" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm bg-amber-900/20 border border-amber-500/30 flex items-center">
                    <span className="flex-1">ChonkPad</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-amber-500 rounded text-white">HOT</span>
                  </Link>
                  <Link href="/nft-staking" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm bg-purple-900/20 border border-purple-500/30 flex items-center">
                    <span className="flex-1">NFT Staking</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-purple-500 rounded text-white">NEW</span>
                  </Link>
                  <Link href="/fundraising" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm bg-green-900/20 border border-green-500/30 flex items-center">
                    <span className="flex-1">Youth Initiative</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-green-500 rounded text-white">FUND</span>
                  </Link>
                  <Link href="/solana-name-service" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    SNS Domains
                  </Link>
                  <Link href="/unstoppable-domains" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm bg-indigo-900/20 border border-indigo-500/30 flex items-center">
                    <span className="flex-1">Unstoppable Domains</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-indigo-500 rounded text-white">NFT</span>
                  </Link>
                  <Link href="/solana-monitor" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Monitor
                  </Link>
                  <Link href="/solana-status" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Status
                  </Link>
                  <Link href="/admin/marketplace" className="block px-3 py-1.5 hover:bg-white/10 rounded text-sm">
                    Admin
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Router() {
  const [location] = useLocation();
  const isDashboard = location === '/';
  
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/home" component={Home} />
          <Route path="/crypto" component={CryptoPayments} />
          <Route path="/token" component={TokenPage} />
          <Route path="/token/details" component={TokenDetails} />
          <Route path="/token/branding" component={TokenBranding} />
          <Route path="/token/mood" component={TokenMood} />
          <Route path="/token/mood-visualizer" component={TokenMoodVisualizerPage} />
          <Route path="/token/wordpress" component={WordPressIntegration} />
          <Route path="/embed/mood" component={EmbedWidget} />
          <Route path="/marketplaces" component={Marketplaces} />
          <Route path="/nft/:id" component={NftCollectionDetail} />
          <Route path="/mining" component={Mining} />
          <Route path="/nft-staking" component={NFTStakingDemo} />
          <Route path="/trivia" component={TriviaPage} />
          <Route path="/trivia/:id" component={QuizPage} />
          <Route path="/spin" component={SpinWheel} />
          <Route path="/profile/:userId" component={Profile} />
          <Route path="/wallet-features" component={WalletFeatures} />
          <Route path="/admin/marketplace" component={MarketplaceAdmin} />
          <Route path="/admin/badges" component={BadgeAdmin} />
          <Route path="/admin/trivia" component={TriviaAdmin} />
          <Route path="/admin/unstoppable-domains" component={UnstoppableDomainsAdmin} />
          <Route path="/unstoppable-domains" component={UnstoppableDomainsPage} />
          {/* Blockchain Monitor Pages */}
          <Route path="/solana-monitor" component={SolanaMonitor} />
          <Route path="/token-transactions" component={TokenTransactions} />
          <Route path="/token-price-tracker" component={TokenPriceTracker} />
          <Route path="/liquidity-pools" component={LiquidityPools} />
          <Route path="/token-holders" component={TokenHolders} />
          <Route path="/base-transactions" component={BaseTransactions} />
          <Route path="/blockchain-streams" component={BlockchainStreams} />
          <Route path="/solana-status" component={SolanaStatusPage} />
          <Route path="/token-contracts" component={TokenContracts} />
          <Route path="/solana-name-service" component={SolanaNameService} />
          <Route path="/token-governance" component={TokenGovernance} />
          <Route path="/token-listings" component={TokenListings} />
          <Route path="/network-passports" component={NetworkPassports} />
          <Route path="/payments" component={Payments} />
          <Route path="/chonkpad" component={ChonkPad} />
          <Route path="/chonkpad/:id" component={ChonkPadLaunchDetail} />
          <Route path="/fundraising" component={Fundraising} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}

// Error fallback component
function ErrorFallback({ error, componentStack, resetError, eventId }: { error: unknown; componentStack: string; resetError: () => void; eventId?: string }) {
  return (
    <div className="p-6 m-4 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
      <p className="text-gray-800 mb-4">The application encountered an unexpected error. Our team has been notified and is working on a fix.</p>
      <div className="p-3 bg-white rounded border border-red-100 mb-4 overflow-auto max-h-40">
        <p className="text-red-500 font-bold mb-1">{error instanceof Error ? error.message : String(error)}</p>
        <p className="text-xs font-mono text-gray-600">{componentStack}</p>
        {eventId && <p className="text-xs mt-2">Event ID: {eventId}</p>}
      </div>
      <button
        onClick={resetError}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

function App() {
  // Initialize Sentry
  useEffect(() => {
    initSentry();
  }, []);

  // We'll use this function to test error tracking
  const testErrorTracking = () => {
    try {
      // This will cause an error for testing purposes
      console.log("Testing error tracking");
      throw new Error("Test error for Sentry");
    } catch (error) {
      // We'll capture this error with Sentry
      import('./lib/sentry').then(({ captureException }) => {
        captureException(error, {
          component: 'App',
          action: 'testErrorTracking'
        });
      });
    }
  };

  const [location] = useLocation();
  const isEmbedRoute = location.startsWith('/embed');

  // If it's an embed route, use the simplified EmbedLayout
  if (isEmbedRoute) {
    return <EmbedLayout />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <TriviaPopupManager popupInterval={300000} minActiveTime={30} />

        {/* Wrap Router with error boundary */}
        <Sentry.ErrorBoundary
          fallback={ErrorFallback}
          onError={(error, componentStack, eventId) => {
            console.error("Sentry caught an error:", error, componentStack);
            console.log("Event ID:", eventId);
          }}
        >
          <Router />
        </Sentry.ErrorBoundary>
        <div className="fixed bottom-4 right-4 z-50 md:hidden">
          <div className="flex items-center space-x-2">
            <ImprovedGamifiedWalletConnect variant="outline" size="sm" />
            <AnimatedChonkCharacter />
          </div>
        </div>
        <div className="fixed top-4 right-4 z-50 hidden md:flex">
          <ImprovedGamifiedWalletConnect variant="outline" />
        </div>
        <Toaster />
      </WalletProvider>
    </QueryClientProvider>
  );
}

// Export with Sentry.ErrorBoundary at the top level as well for global error catching
export default function AppWithErrorBoundary() {
  return (
    <Sentry.ErrorBoundary
      fallback={ErrorFallback}
      onError={(error, componentStack, eventId) => {
        console.error("Global error caught by Sentry:", error);
        console.log("Event ID:", eventId);
      }}
    >
      <App />
    </Sentry.ErrorBoundary>
  );
}
