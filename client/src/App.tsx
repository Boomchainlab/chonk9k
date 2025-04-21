import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import BadgeAdmin from "@/pages/BadgeAdmin";
import TriviaPage from "@/pages/TriviaPage";
import TriviaAdmin from "@/pages/TriviaAdmin";
import CryptoPayments from "@/pages/CryptoPayments";
import Marketplaces from "@/pages/Marketplaces";
import MarketplaceAdmin from "@/pages/MarketplaceAdmin";

// Header component with navigation
function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold hover:text-blue-100 transition-colors">
              Chonk9k
            </Link>
            <span className="ml-2 text-xs md:text-sm opacity-90">by David Okeamah</span>
          </div>
          
          <nav className="flex space-x-4">
            <Link href="/" className="hover:text-blue-100 transition-colors">
              Home
            </Link>
            <Link href="/crypto" className="hover:text-blue-100 transition-colors">
              Buy/Sell
            </Link>
            <Link href="/marketplaces" className="hover:text-blue-100 transition-colors">
              Exchanges
            </Link>
            <Link href="/trivia" className="hover:text-blue-100 transition-colors">
              Trivia
            </Link>
            <Link href="/profile/1" className="hover:text-blue-100 transition-colors">
              Profile
            </Link>
            <Link href="/admin/marketplace" className="hover:text-blue-100 transition-colors">
              Marketplace Admin
            </Link>
            <Link href="/admin/badges" className="hover:text-blue-100 transition-colors">
              Badge Admin
            </Link>
            <Link href="/admin/trivia" className="hover:text-blue-100 transition-colors">
              Trivia Admin
            </Link>
          </nav>
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
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
