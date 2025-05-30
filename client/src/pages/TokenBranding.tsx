import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TokenIcons from '@/components/TokenIcons';
import ChonkTokenLogo from '@/components/ChonkTokenLogo';
import { CONTRACT_ADDRESSES } from '@shared/constants';

const TokenBranding: React.FC = () => {
  const tokenAddress = CONTRACT_ADDRESSES.SOLANA.CHONK9K;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">
          $CHONK9K Token Branding
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
          Complete visual identity and description guide for the CHONK9K token
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <Card className="bg-black/90 backdrop-blur-xl border border-[#ff00ff]/30 text-white shadow-lg shadow-[#ff00ff]/10">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">
              Logo Variations
            </CardTitle>
            <CardDescription className="text-gray-400">
              Official logo formats for the $CHONK9K token
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-black to-gray-900 border border-gray-800">
                <h3 className="text-lg font-medium text-white mb-3">Component Logos</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <ChonkTokenLogo size={64} />
                    <span className="text-xs text-gray-400">Component</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <ChonkTokenLogo size={64} className="animate-pulse" />
                    <span className="text-xs text-gray-400">Animated</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-black to-gray-900 border border-gray-800">
                <h3 className="text-lg font-medium text-white mb-3">Static Icons</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <TokenIcons size="small" />
                    <span className="text-xs text-gray-400">32px</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <TokenIcons size="medium" />
                    <span className="text-xs text-gray-400">64px</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <TokenIcons size="large" />
                    <span className="text-xs text-gray-400">128px</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-black to-gray-900 border border-gray-800">
                <h3 className="text-lg font-medium text-white mb-3">Enhanced Logo</h3>
                <div className="flex flex-col items-center gap-3">
                  <TokenIcons type="enhanced" size="large" showBackground={true} />
                  <span className="text-xs text-gray-400">Enhanced with glow effect</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-black to-gray-900 border border-gray-800">
                <h3 className="text-lg font-medium text-white mb-3">Social Media Card</h3>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full p-2 bg-black/50 border border-gray-800 rounded">
                    <img src="/icons/chonk9k-social.svg" alt="CHONK9K Social Card" className="w-full h-auto rounded" />
                  </div>
                  <span className="text-xs text-gray-400">Social media promotional format</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/90 backdrop-blur-xl border border-[#ff00ff]/30 text-white shadow-lg shadow-[#ff00ff]/10">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">
              Brand Guidelines
            </CardTitle>
            <CardDescription className="text-gray-400">
              Colors, typography, and usage instructions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-gradient-to-br from-black to-gray-900 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-3">Brand Colors</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="h-16 rounded-md bg-[#ff00ff] mb-2"></div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Primary</span>
                    <span className="font-mono text-gray-400">#ff00ff</span>
                  </div>
                </div>
                <div>
                  <div className="h-16 rounded-md bg-[#00e0ff] mb-2"></div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Secondary</span>
                    <span className="font-mono text-gray-400">#00e0ff</span>
                  </div>
                </div>
                <div>
                  <div className="h-8 rounded-md bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] mb-2"></div>
                  <div className="text-xs text-gray-400">Gradient</div>
                </div>
                <div>
                  <div className="h-8 rounded-md bg-black border border-gray-800 mb-2"></div>
                  <div className="text-xs text-gray-400">Background</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-black to-gray-900 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-3">Token Description</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-[#ff00ff] mb-1">Short Description (25 words)</h4>
                  <p className="text-sm text-gray-300">
                    CHONK9K is a community-driven Solana SPL token combining cryptocurrency innovation with engaging, gamified web3 experiences and unique cyberpunk aesthetics.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#00e0ff] mb-1">Medium Description (50 words)</h4>
                  <p className="text-sm text-gray-300">
                    The $CHONK9K token powers a vibrant ecosystem where users can earn, stake, and participate in interactive features including trivia games, badge collections, mining simulations, and more - all while enjoying the unique visual identity of the Chonk cyberpunk brand.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#ff00ff] mb-1">Technical Description (50 words)</h4>
                  <p className="text-sm text-gray-300">
                    $CHONK9K is a Solana SPL token with a total supply of 9 billion tokens, featuring a 1% buy/sell fee structure that contributes to development, marketing, and a deflationary buyback and burn program. The token supports multi-wallet connectivity and DEX trading on platforms like Raydium and Jupiter.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-black to-gray-900 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-3">Taglines</h3>
              <ul className="space-y-2">
                <li className="text-sm italic px-3 py-2 bg-black/30 rounded border-l-2 border-[#ff00ff]">
                  "Where Cyberpunk Meets Crypto"
                </li>
                <li className="text-sm italic px-3 py-2 bg-black/30 rounded border-l-2 border-[#00e0ff]">
                  "The Future is Chonky"
                </li>
                <li className="text-sm italic px-3 py-2 bg-black/30 rounded border-l-2 border-[#ff00ff]">
                  "Powered by Community, Driven by Innovation"
                </li>
                <li className="text-sm italic px-3 py-2 bg-black/30 rounded border-l-2 border-[#00e0ff]">
                  "Not Just a Token, a Digital Experience"
                </li>
                <li className="text-sm italic px-3 py-2 bg-black/30 rounded border-l-2 border-[#ff00ff]">
                  "Earn, Stake, Play, Repeat"
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-black to-gray-900 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-3">Token Address</h3>
              <div className="bg-black p-3 rounded-md border border-gray-800">
                <div className="text-xs text-gray-400 mb-1">Solana Mainnet:</div>
                <code className="text-xs font-mono text-[#00e0ff] break-all">{tokenAddress}</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/90 backdrop-blur-xl border border-[#ff00ff]/30 text-white shadow-lg shadow-[#ff00ff]/10 mb-8">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">
            Usage Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-black to-gray-900 border border-gray-800">
                <h3 className="text-lg font-medium text-[#ff00ff] mb-2">Do's</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Use the official logo in promotional materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Maintain proper spacing around the logo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Include the $ symbol when writing $CHONK9K</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Use the brand colors consistently</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-black to-gray-900 border border-gray-800">
                <h3 className="text-lg font-medium text-[#00e0ff] mb-2">Don'ts</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Stretch or distort the logo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Change the official color palette</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Use the logo on cluttered backgrounds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Display incorrect token address information</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-3 p-2 border border-gray-800 rounded bg-black/50">
              For full brand guidelines and high-resolution assets, refer to the CHONK9K_TOKEN_DESCRIPTION.md file
              in the project repository.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenBranding;