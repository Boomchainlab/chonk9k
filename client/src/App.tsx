import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import NewChonkLogo from "@/components/NewChonkLogo";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import BadgeAdmin from "@/pages/BadgeAdmin";
import TriviaPage from "@/pages/TriviaPage";
import TriviaAdmin from "@/pages/TriviaAdmin";
import CryptoPayments from "@/pages/CryptoPayments";
import Marketplaces from "@/pages/Marketplaces";
import MarketplaceAdmin from "@/pages/MarketplaceAdmin";
import NftCollectionDetail from "@/pages/NftCollectionDetail";
import Mining from "@/pages/Mining";
import { WalletProvider } from "@/hooks/useChonkWallet";
import MultiWalletConnect from "@/components/MultiWalletConnect";
import TokenPage from "@/pages/TokenPage";
import AnimatedChonkCharacter from "@/components/AnimatedChonkCharacter";
import { useLocation } from "wouter";
import { useState, useEffect } from 'react';

// Header component with navigation
function Header() {
  const [location] = useLocation();
  const isDashboard = location === '/';
  
  return (
    <header className={isDashboard ? 
      "bg-black/80 backdrop-blur-md border-b border-[#ff00ff]/30 text-white" : 
      "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
    }>
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <NewChonkLogo size="small" />
              <span className="text-xl font-bold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">Chonk9k</span>
            </Link>
            <span className="ml-2 text-xs md:text-sm opacity-80">by David Okeamah</span>
          </div>
          
          <nav className="flex flex-wrap gap-4 items-center">
            <Link href="/" className={`transition-colors ${isDashboard ? 'text-[#ff00ff] hover:text-[#ff00ff]/80' : 'hover:text-pink-200'}`}>
              Home
            </Link>
            <Link href="/crypto" className={`transition-colors ${isDashboard ? 'text-[#00e0ff] hover:text-[#00e0ff]/80' : 'hover:text-pink-200'}`}>
              Buy/Sell
            </Link>
            <Link href="/token" className={`transition-colors ${isDashboard ? 'text-[#ff00ff] hover:text-[#ff00ff]/80' : 'hover:text-pink-200'}`}>
              Token
            </Link>
            <Link href="/marketplaces" className={`transition-colors ${isDashboard ? 'text-[#ff00ff] hover:text-[#ff00ff]/80' : 'hover:text-pink-200'}`}>
              Exchanges
            </Link>
            <Link href="/mining" className={`transition-colors ${isDashboard ? 'text-[#00e0ff] hover:text-[#00e0ff]/80' : 'hover:text-pink-200'}`}>
              Mining
            </Link>
            <Link href="/trivia" className={`transition-colors ${isDashboard ? 'text-[#ff00ff] hover:text-[#ff00ff]/80' : 'hover:text-pink-200'}`}>
              Trivia
            </Link>
            <Link href="/profile/1" className={`transition-colors ${isDashboard ? 'text-[#00e0ff] hover:text-[#00e0ff]/80' : 'hover:text-pink-200'}`}>
              Profile
            </Link>
            <a href="https://github.com/BoomchainLabs/chonk9k-dapp" target="_blank" rel="noopener noreferrer" className={`flex items-center transition-colors ${isDashboard ? 'text-[#ff00ff] hover:text-[#ff00ff]/80' : 'hover:text-pink-200'}`}>
              <i className="fas fa-code-branch mr-1"></i> GitHub
            </a>
            <Link href="/admin/marketplace" className={isDashboard ? 
              "text-xs px-2 py-1 bg-[#ff00ff]/20 border border-[#ff00ff]/50 text-[#ff00ff] rounded" : 
              "hover:text-pink-200 transition-colors text-xs px-2 py-1 bg-pink-700 rounded"
            }>
              Marketplace Admin
            </Link>
            <Link href="/admin/badges" className={isDashboard ? 
              "text-xs px-2 py-1 bg-[#00e0ff]/20 border border-[#00e0ff]/50 text-[#00e0ff] rounded" : 
              "hover:text-pink-200 transition-colors text-xs px-2 py-1 bg-pink-700 rounded"
            }>
              Badge Admin
            </Link>
            <Link href="/admin/trivia" className={isDashboard ? 
              "text-xs px-2 py-1 bg-[#ff00ff]/20 border border-[#ff00ff]/50 text-[#ff00ff] rounded" : 
              "hover:text-pink-200 transition-colors text-xs px-2 py-1 bg-pink-700 rounded"
            }>
              Trivia Admin
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center">
            <AnimatedChonkCharacter />
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
          <Route path="/marketplaces" component={Marketplaces} />
          <Route path="/nft/:id" component={NftCollectionDetail} />
          <Route path="/mining" component={Mining} />
          <Route path="/trivia" component={TriviaPage} />
          <Route path="/profile/:userId" component={Profile} />
          <Route path="/admin/marketplace" component={MarketplaceAdmin} />
          <Route path="/admin/badges" component={BadgeAdmin} />
          <Route path="/admin/trivia" component={TriviaAdmin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Router />
        <div className="fixed bottom-4 right-4 z-50 md:hidden">
          <AnimatedChonkCharacter />
        </div>
        <div className="fixed top-4 right-4 z-50 hidden md:flex">
          <MultiWalletConnect variant="outline" />
        </div>
        <Toaster />
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
