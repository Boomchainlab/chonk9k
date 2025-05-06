import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletConnect } from '../components/WalletConnect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Wallet, ArrowLeftRight, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CryptoPayments() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Buy & Sell $CHONK9K</h1>
      <p className="text-muted-foreground mb-6">
        Connect your crypto wallet to purchase or sell Chonk9k tokens directly.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <WalletConnect />
          
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important Note</AlertTitle>
            <AlertDescription>
              Make sure you're connected to the Base network before attempting transactions.
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Why $CHONK9K?</CardTitle>
              <CardDescription>The meme token with real utility and community benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Simple Transactions</h3>
                  <p className="text-sm text-muted-foreground">Buy and sell $CHONK9K tokens directly with your crypto wallet on the Base blockchain.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <ArrowLeftRight className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Low Fees</h3>
                  <p className="text-sm text-muted-foreground">Enjoy minimal transaction fees thanks to the Base blockchain's efficiency.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Secure Transactions</h3>
                  <p className="text-sm text-muted-foreground">All transactions are secured by blockchain technology and smart contracts.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about using crypto to buy $CHONK9K</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="wallet" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="wallet">Wallets</TabsTrigger>
                  <TabsTrigger value="buying">Buying</TabsTrigger>
                  <TabsTrigger value="selling">Selling</TabsTrigger>
                </TabsList>
                
                <TabsContent value="wallet" className="space-y-4 pt-4">
                  <div>
                    <h3 className="font-medium">Which wallets are supported?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      We support MetaMask, Coinbase Wallet, WalletConnect, and other Ethereum-compatible wallets that work with the Base blockchain.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Do I need to be on a specific network?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Yes, you need to be connected to the Base network. Our app will prompt you to switch networks if needed.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Is my wallet information secure?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      We never store your private keys. All interactions happen directly between your wallet and the blockchain.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="buying" className="space-y-4 pt-4">
                  <div>
                    <h3 className="font-medium">How do I buy $CHONK9K tokens?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect your wallet, enter the amount of tokens you want to purchase, and confirm the transaction in your wallet.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">What is the current price?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      The current price is 0.0001 ETH per CHONK9K token (10,000 CHONK9K = 1 ETH).
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Do I need ETH to buy tokens?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Yes, you need ETH both for paying for the tokens and for transaction fees (gas).
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="selling" className="space-y-4 pt-4">
                  <div>
                    <h3 className="font-medium">How do I sell my $CHONK9K tokens?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect your wallet, go to the Sell tab, enter the amount you wish to sell, and confirm the transaction.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Are there fees for selling?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      There's a 10% selling fee that goes toward community development and rewards. You also need ETH to pay for gas fees.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">How long do transactions take?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Most transactions are confirmed within a few minutes, depending on network congestion and the gas price you set.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}