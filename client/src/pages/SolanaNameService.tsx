import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, CheckCircle, CheckCircle2, AlertCircle, Loader2, Search, ShoppingCart, CreditCard, ShieldCheck, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChonkWallet } from '@/hooks/useChonkWallet';
// Importing wallet types directly to avoid circular dependencies
type ChainType = 'evm' | 'solana';
type WalletType = 'metamask' | 'phantom' | 'coinbase' | 'solflare' | 'okx' | 'jupiter' | 'raydium' | 'orca' | 'wen' | 'bitverse' | 'warpcast' | 'frame' | 'rainbow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getSolanaConnection } from '@/lib/solanaConnection';

const DOT_SOL = '.sol';
const SNS_PRICES = {
  '1year': {
    price: 20,
    label: '1 Year',
    discount: 0
  },
  '2year': {
    price: 36,
    label: '2 Years',
    discount: 10
  },
  '5year': {
    price: 75,
    label: '5 Years',
    discount: 25
  }
};

type DomainStatus = 'available' | 'unavailable' | 'checking' | 'invalid' | null;

interface DomainChecker {
  domain: string;
  status: DomainStatus;
  price: number;
  duration: string;
}

const SolanaNameService: React.FC = () => {
  const { toast } = useToast();
  const { account, connectWallet, isConnected } = useChonkWallet();
  const [domains, setDomains] = useState<DomainChecker[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [duration, setDuration] = useState<keyof typeof SNS_PRICES>('1year');
  const [checking, setChecking] = useState(false);
  const [cart, setCart] = useState<DomainChecker[]>([]);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  // Calculate total cost from cart
  const cartTotal = cart.reduce((total, item) => total + item.price, 0);
  
  // Handle domain search/check
  const checkDomain = async () => {
    // Normalize and validate the domain
    const normalizedDomain = newDomain.toLowerCase().trim();
    
    // Validate domain format
    if (!/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(normalizedDomain)) {
      toast({
        title: "Invalid Domain Format",
        description: "Domains must be 3-50 characters and contain only letters, numbers, and hyphens. They cannot start or end with a hyphen.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if domain already in list
    if (domains.some(d => d.domain === normalizedDomain)) {
      toast({
        title: "Domain Already Checked",
        description: `${normalizedDomain}${DOT_SOL} is already in your list.`,
      });
      return;
    }
    
    // Add domain to list with checking status
    const newDomainObj: DomainChecker = {
      domain: normalizedDomain,
      status: 'checking',
      price: SNS_PRICES[duration].price,
      duration: duration
    };
    
    setDomains(prev => [...prev, newDomainObj]);
    setChecking(true);
    
    try {
      // In a real app, this would make an RPC call to check domain availability
      // For demo purposes, we'll simulate an API call with random results and delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate availability check - in real app would use @solana/spl-name-service
      const isAvailable = Math.random() > 0.3; // 70% chance domain is available for demo
      
      // Update domain status
      setDomains(prev => prev.map(d => {
        if (d.domain === normalizedDomain) {
          return {
            ...d,
            status: isAvailable ? 'available' : 'unavailable'
          };
        }
        return d;
      }));
      
      if (isAvailable) {
        toast({
          title: "Domain Available!",
          description: `${normalizedDomain}${DOT_SOL} is available for registration.`,
        });
      } else {
        toast({
          title: "Domain Unavailable",
          description: `${normalizedDomain}${DOT_SOL} is already registered.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error Checking Domain",
        description: "There was an error checking domain availability. Please try again.",
        variant: "destructive"
      });
      
      // Update domain status to reflect error
      setDomains(prev => prev.map(d => {
        if (d.domain === normalizedDomain) {
          return {
            ...d,
            status: 'invalid'
          };
        }
        return d;
      }));
    } finally {
      setChecking(false);
      setNewDomain(''); // Clear input
    }
  };
  
  // Add domain to cart
  const addToCart = (domain: string) => {
    const domainToAdd = domains.find(d => d.domain === domain);
    
    if (domainToAdd && domainToAdd.status === 'available') {
      if (cart.some(c => c.domain === domain)) {
        toast({
          title: "Already in Cart",
          description: `${domain}${DOT_SOL} is already in your cart.`,
        });
        return;
      }
      
      setCart(prev => [...prev, domainToAdd]);
      toast({
        title: "Added to Cart",
        description: `${domain}${DOT_SOL} added to your cart.`,
      });
    }
  };
  
  // Remove domain from cart
  const removeFromCart = (domain: string) => {
    setCart(prev => prev.filter(d => d.domain !== domain));
    toast({
      title: "Removed from Cart",
      description: `${domain}${DOT_SOL} removed from your cart.`,
    });
  };
  
  // Proceed to checkout
  const proceedToCheckout = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to proceed to checkout.",
        variant: "destructive"
      });
      return;
    }
    
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add domains to your cart before checkout.",
        variant: "destructive"
      });
      return;
    }
    
    setCheckoutStep(2);
  };
  
  // Process payment
  const processPayment = async () => {
    if (!isConnected) return;
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would create a transaction to register domains
      // For demo, we'll simulate the process with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsProcessing(false);
      setPaymentComplete(true);
      setCheckoutStep(3);
      
      toast({
        title: "Domains Registered!",
        description: `Successfully registered ${cart.length} domain(s).`,
      });
    } catch (error) {
      setIsProcessing(false);
      
      toast({
        title: "Registration Failed",
        description: "There was an error registering your domains. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Reset the checkout process
  const resetCheckout = () => {
    setCart([]);
    setDomains([]);
    setCheckoutStep(1);
    setPaymentComplete(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              Solana Name Service
            </h1>
          </div>
          <p className="text-muted-foreground">
            Register your .sol domain on the Solana blockchain. Use it for wallet addressing, websites, and more.
          </p>
        </div>

        <Tabs defaultValue="register" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="register">Register Domains</TabsTrigger>
            <TabsTrigger value="manage">Manage Domains</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="register">
            {checkoutStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Search for a Domain</CardTitle>
                      <CardDescription>
                        Check if your desired Solana domain name is available for registration.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="domain">Domain Name</Label>
                          <div className="flex items-center">
                            <Input
                              id="domain"
                              placeholder="yourdomain"
                              value={newDomain}
                              onChange={(e) => setNewDomain(e.target.value)}
                              className="rounded-r-none"
                              disabled={checking}
                            />
                            <div className="bg-muted px-3 h-10 flex items-center border border-l-0 rounded-r-md">
                              {DOT_SOL}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="duration">Registration Duration</Label>
                          <Select
                            value={duration}
                            onValueChange={(value) => setDuration(value as keyof typeof SNS_PRICES)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(SNS_PRICES).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  <span className="flex items-center justify-between w-full">
                                    <span>{value.label}</span>
                                    <span className="ml-2 text-muted-foreground">
                                      {value.price} CHONK 9000
                                      {value.discount > 0 && (
                                        <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                                          Save {value.discount}%
                                        </Badge>
                                      )}
                                    </span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          onClick={checkDomain} 
                          disabled={checking || !newDomain.trim()}
                          className="mt-2 w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
                        >
                          {checking ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Checking...
                            </>
                          ) : (
                            <>
                              <Search className="mr-2 h-5 w-5" />
                              Check Availability
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {domains.length > 0 && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Domain Search Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {domains.map((domain) => (
                            <div 
                              key={domain.domain} 
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center">
                                {domain.status === 'checking' ? (
                                  <Loader2 className="h-5 w-5 mr-2 text-blue-500 animate-spin" />
                                ) : domain.status === 'available' ? (
                                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                                )}
                                <div>
                                  <p className="font-medium">{domain.domain}{DOT_SOL}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {domain.status === 'checking' && 'Checking availability...'}
                                    {domain.status === 'available' && 'Available for registration'}
                                    {domain.status === 'unavailable' && 'Already registered'}
                                    {domain.status === 'invalid' && 'Error checking domain'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="text-right mr-4">
                                  <p className="font-medium">{domain.price} CHONK 9000</p>
                                  <p className="text-xs text-muted-foreground">
                                    {SNS_PRICES[domain.duration as keyof typeof SNS_PRICES].label}
                                  </p>
                                </div>
                                {domain.status === 'available' && (
                                  <Button 
                                    size="sm"
                                    className={`px-4 transition-all duration-200 ${cart.some(d => d.domain === domain.domain) ? 
                                      'bg-green-100 text-green-700 hover:bg-green-200 border-green-300' : 
                                      'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300'}`}
                                    onClick={() => addToCart(domain.domain)}
                                    disabled={cart.some(d => d.domain === domain.domain)}
                                  >
                                    {cart.some(d => d.domain === domain.domain) ? (
                                      <>
                                        <CheckCircle className="mr-1 h-4 w-4" />
                                        In Cart
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingCart className="mr-1 h-4 w-4" />
                                        Add to Cart
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Cart</CardTitle>
                      <CardDescription>
                        Domains ready for registration
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {cart.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>Your cart is empty</p>
                          <p className="text-sm mt-2">Search for domains to add them to your cart</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cart.map((domain) => (
                            <div key={domain.domain} className="flex justify-between items-center border-b pb-2">
                              <p>{domain.domain}{DOT_SOL}</p>
                              <div className="flex items-center">
                                <span className="text-sm mr-2">{domain.price} CHONK 9000</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-muted-foreground hover:text-red-500"
                                  onClick={() => removeFromCart(domain.domain)}
                                >
                                  &times;
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex-col items-start">
                      <div className="w-full flex justify-between font-medium text-lg mb-4">
                        <span>Total:</span>
                        <span>{cartTotal} CHONK 9000</span>
                      </div>
                      
                      {!isConnected ? (
                        <Button 
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium" 
                          onClick={(e) => {
                            e.preventDefault();
                            connectWallet('phantom', 'solana');
                          }}
                        >
                          <ShieldCheck className="mr-2 h-5 w-5" />
                          Connect Wallet
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium" 
                          disabled={cart.length === 0}
                          onClick={proceedToCheckout}
                        >
                          <CreditCard className="mr-2 h-5 w-5" />
                          Proceed to Checkout
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}
            
            {checkoutStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Checkout</CardTitle>
                  <CardDescription>
                    Complete your domain registration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Domains to Register</h3>
                      <div className="border rounded-lg divide-y">
                        {cart.map((domain) => (
                          <div key={domain.domain} className="flex justify-between items-center p-3">
                            <span>{domain.domain}{DOT_SOL}</span>
                            <span>{domain.price} CHONK 9000</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Payment Details</h3>
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span>Wallet</span>
                          <code className="text-xs bg-muted p-1 rounded">
                            {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
                          </code>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Payment Token</span>
                          <span>CHONK 9000</span>
                        </div>
                        <div className="flex justify-between items-center font-medium">
                          <span>Total Amount</span>
                          <span>{cartTotal} CHONK 9000</span>
                        </div>
                      </div>
                    </div>
                    
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        By registering domains, you agree to the Solana Name Service terms and conditions.
                        Domain registrations are non-refundable.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCheckoutStep(1)}
                    className="px-6 font-medium"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Cart
                  </Button>
                  <Button 
                    onClick={processPayment} 
                    disabled={isProcessing}
                    className="px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Complete Purchase
                      </>  
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {checkoutStep === 3 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center mb-2">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <CardTitle className="text-center">Registration Complete!</CardTitle>
                  <CardDescription className="text-center">
                    Your domains have been successfully registered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border rounded-lg divide-y">
                      {cart.map((domain) => (
                        <div key={domain.domain} className="p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{domain.domain}{DOT_SOL}</span>
                            <Badge>Registered</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Valid for {SNS_PRICES[domain.duration as keyof typeof SNS_PRICES].label} until {new Date(Date.now() + (365 * 24 * 60 * 60 * 1000 * (domain.duration === '1year' ? 1 : domain.duration === '2year' ? 2 : 5))).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertTitle>What's Next?</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Your domains are now available for use with your wallet</li>
                          <li>You can set up DNS records for web hosting</li>
                          <li>Manage subdomains and other settings in the Manage Domains tab</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium" 
                    onClick={resetCheckout}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Register More Domains
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Your Domains</CardTitle>
                <CardDescription>
                  View and manage your registered .sol domains
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                {!isConnected ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Connect your wallet to view your domains</p>
                    <Button 
                      onClick={(e) => {
                        e.preventDefault();
                        connectWallet('phantom', 'solana');
                      }}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium px-6"
                    >
                      <ShieldCheck className="mr-2 h-5 w-5" />
                      Connect Wallet
                    </Button>
                  </div>
                ) : cart.length > 0 && paymentComplete ? (
                  <div className="space-y-4">
                    {cart.map((domain) => (
                      <Card key={domain.domain}>
                        <CardHeader>
                          <CardTitle>{domain.domain}{DOT_SOL}</CardTitle>
                          <CardDescription>
                            Registered on {new Date().toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-1">Status</h4>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Active
                              </Badge>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Expiration</h4>
                              <p className="text-sm">
                                {new Date(Date.now() + (365 * 24 * 60 * 60 * 1000 * (domain.duration === '1year' ? 1 : domain.duration === '2year' ? 2 : 5))).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Owner</h4>
                              <p className="text-sm">
                                {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Resolver</h4>
                              <p className="text-sm">
                                Default SNS Resolver
                              </p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <div className="w-full flex justify-between gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              disabled
                              className="flex-1 border-gray-300 hover:bg-gray-100"
                            >
                              <Search className="mr-1 h-4 w-4" />
                              Manage Records
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              disabled
                              className="flex-1 border-gray-300 hover:bg-gray-100"
                            >
                              <ArrowLeft className="mr-1 h-4 w-4" />
                              Transfer
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                            >
                              <CreditCard className="mr-1 h-4 w-4" />
                              Renew
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">No domains found</p>
                    <p className="text-sm text-muted-foreground mb-4">You don't have any registered .sol domains yet</p>
                    <Button 
                      onClick={() => {
                        setCheckoutStep(1);
                        const registerTab = document.querySelector('[data-state="inactive"][value="register"]');
                        if (registerTab) {
                          (registerTab as HTMLElement).click();
                        }
                      }}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium px-6"
                    >
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Register Your First Domain
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">What is Solana Name Service?</h3>
                    <p className="text-muted-foreground">
                      Solana Name Service (SNS) is a distributed, open, and extensible naming system using the Solana blockchain.
                      SNS allows you to register human-readable domain names (e.g., "yourdomain.sol") that can be mapped to Solana wallet addresses and other data.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">What can I do with a .sol domain?</h3>
                    <p className="text-muted-foreground">
                      With a .sol domain, you can:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                      <li>Replace your complex wallet address with a human-readable name</li>
                      <li>Receive payments and NFTs using your domain name</li>
                      <li>Set up a decentralized website</li>
                      <li>Create subdomains for different purposes</li>
                      <li>Integrate with other Solana applications</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">How long does registration last?</h3>
                    <p className="text-muted-foreground">
                      Domain registrations are available for 1, 2, or 5 years. You can renew your domain before it expires to maintain ownership.
                      After expiration, domains enter a grace period before being released for public registration.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">How much does it cost?</h3>
                    <p className="text-muted-foreground">
                      Registration costs vary based on the registration period. Prices are set in CHONK 9000 tokens:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                      <li>1 Year: 20 CHONK 9000</li>
                      <li>2 Years: 36 CHONK 9000 (10% discount)</li>
                      <li>5 Years: 75 CHONK 9000 (25% discount)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Can I transfer my domain?</h3>
                    <p className="text-muted-foreground">
                      Yes, .sol domains can be transferred to other wallet addresses. Transfers are executed as NFT transfers on the Solana blockchain.
                      You can transfer domains directly from the Manage Domains section after registration.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SolanaNameService;
