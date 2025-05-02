import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import BadgeAdmin from "@/pages/BadgeAdmin";

// Header component with navigation
function Header() {
  return (
    <header className="bg-orange-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-orange-100 transition-colors">
            Chonk9k
          </Link>
          
          <nav className="flex space-x-6">
            <Link href="/" className="hover:text-orange-100 transition-colors">
              Home
            </Link>
            <Link href="/profile/1" className="hover:text-orange-100 transition-colors">
              Profile
            </Link>
            <Link href="/badges/admin" className="hover:text-orange-100 transition-colors">
              Badge Admin
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
          <Route path="/profile/:userId" component={Profile} />
          <Route path="/badges/admin" component={BadgeAdmin} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  // Deliberate error to test Sentry integration
  throw new Error("Deliberate error for Sentry testing");

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
