import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import * as Sentry from '@sentry/react';
import { withErrorBoundary, initSentry } from "./lib/sentry";
import Footer from "@/components/Footer";
import NewChonkLogo from "@/components/NewChonkLogo";
import LivePriceHeader from "@/components/LivePriceHeader";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import BadgeAdmin from "@/pages/BadgeAdmin";
import TriviaPage from "@/pages/TriviaPage";
// QuizPage is temporarily commented out due to TypeScript errors
// import QuizPage from "@/pages/QuizPage";
import TriviaAdmin from "@/pages/TriviaAdmin";
import CryptoPayments from "@/pages/CryptoPayments";
import Marketplaces from "@/pages/Marketplaces";
import MarketplaceAdmin from "@/pages/MarketplaceAdmin";
import NftCollectionDetail from "@/pages/NftCollectionDetail";
import Mining from "@/pages/Mining";
import { WalletProvider } from "@/hooks/useChonkWallet";
import MultiWalletConnect from "@/components/MultiWalletConnect";
import GamifiedWalletConnect from "@/components/GamifiedWalletConnect";
import SimpleGamifiedWalletConnect from "@/components/SimpleGamifiedWalletConnect";
import ImprovedGamifiedWalletConnect from "@/components/ImprovedGamifiedWalletConnect";
import TokenPage from "@/pages/TokenPage";
import TokenBranding from "@/pages/TokenBranding";
import SpinWheel from "@/pages/SpinWheel";
import WalletFeatures from "@/pages/WalletFeatures";
import AnimatedChonkCharacter from "@/components/AnimatedChonkCharacter";
import { useLocation } from "wouter";
import { useState, useEffect } from 'react';
import QuizPage from "@/pages/QuizPage";

// Header component with navigation
function Header() {
  const [location] = useLocation();
  const isDashboard = location === '/';
  
  // Function to test Sentry error tracking
  const handleErrorTest = () => {
    try {
      // This will cause an error
      console.log("Testing error tracking");
      window.myUndefinedFunction(); // This function doesn't exist
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
              <span className="text-xl font-bold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">CHONK 9000</span>
            </Link>
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
            <Link href="/spin" className={`transition-colors ${isDashboard ? 'text-[#00e0ff] hover:text-[#00e0ff]/80' : 'hover:text-pink-200'}`}>
              Spin Wheel
            </Link>
            <Link href="/profile/1" className={`transition-colors ${isDashboard ? 'text-[#00e0ff] hover:text-[#00e0ff]/80' : 'hover:text-pink-200'}`}>
              Profile
            </Link>

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
          
          <div className="hidden md:flex items-center gap-4">
            <LivePriceHeader />
            <AnimatedChonkCharacter />
            <button 
              onClick={handleErrorTest}
              className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              title="Test Sentry Error Tracking"
            >
              Test Error Tracking
            </button>
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
          <Route path="/token/branding" component={TokenBranding} />
          <Route path="/marketplaces" component={Marketplaces} />
          <Route path="/nft/:id" component={NftCollectionDetail} />
          <Route path="/mining" component={Mining} />
          <Route path="/trivia" component={TriviaPage} />
          <Route path="/trivia/:id" component={QuizPage} />
          <Route path="/spin" component={SpinWheel} />
          <Route path="/profile/:userId" component={Profile} />
          <Route path="/wallet-features" component={WalletFeatures} />
          <Route path="/admin/marketplace" component={MarketplaceAdmin} />
          <Route path="/admin/badges" component={BadgeAdmin} />
          <Route path="/admin/trivia" component={TriviaAdmin} />
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
      // This will cause an error
      const undefinedFunc = window.myUndefinedFunction;
      undefinedFunc();
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

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
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
