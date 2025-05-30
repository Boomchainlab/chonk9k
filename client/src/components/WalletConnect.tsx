import { useState } from 'react';
import { useWeb3 } from '../hooks/use-web3';
import { Wallet, RefreshCw, LogOut, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export function WalletConnect() {
  const { 
    connected, 
    address, 
    balance, 
    tokenBalance, 
    isConnecting, 
    isProcessing,
    connectWallet, 
    disconnectWallet, 
    buyTokens, 
    sellTokens,
    refreshBalances
  } = useWeb3();
  
  const [buyAmount, setBuyAmount] = useState('1000');
  const [sellAmount, setSellAmount] = useState('1000');
  const [activeTab, setActiveTab] = useState('buy');
  
  // Format address for display
  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  
  // Handle buy action
  const handleBuy = async () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0) return;
    await buyTokens(buyAmount);
  };
  
  // Handle sell action
  const handleSell = async () => {
    if (!sellAmount || parseFloat(sellAmount) <= 0) return;
    await sellTokens(sellAmount);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Chonk9k Wallet</span>
          {connected && (
            <Badge variant="outline" className="ml-2 font-mono text-xs">
              {formatAddress(address)}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {connected 
            ? 'Buy and sell Chonk9k tokens using crypto payments' 
            : 'Connect your wallet to buy and sell Chonk9k tokens'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!connected ? (
          <Button 
            onClick={connectWallet} 
            disabled={isConnecting}
            className="w-full"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">ETH Balance</Label>
                <p className="font-semibold">{balance ? `${parseFloat(balance).toFixed(4)} ETH` : <Skeleton className="h-6 w-20" />}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">CHONK9K Balance</Label>
                <p className="font-semibold">{tokenBalance ? `${parseInt(tokenBalance).toLocaleString()} CHONK9K` : <Skeleton className="h-6 w-20" />}</p>
              </div>
            </div>
          
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">Buy Tokens</TabsTrigger>
                <TabsTrigger value="sell">Sell Tokens</TabsTrigger>
              </TabsList>
              
              <TabsContent value="buy" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="buyAmount">Amount to Buy</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="buyAmount"
                      type="number"
                      min="1"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      placeholder="1000"
                    />
                    <Button 
                      onClick={handleBuy} 
                      disabled={isProcessing || !buyAmount || parseFloat(buyAmount) <= 0}
                    >
                      {isProcessing ? 'Processing...' : 'Buy'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cost: {buyAmount ? `${(parseFloat(buyAmount) * 0.0001).toFixed(6)} ETH` : '0 ETH'}
                  </p>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>
                    This will initiate a transaction in your wallet. You'll need ETH to pay for gas fees and the token purchase.
                  </AlertDescription>
                </Alert>
              </TabsContent>
              
              <TabsContent value="sell" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="sellAmount">Amount to Sell</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="sellAmount"
                      type="number"
                      min="1"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value)}
                      placeholder="1000"
                    />
                    <Button 
                      onClick={handleSell} 
                      disabled={
                        isProcessing || 
                        !sellAmount || 
                        parseFloat(sellAmount) <= 0 ||
                        !tokenBalance ||
                        parseFloat(sellAmount) > parseFloat(tokenBalance)
                      }
                    >
                      {isProcessing ? 'Processing...' : 'Sell'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receive: {sellAmount ? `${(parseFloat(sellAmount) * 0.00009).toFixed(6)} ETH` : '0 ETH'} (after 10% fee)
                  </p>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>
                    This will initiate a transaction in your wallet. You'll need to approve the token transfer.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      
      {connected && (
        <CardFooter className="flex justify-between pt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={refreshBalances}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh Balances</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={disconnectWallet}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}