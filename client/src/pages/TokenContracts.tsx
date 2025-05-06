import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { CHONK9K_TOKEN_ADDRESS } from '@/lib/solanaConnection';

// Define common contract properties
interface BaseContractInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  network: string;
  explorer: string;
  totalSupply: string;
  type: string;
  deployDate: string;
  primaryToken: boolean;
}

// Solana specific contract properties
interface SolanaContractInfo extends BaseContractInfo {
  raydium: string;
}

// EVM specific contract properties
interface EvmContractInfo extends BaseContractInfo {
  dex: string;
}

// Define the contract map with proper types
type ContractMap = {
  solana: SolanaContractInfo;
  base: EvmContractInfo;
  ethereum: EvmContractInfo;
};

// Contract Addresses
const TOKEN_CONTRACTS: ContractMap = {
  solana: {
    address: CHONK9K_TOKEN_ADDRESS, // '51ey1T4UCFwb8poVBwyiLwwi1KdNTrZ8rSg7kBRmqray'
    name: 'CHONK9K',
    symbol: 'CHONK9K',
    decimals: 9,
    network: 'Solana Mainnet',
    explorer: `https://solscan.io/token/${CHONK9K_TOKEN_ADDRESS}`,
    raydium: `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${CHONK9K_TOKEN_ADDRESS}`,
    totalSupply: '1,000,000,000',
    type: 'SPL Token',
    deployDate: 'May 1, 2025',
    primaryToken: true
  },
  base: {
    address: '0x9c0000b7D00000cH0000nK9000K90000b000se',
    name: 'CHONK9K',
    symbol: 'CHONK9K',
    decimals: 18,
    network: 'Base Chain',
    explorer: 'https://basescan.org/token/0x9c0000b7D00000cH0000nK9000K90000b000se',
    dex: 'https://app.uniswap.org/#/swap?outputCurrency=0x9c0000b7D00000cH0000nK9000K90000b000se',
    totalSupply: '1,000,000,000',
    type: 'ERC-20 Token',
    deployDate: 'April 15, 2025',
    primaryToken: false
  },
  ethereum: {
    address: '0xc9000b7D00C40nK900090009000Ch0nKPu4p',
    name: 'CHONK9K',
    symbol: 'CHONK9K',
    decimals: 18,
    network: 'Ethereum Mainnet',
    explorer: 'https://etherscan.io/token/0xc9000b7D00C40nK900090009000Ch0nKPu4p',
    dex: 'https://app.uniswap.org/#/swap?outputCurrency=0xc9000b7D00C40nK900090009000Ch0nKPu4p',
    totalSupply: '1,000,000,000',
    type: 'ERC-20 Token',
    deployDate: 'March 30, 2025',
    primaryToken: false
  }
};

// Contract Card Component
interface ContractCardProps {
  chain: keyof ContractMap;
}

const ContractCard: React.FC<ContractCardProps> = ({ chain }) => {
  const contract = TOKEN_CONTRACTS[chain];
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Address Copied",
      description: "Token address copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine if it's a Solana contract or EVM contract
  const isSolanaContract = (chain === 'solana');
  const solanaContract = isSolanaContract ? contract as SolanaContractInfo : null;
  const evmContract = !isSolanaContract ? contract as EvmContractInfo : null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              {contract.name} on {contract.network}
              {contract.primaryToken && (
                <Badge className="ml-2 bg-gradient-to-r from-pink-500 to-purple-600">
                  Primary
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {contract.type} • {contract.deployDate}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">Contract Address</p>
          <div className="flex items-center">
            <code className="text-xs bg-muted p-2 rounded flex-1 overflow-x-auto">
              {contract.address}
            </code>
            <button 
              onClick={() => copyToClipboard(contract.address)}
              className="ml-2 text-primary hover:text-primary/80"
              title="Copy address"
            >
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            </button>
            <a 
              href={contract.explorer} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-primary hover:text-primary/80"
              title="View on explorer"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Symbol</p>
            <p>{contract.symbol}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Decimals</p>
            <p>{contract.decimals}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Total Supply</p>
          <p>{contract.totalSupply} {contract.symbol}</p>
        </div>
      </CardContent>
      <CardFooter>
        {isSolanaContract && solanaContract ? (
          <Button variant="outline" size="sm" asChild>
            <a 
              href={solanaContract.raydium}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <img 
                src="https://raydium.io/favicon.ico" 
                alt="Raydium" 
                className="h-4 w-4 mr-2" 
              />
              Trade on Raydium
            </a>
          </Button>
        ) : evmContract ? (
          <Button variant="outline" size="sm" asChild>
            <a 
              href={evmContract.dex}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M4.04883 2.11523C2.24883 2.11523 0.798828 3.56523 0.798828 5.36523C0.798828 7.16523 2.24883 8.61523 4.04883 8.61523C5.09883 8.61523 6.04883 8.11523 6.67383 7.36523C6.69883 7.33523 6.72383 7.31023 6.74883 7.28523C6.77383 7.31023 6.79883 7.33523 6.82383 7.36523C7.44883 8.11523 8.39883 8.61523 9.44883 8.61523C11.2488 8.61523 12.6988 7.16523 12.6988 5.36523C12.6988 3.56523 11.2488 2.11523 9.44883 2.11523C8.39883 2.11523 7.44883 2.61523 6.82383 3.36523C6.79883 3.39523 6.77383 3.42023 6.74883 3.44523C6.72383 3.42023 6.69883 3.39523 6.67383 3.36523C6.04883 2.61523 5.09883 2.11523 4.04883 2.11523ZM4.04883 7.61523C2.79883 7.61523 1.79883 6.61523 1.79883 5.36523C1.79883 4.11523 2.79883 3.11523 4.04883 3.11523C4.87383 3.11523 5.62383 3.53523 6.02383 4.18523C5.69883 4.63523 5.49883 5.18523 5.44883 5.78523H6.44883C6.52383 5.36523 6.69883 4.98523 6.94883 4.68523C7.07383 4.88523 7.17383 5.11523 7.24883 5.36523H8.24883C8.12383 4.81523 7.87383 4.31523 7.54883 3.91523C7.54883 3.91523 7.54883 3.91523 7.52383 3.88523C7.92383 3.38523 8.62383 3.11523 9.44883 3.11523C10.6988 3.11523 11.6988 4.11523 11.6988 5.36523C11.6988 6.61523 10.6988 7.61523 9.44883 7.61523C8.62383 7.61523 7.87383 7.18523 7.47383 6.53523C7.79883 6.08523 7.99883 5.53523 8.04883 4.93523H7.04883C6.97383 5.36523 6.79883 5.73523 6.54883 6.03523C6.42383 5.83523 6.32383 5.61523 6.24883 5.36523H5.24883C5.37383 5.91523 5.62383 6.41523 5.94883 6.81523V6.83523C5.54883 7.33523 4.84883 7.61523 4.04883 7.61523Z" fill="currentColor"/>
                <path d="M4.04883 13.6152C3.29883 13.6152 2.54883 13.3652 1.92383 12.9152L2.54883 12.1152C3.04883 12.4652 3.52383 12.6152 4.04883 12.6152C4.57383 12.6152 5.04883 12.4652 5.54883 12.1152L6.17383 12.9152C5.54883 13.3652 4.79883 13.6152 4.04883 13.6152Z" fill="currentColor"/>
                <path d="M9.44883 13.6152C8.69883 13.6152 7.94883 13.3652 7.32383 12.9152L7.94883 12.1152C8.44883 12.4652 8.92383 12.6152 9.44883 12.6152C9.97383 12.6152 10.4488 12.4652 10.9488 12.1152L11.5738 12.9152C10.9488 13.3652 10.1988 13.6152 9.44883 13.6152Z" fill="currentColor"/>
              </svg>
              Trade on Uniswap
            </a>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};

const TokenContracts: React.FC = () => {
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
              CHONK9K Token Contracts
            </h1>
          </div>
          <p className="text-muted-foreground">
            CHONK9K is available on multiple blockchain networks. View contract details for each network below.
          </p>
        </div>

        <Tabs defaultValue="solana" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="solana">Solana</TabsTrigger>
            <TabsTrigger value="base">Base Chain</TabsTrigger>
            <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
          </TabsList>
          <TabsContent value="solana">
            <ContractCard chain="solana" />
          </TabsContent>
          <TabsContent value="base">
            <ContractCard chain="base" />
          </TabsContent>
          <TabsContent value="ethereum">
            <ContractCard chain="ethereum" />
          </TabsContent>
        </Tabs>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Understanding CHONK9K Multi-Chain Deployment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              CHONK9K has been deployed on multiple blockchain networks to maximize accessibility and provide options
              for different user preferences. Here's what you need to know:
            </p>
            
            <div className="space-y-1">
              <h3 className="font-medium">Solana Token (Primary)</h3>
              <p className="text-sm text-muted-foreground">
                The Solana implementation of CHONK9K is our primary token. It offers lower transaction fees and faster confirmation times.
                This is the recommended version for most users.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-1">
              <h3 className="font-medium">Base & Ethereum Tokens</h3>
              <p className="text-sm text-muted-foreground">
                The Base Chain and Ethereum implementations provide options for users who prefer EVM-compatible blockchains.
                These tokens have their own separate supplies and are not directly connected to the Solana token.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-1">
              <h3 className="font-medium">Important Notes</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Each blockchain's CHONK9K token exists independently</li>
                <li>Token prices may vary between chains due to different liquidity pools</li>
                <li>Always verify you're interacting with the correct contract address</li>
                <li>The Solana version is considered the primary token for the CHONK9K ecosystem</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Can I convert between the different chain versions?</h3>
              <p className="text-sm text-muted-foreground">
                Currently, there is no official bridge between the different CHONK9K tokens. Each exists as its own independent token on its respective blockchain.
                In the future, we may implement a cross-chain bridge solution.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-medium">Which version should I buy?</h3>
              <p className="text-sm text-muted-foreground">
                We recommend the Solana version as the primary CHONK9K token. It offers lower fees and faster transactions.
                However, if you already have assets on Base or Ethereum and prefer not to bridge to Solana, those versions are available as alternatives.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-medium">Are token economics different across chains?</h3>
              <p className="text-sm text-muted-foreground">
                Each version has the same total supply of 1 billion tokens. However, distribution, liquidity depth, and market behavior
                may vary between chains. Always do your own research before trading.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TokenContracts;
