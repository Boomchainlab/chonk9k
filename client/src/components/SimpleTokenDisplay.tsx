import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CONTRACT_ADDRESSES, TOKEN_METADATA } from "@shared/constants";
import ChonkTokenLogo from "@/components/ChonkTokenLogo";

const CHONK9K_TOKEN_ADDRESS = CONTRACT_ADDRESSES.SOLANA.CHONK9K;
const tokenMetadata = TOKEN_METADATA.CHONK9K;

const SimpleTokenDisplay: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Address copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <ChonkTokenLogo size={120} className="mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">
          $CHONK9K Token
        </h1>
        <div className="flex justify-center items-center gap-2 mb-3">
          <Badge className="bg-[#00e0ff]/20 text-[#00e0ff] border border-[#00e0ff]/30">
            JUST DEPLOYED
          </Badge>
          <Badge className="bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff]/30">
            {new Date().toLocaleDateString()}
          </Badge>
        </div>
        <p className="text-xl text-gray-200 max-w-2xl mx-auto">
          The official Solana token for the Chonkpump 9000 ecosystem
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-black/90 backdrop-blur-xl border border-[#ff00ff]/30 text-white shadow-lg shadow-[#ff00ff]/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">Token Details</span>
              <Badge className="ml-auto bg-gradient-to-r from-violet-500 to-fuchsia-500">
                SPL Token
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Token Contract: {CHONK9K_TOKEN_ADDRESS.slice(0, 6)}...{CHONK9K_TOKEN_ADDRESS.slice(-4)}
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-6 w-6 rounded-full p-0 text-[#ff00ff]/70 hover:text-[#ff00ff] hover:bg-[#ff00ff]/10"
                onClick={() => copyToClipboard(CHONK9K_TOKEN_ADDRESS)}
              >
                📋
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Supply</p>
                <p className="font-medium">{tokenMetadata.totalSupply}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Decimals</p>
                <p className="font-medium">9</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Token Type</p>
                <p className="font-medium">Solana SPL</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Launch Date</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-1">Description</p>
              <p className="text-sm">
                $CHONK9K is a community-driven meme token combining cryptocurrency enthusiasm with engaging web 
                experiences and unique cyberpunk aesthetics.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <a 
              href={`https://solscan.io/token/${CHONK9K_TOKEN_ADDRESS}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-[#00e0ff] hover:underline flex items-center gap-1"
            >
              View on Solscan 🔗
            </a>
            <a 
              href={`https://dexscreener.com/solana/${CHONK9K_TOKEN_ADDRESS}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-[#00e0ff] hover:underline flex items-center gap-1"
            >
              View on DexScreener 🔗
            </a>
          </CardFooter>
        </Card>

        <Card className="bg-black/90 backdrop-blur-xl border border-[#ff00ff]/30 text-white shadow-lg shadow-[#ff00ff]/10">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">
              Trading & Liquidity
            </CardTitle>
            <CardDescription className="text-gray-400">
              Ways to buy, sell and provide liquidity for $CHONK9K
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <h3 className="font-medium text-[#ff00ff]">DEX Trading</h3>
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href={`https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${CHONK9K_TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-gray-800 hover:border-[#ff00ff]/50 flex items-center gap-2 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                    <img src="/images/wallets/raydium.svg" alt="Raydium" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">Raydium</p>
                    <p className="text-xs text-gray-400">Swap on Raydium</p>
                  </div>
                </a>
                <a 
                  href={`https://jup.ag/swap/SOL-${CHONK9K_TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-gray-800 hover:border-[#ff00ff]/50 flex items-center gap-2 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                    <img src="/images/wallets/jupiter.svg" alt="Jupiter" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">Jupiter</p>
                    <p className="text-xs text-gray-400">Swap on Jupiter</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-[#00e0ff]">Pair With</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-gray-800 hover:border-[#ff00ff]/50 flex items-center gap-2 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                    <ChonkTokenLogo size={24} />
                  </div>
                  <div>
                    <p className="font-medium">CHONK9K</p>
                    <p className="text-xs text-gray-400">Chonk Token</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-800 hover:border-[#ff00ff]/50 flex items-center gap-2 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                    <img src="/images/coins/sol.svg" alt="SOL" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">SOL</p>
                    <p className="text-xs text-gray-400">Solana</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-800 hover:border-[#ff00ff]/50 flex items-center gap-2 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                    <img src="/images/coins/usdc.svg" alt="USDC" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">USDC</p>
                    <p className="text-xs text-gray-400">USD Coin</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="bg-black/90 backdrop-blur-xl border border-[#ff00ff]/30 text-white shadow-lg shadow-[#ff00ff]/10">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">
              Tokenomics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium text-[#ff00ff]">Distribution</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Community:</span>
                    <span>70%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Liquidity:</span>
                    <span>15%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Team:</span>
                    <span>10%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Marketing:</span>
                    <span>5%</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-[#00e0ff]">Transaction Fees</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Buy Fee:</span>
                    <span>1%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Sell Fee:</span>
                    <span>1%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">LP Fee:</span>
                    <span>0.3%</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-[#ff00ff]">Fee Allocation</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Development:</span>
                    <span>40%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Marketing:</span>
                    <span>30%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Buyback & Burn:</span>
                    <span>30%</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">
          Get Started with $CHONK9K
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/crypto">
            <Button className="bg-gradient-to-r from-[#ff00ff] to-[#ff00ff]/70 hover:from-[#ff00ff]/90 hover:to-[#ff00ff]/60 text-white flex items-center gap-2">
              <ChonkTokenLogo size={20} /> Buy $CHONK9K
            </Button>
          </Link>
          <a 
            href={`https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${CHONK9K_TOKEN_ADDRESS}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="border-[#00e0ff] text-[#00e0ff] hover:bg-[#00e0ff]/10">
              Trade on Raydium
            </Button>
          </a>
          <Link href="/mining">
            <Button variant="outline" className="border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff]/10">
              Start Mining
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SimpleTokenDisplay;