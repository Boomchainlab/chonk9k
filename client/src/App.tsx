import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import ChonkLogo from "@/components/ChonkLogo";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import BadgeAdmin from "@/pages/BadgeAdmin";
import TriviaPage from "@/pages/TriviaPage";
import TriviaAdmin from "@/pages/TriviaAdmin";
import CryptoPayments from "@/pages/CryptoPayments";
import Marketplaces from "@/pages/Marketplaces";
import MarketplaceAdmin from "@/pages/MarketplaceAdmin";
import Mining from "@/pages/Mining";
import { ChonkWalletProvider } from "@/hooks/useChonkWallet";
import ChonkWalletManager from "@/components/ChonkWalletManager";
import AnimatedChonkCharacter from "@/components/AnimatedChonkCharacter";
import { useLocation } from "wouter";

// Header component with navigation
function Header() {
  const [location] = useLocation();
  return (
    <header className="bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <ChonkLogo size="small" variant="pink" />
              <span className="text-xl font-bold ml-2">Chonk9k</span>
            </Link>
            <span className="ml-2 text-xs md:text-sm opacity-80">by David Okeamah</span>
          </div>
          
          <nav className="flex flex-wrap gap-4 items-center">
            <Link href="/" className="hover:text-pink-200 transition-colors">
              Home
            </Link>
            <Link href="/crypto" className="hover:text-pink-200 transition-colors">
              Buy/Sell
            </Link>
            <Link href="/marketplaces" className="hover:text-pink-200 transition-colors">
              Exchanges
            </Link>
            <Link href="/mining" className="hover:text-pink-200 transition-colors">
              Mining
            </Link>
            <Link href="/trivia" className="hover:text-pink-200 transition-colors">
              Trivia
            </Link>
            <Link href="/profile/1" className="hover:text-pink-200 transition-colors">
              Profile
            </Link>
            <Link href="/admin/marketplace" className="hover:text-pink-200 transition-colors text-xs px-2 py-1 bg-pink-700 rounded">
              Marketplace Admin
            </Link>
            <Link href="/admin/badges" className="hover:text-pink-200 transition-colors text-xs px-2 py-1 bg-pink-700 rounded">
              Badge Admin
            </Link>
            <Link href="/admin/trivia" className="hover:text-pink-200 transition-colors text-xs px-2 py-1 bg-pink-700 rounded">
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
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/crypto" component={CryptoPayments} />
          <Route path="/marketplaces" component={Marketplaces} />
          <Route path="/mining" component={Mining} />
          <Route path="/trivia" component={TriviaPage} />
          <Route path="/profile/:userId" component={Profile} />
          <Route path="/admin/marketplace" component={MarketplaceAdmin} />
          <Route path="/admin/badges" component={BadgeAdmin} />
          <Route path="/admin/trivia" component={TriviaAdmin} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChonkWalletProvider>
        <Router />
        <div className="fixed bottom-4 right-4 z-50 md:hidden">
          <AnimatedChonkCharacter />
        </div>
        <div className="fixed left-4 top-20 z-50 hidden md:block lg:left-8 lg:top-32">
          <ChonkWalletManager />
        </div>
        <Toaster />
      </ChonkWalletProvider>
    </QueryClientProvider>
  );
}

export default App;
