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
            <CardDescription className="text-gray-400 flex flex-col gap-1">
              <div>
                Token Contract: <span className="text-[#00e0ff] break-all font-mono text-xs">{CHONK9K_TOKEN_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-gray-800 hover:bg-gray-700 cursor-pointer" onClick={() => copyToClipboard(CHONK9K_TOKEN_ADDRESS)}>
                  Copy Address 📋
                </Badge>
                <Badge className="bg-gray-800 hover:bg-gray-700 cursor-pointer">
                  {CONTRACT_ADDRESSES.SOLANA.CHONK9K === CHONK9K_TOKEN_ADDRESS ? "✅ Verified" : "❌ Mismatch"}
                </Badge>
              </div>
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
          <CardFooter className="flex flex-col gap-3">
            <div className="text-sm font-medium text-[#ff00ff]">Transaction Explorers:</div>
            <div className="flex flex-wrap gap-3">
              <a 
                href={`https://solscan.io/token/${CHONK9K_TOKEN_ADDRESS}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md text-white flex items-center gap-1"
              >
                View on Solscan 🔗
              </a>
              <a 
                href={`https://dexscreener.com/solana/${CHONK9K_TOKEN_ADDRESS}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md text-white flex items-center gap-1"
              >
                View on DexScreener 🔗
              </a>
              <a 
                href={`https://explorer.solana.com/address/${CHONK9K_TOKEN_ADDRESS}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md text-white flex items-center gap-1"
              >
                Solana Explorer 🔗
              </a>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Token Address: <span className="font-mono">{CHONK9K_TOKEN_ADDRESS}</span>
            </div>
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
              <div className="mb-2 text-sm text-gray-300">
                <div>Trade $CHONK9K with these approved DEXes</div>
                <div className="text-xs text-gray-400">Using token address: <span className="font-mono">{CHONK9K_TOKEN_ADDRESS.slice(0, 8)}...{CHONK9K_TOKEN_ADDRESS.slice(-8)}</span></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a 
                  href={`https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${CHONK9K_TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-[#ff00ff]/20 hover:border-[#ff00ff]/50 flex items-center gap-2 transition-colors bg-black/40"
                >
                  <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                    <img src="/images/wallets/raydium.svg" alt="Raydium" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">Raydium</p>
                    <p className="text-xs text-gray-400">Swap SOL for CHONK9K on Raydium</p>
                  </div>
                </a>
                <a 
                  href={`https://jup.ag/swap/SOL-${CHONK9K_TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-[#00e0ff]/20 hover:border-[#00e0ff]/50 flex items-center gap-2 transition-colors bg-black/40"
                >
                  <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                    <img src="/images/wallets/jupiter.svg" alt="Jupiter" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">Jupiter</p>
                    <p className="text-xs text-gray-400">Best price swaps across Solana DEXes</p>
                  </div>
                </a>
              </div>
              <div className="text-xs text-center text-[#ff00ff]/80 mt-2">
                <div>⚠️ Always verify the token address matches: {CHONK9K_TOKEN_ADDRESS}</div>
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

      <div className="mt-12 py-12 bg-black/60 border-t border-b border-[#ff00ff]/30 backdrop-blur-lg">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">
            Get Started with $CHONK9K
          </h2>
          <div className="mb-6 text-gray-300">
            <p>The official Solana token from the creators of Chonkpump 9000</p>
            <div className="mt-2 bg-black/40 p-2 rounded-md inline-flex items-center gap-2 border border-[#ff00ff]/20">
              <span className="text-xs text-gray-400">Token Address:</span>
              <code className="text-xs font-mono text-[#00e0ff]">{CHONK9K_TOKEN_ADDRESS}</code>
              <button 
                onClick={() => copyToClipboard(CHONK9K_TOKEN_ADDRESS)}
                className="px-2 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/crypto">
              <Button size="lg" className="bg-gradient-to-r from-[#ff00ff] to-[#ff00ff]/70 hover:from-[#ff00ff]/90 hover:to-[#ff00ff]/60 text-white flex items-center gap-2">
                <ChonkTokenLogo size={20} /> Buy $CHONK9K
              </Button>
            </Link>
            <a 
              href={`https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${CHONK9K_TOKEN_ADDRESS}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="border-[#00e0ff] text-[#00e0ff] hover:bg-[#00e0ff]/10">
                Trade on Raydium
              </Button>
            </a>
            <Link href="/mining">
              <Button size="lg" variant="outline" className="border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff]/10">
                Start Mining
              </Button>
            </Link>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Always verify the token address when trading to avoid scams
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTokenDisplay;