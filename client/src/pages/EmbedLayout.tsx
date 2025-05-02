import React from 'react';
import { Switch, Route } from 'wouter';
import EmbedWidget from './EmbedWidget';
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider } from "@/hooks/useChonkWallet";
import { Toaster } from "@/components/ui/toaster";

const EmbedLayout: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <div className="min-h-screen bg-background">
          <Switch>
            <Route path="/embed/mood" component={EmbedWidget} />
          </Switch>
        </div>
        <Toaster />
      </WalletProvider>
    </QueryClientProvider>
  );
};

export default EmbedLayout;
