import React from 'react';
import { Button } from "@/components/ui/button";
import ImprovedGamifiedWalletConnect from "@/components/ImprovedGamifiedWalletConnect";
import SimpleGamifiedWalletConnect from "@/components/SimpleGamifiedWalletConnect";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useChonkWallet } from '@/hooks/useChonkWallet';
import { Trophy, Star, Flame, Sparkles, ChevronRight, InfoIcon, BarChart4 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * WalletFeatures component that showcases the different wallet connection components
 * and features of the gamified wallet connection experience.
 */
const WalletFeatures: React.FC = () => {
  const { account, isConnected } = useChonkWallet();
  
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        {/* Hero section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
            CHONK9K Wallet Experience
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Connect your wallet with our gamified experience to earn achievements, complete quests, and level up!
          </p>
        </motion.div>
        
        {/* Main content section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Wallet connector options */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 space-y-8"
          >
            <Card className="bg-black/40 border-[#ff00ff]/30 text-white">
              <CardHeader>
                <CardTitle className="text-2xl text-[#ff00ff]">Wallet Connection Options</CardTitle>
                <CardDescription className="text-gray-400">Choose from our different wallet connection experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="improved">
                  <TabsList className="w-full grid grid-cols-2 bg-black/60 border border-[#ff00ff]/20">
                    <TabsTrigger value="improved" className="data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-[#ff00ff]">
                      Improved Gamified
                    </TabsTrigger>
                    <TabsTrigger value="simple" className="data-[state=active]:bg-[#00e0ff]/20 data-[state=active]:text-[#00e0ff]">
                      Simple Gamified
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="improved" className="pt-4">
                    <div className="rounded-lg border border-[#ff00ff]/30 bg-black/60 p-6">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <h3 className="text-xl font-bold text-white">Improved Gamified Wallet Connect</h3>
                        <p className="text-gray-400 text-center max-w-md">
                          Our latest wallet connection experience with achievements, quests, and levels.
                        </p>
                        <div className="flex items-center justify-center space-x-3 mt-4">
                          <div className="h-8 w-8 rounded-full bg-[#ff00ff]/20 flex items-center justify-center">
                            <Trophy className="h-4 w-4 text-[#ff00ff]" />
                          </div>
                          <div className="h-8 w-8 rounded-full bg-[#00e0ff]/20 flex items-center justify-center">
                            <Star className="h-4 w-4 text-[#00e0ff]" />
                          </div>
                          <div className="h-8 w-8 rounded-full bg-[#ffcc00]/20 flex items-center justify-center">
                            <Flame className="h-4 w-4 text-[#ffcc00]" />
                          </div>
                        </div>
                        <div className="pt-4">
                          <ImprovedGamifiedWalletConnect size="lg" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="simple" className="pt-4">
                    <div className="rounded-lg border border-[#00e0ff]/30 bg-black/60 p-6">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <h3 className="text-xl font-bold text-white">Simple Gamified Wallet Connect</h3>
                        <p className="text-gray-400 text-center max-w-md">
                          Our original wallet connection experience with basic gamification elements.
                        </p>
                        <div className="pt-4">
                          <SimpleGamifiedWalletConnect size="lg" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-[#00e0ff]/30 text-white">
              <CardHeader>
                <CardTitle className="text-2xl text-[#00e0ff]">Features Comparison</CardTitle>
                <CardDescription className="text-gray-400">See how our wallet connection experiences compare</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-4 px-2 text-gray-400">Feature</th>
                        <th className="text-center py-4 px-2 text-[#ff00ff]">Improved Gamified</th>
                        <th className="text-center py-4 px-2 text-[#00e0ff]">Simple Gamified</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-2 text-gray-300">Achievement System</td>
                        <td className="text-center py-3 px-2 text-[#ff00ff]">✓</td>
                        <td className="text-center py-3 px-2 text-gray-600">✗</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-2 text-gray-300">Quest System</td>
                        <td className="text-center py-3 px-2 text-[#ff00ff]">✓</td>
                        <td className="text-center py-3 px-2 text-gray-600">✗</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-2 text-gray-300">Level Progression</td>
                        <td className="text-center py-3 px-2 text-[#ff00ff]">✓</td>
                        <td className="text-center py-3 px-2 text-gray-600">✗</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-2 text-gray-300">Daily Rewards</td>
                        <td className="text-center py-3 px-2 text-[#ff00ff]">✓</td>
                        <td className="text-center py-3 px-2 text-gray-600">✗</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-2 text-gray-300">Animated Effects</td>
                        <td className="text-center py-3 px-2 text-[#ff00ff]">✓</td>
                        <td className="text-center py-3 px-2 text-[#00e0ff]">✓</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-2 text-gray-300">Multi-Chain Support</td>
                        <td className="text-center py-3 px-2 text-[#ff00ff]">✓</td>
                        <td className="text-center py-3 px-2 text-[#00e0ff]">✓</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-2 text-gray-300">Wallet Selection</td>
                        <td className="text-center py-3 px-2 text-[#ff00ff]">13+ Wallets</td>
                        <td className="text-center py-3 px-2 text-[#00e0ff]">4 Wallets</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-2 text-gray-300">Rarity System</td>
                        <td className="text-center py-3 px-2 text-[#ff00ff]">✓</td>
                        <td className="text-center py-3 px-2 text-gray-600">✗</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 text-gray-300">Sentry Error Tracking</td>
                        <td className="text-center py-3 px-2 text-[#ff00ff]">✓</td>
                        <td className="text-center py-3 px-2 text-[#00e0ff]">✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Right column - Benefits and info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <Card className="bg-black/40 border-[#ffcc00]/30 text-white">
              <CardHeader>
                <CardTitle className="text-xl text-[#ffcc00] flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Benefits
                </CardTitle>
                <CardDescription className="text-gray-400">Why use our gamified wallet connection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 rounded-full bg-[#ff00ff]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Sparkles className="h-3 w-3 text-[#ff00ff]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Increased Engagement</h4>
                    <p className="text-sm text-gray-400">Users are more likely to connect their wallets and stay connected.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 rounded-full bg-[#00e0ff]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Sparkles className="h-3 w-3 text-[#00e0ff]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">User Retention</h4>
                    <p className="text-sm text-gray-400">Achievements and quests encourage users to return daily.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 rounded-full bg-[#ffcc00]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Sparkles className="h-3 w-3 text-[#ffcc00]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Rewards System</h4>
                    <p className="text-sm text-gray-400">Incentivizes actions with points and unlockable features.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 rounded-full bg-[#ff00ff]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Sparkles className="h-3 w-3 text-[#ff00ff]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">User Experience</h4>
                    <p className="text-sm text-gray-400">Smooth animations and visual feedback improve the connection flow.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-[#ff00ff]/30 text-white">
              <CardHeader>
                <CardTitle className="text-xl text-[#ff00ff] flex items-center">
                  <InfoIcon className="h-5 w-5 mr-2" />
                  Wallet Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-black/60 border border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Connection Status</span>
                      <Badge className={isConnected ? 
                        "bg-green-900/20 text-green-400 border-green-900/30" :
                        "bg-red-900/20 text-red-400 border-red-900/30"
                      }>
                        {isConnected ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                    {account && (
                      <div className="space-y-2 pt-2 border-t border-gray-800 mt-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Wallet Type</span>
                          <span className="text-white text-sm">{account.walletType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Chain</span>
                          <span className="text-white text-sm">{account.chainType === 'evm' ? 'Base' : 'Solana'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Address</span>
                          <span className="text-white text-sm">
                            {account.address.substring(0, 6)}...{account.address.substring(account.address.length - 4)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {isConnected ? (
                    <Alert className="bg-[#00e0ff]/10 border-[#00e0ff]/30">
                      <BarChart4 className="h-4 w-4 text-[#00e0ff]" />
                      <AlertTitle className="text-white">Wallet Connected</AlertTitle>
                      <AlertDescription className="text-gray-400">
                        You can now access all features of the CHONK9K platform.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-[#ff00ff]/10 border-[#ff00ff]/30">
                      <BarChart4 className="h-4 w-4 text-[#ff00ff]" />
                      <AlertTitle className="text-white">Wallet Not Connected</AlertTitle>
                      <AlertDescription className="text-gray-400">
                        Connect your wallet to access all features and start earning rewards.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-[#00e0ff]/30 text-white">
              <CardHeader>
                <CardTitle className="text-xl text-[#00e0ff]">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between border-[#00e0ff]/30 hover:bg-[#00e0ff]/10 text-[#00e0ff]" onClick={() => window.location.href = "/token"}>
                  View CHONK9K Token
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" className="w-full justify-between border-[#ff00ff]/30 hover:bg-[#ff00ff]/10 text-[#ff00ff]" onClick={() => window.location.href = "/crypto"}>
                  Buy/Sell Tokens
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" className="w-full justify-between border-[#ffcc00]/30 hover:bg-[#ffcc00]/10 text-[#ffcc00]" onClick={() => window.location.href = "/trivia"}>
                  Play Trivia Games
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WalletFeatures;

// Missing UI components
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};
