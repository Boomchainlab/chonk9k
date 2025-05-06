import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Wallet, ArrowRightLeft, Calendar, Clock, Shield, ChevronRight, CheckCircle } from 'lucide-react';
import Fiat24PaymentCard from '@/components/Fiat24PaymentCard';
import { useChonkWallet } from '@/hooks/useChonkWallet';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { account, connectWallet } = useChonkWallet();
  
  // Hard-coded Ethereum address from user's input
  const targetEthAddress = '0x133caeeca096ca54889db71956c7f75862ead7a0';
  
  const handleConnectWallet = async () => {
    try {
      const success = await connectWallet('metamask', 'evm');
      if (success) {
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been successfully connected.",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleCardActivation = () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Card Activated",
        description: "Your Fiat24 payment card has been successfully activated.",
      });
    }, 2000);
  };

  const paymentFeatures = [
    {
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      title: "Virtual Debit Card",
      description: "Use your $CHONK9K tokens for everyday purchases with the Fiat24 virtual debit card."
    },
    {
      icon: <ArrowRightLeft className="h-8 w-8 text-primary" />,
      title: "Instant Conversions",
      description: "Seamlessly convert between $CHONK9K and fiat currencies at the time of purchase."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Real-time Tracking",
      description: "Monitor your transactions and balance in real-time through the dashboard."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure Transactions",
      description: "All transactions are secured through the blockchain and Fiat24's advanced security protocols."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/30 to-black text-white">
      {/* Payments Header - Unique blue/teal style */}
      <div className="bg-gradient-to-r from-blue-900 to-teal-900 shadow-lg border-b border-blue-500/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:justify-between">            
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center">
                <CreditCard className="mr-2 h-8 w-8 text-blue-400" />
                $CHONK9K Payments
              </h1>
              <p className="text-blue-100/80 mt-2">
                Use your $CHONK9K tokens for real-world payments with Fiat24 integration
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button 
                onClick={handleConnectWallet} 
                disabled={!!account}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {account ? "Wallet Connected" : "Connect Wallet"}
                {account && <CheckCircle className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="card">Payment Card</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">$CHONK9K Payments</h2>
                <p className="text-gray-300 mb-6">
                  Turn your $CHONK9K tokens into real-world spending power with our Fiat24 integration. The future of crypto payments is here.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-700/30">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Wallet className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Token Balance</h3>
                        <p className="text-2xl font-bold mt-2">{account ? "2,420.69" : "--"} CHONK9K</p>
                        <p className="text-sm text-gray-400 mt-1">{account ? "≈ $1,017.48" : "--"}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-teal-900/40 to-teal-800/20 border-teal-700/30">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <CreditCard className="h-8 w-8 mx-auto mb-2 text-teal-400" />
                        <h3 className="text-lg font-semibold text-white">Card Status</h3>
                        <p className="text-xl font-bold mt-2">{account ? "Ready to Activate" : "Connect Wallet"}</p>
                        <p className="text-sm text-gray-400 mt-1">{account ? "Fiat24 Integration" : "--"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Button 
                  size="lg" 
                  onClick={() => setActiveTab('card')} 
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
                >
                  View Payment Card <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="relative flex items-center justify-center p-4">
                <div className="absolute -rotate-6 transform scale-90 opacity-70">
                  <Fiat24PaymentCard walletAddress={account?.address} showConnectPrompt={!account} />
                </div>
                <div className="relative z-10">
                  <Fiat24PaymentCard walletAddress={account?.address} showConnectPrompt={!account} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {paymentFeatures.map((feature, index) => (
                <Card key={index} className="bg-black/40 border-gray-800 hover:bg-black/60 transition-all">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Card Tab */}
          <TabsContent value="card" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card className="bg-black/40 border-gray-800">
                  <CardHeader>
                    <CardTitle>Your Payment Card</CardTitle>
                    <CardDescription>
                      Powered by Fiat24 and the $CHONK9K token
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Fiat24PaymentCard walletAddress={account ? account.address : targetEthAddress} showConnectPrompt={false} />
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <div className="w-full">
                      <Button 
                        onClick={handleCardActivation} 
                        disabled={isProcessing || !account} 
                        className="w-full bg-gradient-to-r from-blue-600 to-teal-600"
                      >
                        {isProcessing ? (
                          <>
                            <span className="animate-spin mr-2">●</span> 
                            Activating Card...
                          </>
                        ) : (
                          "Activate Payment Card"
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      By activating, you agree to the Fiat24 terms of service and privacy policy.
                    </p>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-black/40 border-gray-800">
                  <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Connect Your Wallet</h3>
                        <p className="text-gray-400 text-sm">Link your Web3 wallet containing $CHONK9K tokens.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Activate Your Card</h3>
                        <p className="text-gray-400 text-sm">Complete the activation process to enable your virtual payment card.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Make Payments</h3>
                        <p className="text-gray-400 text-sm">Use your card for online purchases or add it to Apple/Google Pay.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Automatic Conversion</h3>
                        <p className="text-gray-400 text-sm">$CHONK9K is automatically converted to the merchant's currency at the best rate.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/40 border-gray-800">
                  <CardHeader>
                    <CardTitle>Card Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>No monthly fees for $CHONK9K holders</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Competitive exchange rates with minimal spread</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Earn 1% cashback in $CHONK9K on all purchases</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Compatible with major payment systems worldwide</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Enhanced security with blockchain verification</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6">
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  View your recent payment card transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {account ? (
                  <div className="space-y-4">
                    <div className="bg-gray-900/50 rounded-lg p-6 text-center">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <h3 className="text-xl font-medium mb-2">No Transactions Yet</h3>
                      <p className="text-gray-400">
                        Once you activate your card and make purchases, your transaction history will appear here.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-900/50 rounded-lg p-6 text-center">
                    <Wallet className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <h3 className="text-xl font-medium mb-2">Wallet Not Connected</h3>
                    <p className="text-gray-400 mb-4">
                      Please connect your wallet to view your transaction history.
                    </p>
                    <Button onClick={handleConnectWallet} className="bg-blue-600 hover:bg-blue-700">
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>
                  Customize your $CHONK9K payment experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                {account ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="payment-address">Connected Wallet Address</Label>
                      <Input 
                        id="payment-address" 
                        value={account.address} 
                        readOnly 
                        className="bg-black/50 border-gray-700 text-gray-300 font-mono"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="iban">IBAN Account Number</Label>
                      <Input 
                        id="iban" 
                        value="CH63 8305 1000 0238 3873 9" 
                        readOnly 
                        className="bg-black/50 border-gray-700 text-gray-300 font-mono"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="default-currency">Default Currency</Label>
                      <Input 
                        id="default-currency" 
                        value="USD" 
                        readOnly 
                        className="bg-black/50 border-gray-700 text-gray-300"
                      />
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Save Settings
                    </Button>
                  </div>
                ) : (
                  <div className="bg-gray-900/50 rounded-lg p-6 text-center">
                    <Shield className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <h3 className="text-xl font-medium mb-2">Wallet Not Connected</h3>
                    <p className="text-gray-400 mb-4">
                      Please connect your wallet to access payment settings.
                    </p>
                    <Button onClick={handleConnectWallet} className="bg-blue-600 hover:bg-blue-700">
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Payments;