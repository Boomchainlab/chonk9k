import React from 'react';
import { Link } from 'wouter';
import SolanaConnectionStatus from '@/components/SolanaConnectionStatus';
import { CHONK9K_TOKEN_ADDRESS } from '@/lib/solanaConnection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const SolanaStatusPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              CHONK9K Solana Integration
            </h1>
          </div>
          <p className="text-muted-foreground">
            Enhanced Solana connectivity through dedicated QuickNode infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <SolanaConnectionStatus />
          
          <Card>
            <CardHeader>
              <CardTitle>CHONK9K Token</CardTitle>
              <CardDescription>Solana SPL Token Details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Token Address</p>
                <div className="flex items-center">
                  <code className="text-xs bg-muted p-2 rounded flex-1 overflow-x-auto">
                    {CHONK9K_TOKEN_ADDRESS}
                  </code>
                  <a 
                    href={`https://solscan.io/token/${CHONK9K_TOKEN_ADDRESS}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-primary hover:text-primary/80"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Supply</p>
                <p>1,000,000,000 CHONK9K</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Decimals</p>
                <p>9</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <a 
                  href="https://phantom.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <img 
                    src="https://phantom.app/favicon.ico" 
                    alt="Phantom" 
                    className="h-4 w-4 mr-2" 
                  />
                  Add to Phantom Wallet
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>QuickNode Enhanced Connectivity</CardTitle>
            <CardDescription>
              CHONK9K uses enterprise-grade RPC endpoints for superior performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                CHONK9K leverages dedicated QuickNode infrastructure to ensure reliable and high-performance
                connectivity to the Solana blockchain. This provides several advantages over public RPC endpoints:
              </p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li>Higher rate limits for API requests</li>
                <li>Lower latency and faster transaction processing</li>
                <li>Enhanced stability during network congestion</li>
                <li>Dedicated infrastructure with automatic failover</li>
                <li>Robust websocket connections for real-time updates</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SolanaStatusPage;
