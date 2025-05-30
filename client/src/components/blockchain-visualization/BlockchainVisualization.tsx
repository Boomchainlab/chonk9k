import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, MinusCircle, Settings2, RefreshCw, Lock, Network, Link as LinkIcon, Blocks, Binary } from 'lucide-react';
import Block, { BlockData, Transaction as TransactionType } from './Block';
import Transaction from './Transaction';
import HashVisualization from './HashVisualization';

// A simple SHA-256 implementation for client-side hashing
const sha256 = async (message: string): Promise<string> => {
  // Use the Web Crypto API for hashing
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Function to calculate a block hash
const calculateBlockHash = async (block: Omit<BlockData, 'hash'>): Promise<string> => {
  const blockString = JSON.stringify({
    index: block.index,
    timestamp: block.timestamp,
    transactions: block.transactions,
    nonce: block.nonce,
    previousHash: block.previousHash
  });
  return await sha256(blockString);
};

// Generate a random hash
const randomHash = () => {
  const characters = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return hash;
};

// Generate an address
const randomAddress = (short: boolean = false) => {
  const length = short ? 16 : 40;
  const characters = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < length; i++) {
    address += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return address;
};

// Generate a random wallet
const generateWallet = () => {
  return {
    address: randomAddress(),
    privateKey: randomHash().slice(0, 64),
    balance: Math.floor(Math.random() * 1000) / 10
  };
};

// Generate a random transaction
const generateTransaction = (wallets?: { address: string }[]): TransactionType => {
  let fromWallet, toWallet;
  
  if (wallets && wallets.length >= 2) {
    // Pick two different wallets if available
    const fromIndex = Math.floor(Math.random() * wallets.length);
    let toIndex;
    do {
      toIndex = Math.floor(Math.random() * wallets.length);
    } while (toIndex === fromIndex);
    
    fromWallet = wallets[fromIndex].address;
    toWallet = wallets[toIndex].address;
  } else {
    // Generate random addresses
    fromWallet = randomAddress();
    toWallet = randomAddress();
  }
  
  return {
    id: randomHash().slice(0, 16),
    from: fromWallet,
    to: toWallet,
    amount: Math.floor(Math.random() * 100) / 10,
    timestamp: Date.now() - Math.floor(Math.random() * 86400000), // Random time in the last 24 hours
    signature: Math.random() > 0.2 ? randomHash().slice(0, 128) : undefined // 80% chance to have a signature
  };
};

// Generate example data for initial display
const generateInitialBlockchain = (numBlocks: number = 4): BlockData[] => {
  const chain: BlockData[] = [];
  
  // Create Genesis block
  const genesisBlock: BlockData = {
    index: 0,
    timestamp: Date.now() - 86400000 * 3, // 3 days ago
    transactions: [],
    nonce: 0,
    previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
    hash: "000a4ceb35bd5d4c49bee0dc0e6ab1d2c8b6c8719975c5c37e4be978ce76d08f",
    difficulty: 3,
    status: 'valid'
  };
  chain.push(genesisBlock);
  
  // Create subsequent blocks
  for (let i = 1; i < numBlocks; i++) {
    const numTransactions = Math.floor(Math.random() * 3) + 1; // 1 to 3 transactions
    const transactions: TransactionType[] = [];
    
    for (let j = 0; j < numTransactions; j++) {
      transactions.push(generateTransaction());
    }
    
    const block: BlockData = {
      index: i,
      timestamp: Date.now() - 86400000 * (3 - i), // Progressively more recent
      transactions,
      nonce: Math.floor(Math.random() * 10000),
      previousHash: chain[i - 1].hash,
      hash: randomHash(),
      difficulty: 3,
      status: 'valid'
    };
    
    chain.push(block);
  }
  
  return chain;
};

interface BlockchainVisualizationProps {
  className?: string;
}

const BlockchainVisualization: React.FC<BlockchainVisualizationProps> = ({ className = '' }) => {
  const [blockchain, setBlockchain] = useState<BlockData[]>(generateInitialBlockchain());
  const [pendingTransactions, setPendingTransactions] = useState<TransactionType[]>([]);
  const [wallets, setWallets] = useState<Array<{address: string, privateKey: string, balance: number}>>([]);
  const [selectedBlock, setSelectedBlock] = useState<BlockData | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);
  const [miningBlock, setMiningBlock] = useState<number | null>(null);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [fromWallet, setFromWallet] = useState<string>('');
  const [toWallet, setToWallet] = useState<string>('');
  
  const { toast } = useToast();
  
  // Generate wallets on initial load
  useEffect(() => {
    const initialWallets = [];
    for (let i = 0; i < 3; i++) {
      initialWallets.push(generateWallet());
    }
    setWallets(initialWallets);
    
    // Generate some pending transactions
    const initialPending = [];
    for (let i = 0; i < 2; i++) {
      initialPending.push(generateTransaction(initialWallets));
    }
    setPendingTransactions(initialPending);
  }, []);
  
  // Function to verify the entire blockchain
  const verifyBlockchain = useCallback(async () => {
    let isValid = true;
    let newChain = [...blockchain];
    
    for (let i = 1; i < newChain.length; i++) {
      // 1. Verify the previous hash links properly
      if (newChain[i].previousHash !== newChain[i-1].hash) {
        isValid = false;
        newChain[i] = {
          ...newChain[i],
          status: 'invalid'
        };
        continue;
      }
      
      // 2. Verify each block's hash matches its contents
      const blockWithoutHash = { ...newChain[i] };
      delete (blockWithoutHash as any).hash;
      delete (blockWithoutHash as any).status;
      
      const calculatedHash = await calculateBlockHash(blockWithoutHash);
      const hashValid = calculatedHash === newChain[i].hash;
      
      // 3. Verify hash meets difficulty target
      const difficultyValid = newChain[i].hash.startsWith('0'.repeat(newChain[i].difficulty || 2));
      
      if (!hashValid || !difficultyValid) {
        isValid = false;
        newChain[i] = {
          ...newChain[i],
          status: 'invalid'
        };
      } else {
        newChain[i] = {
          ...newChain[i],
          status: 'valid'
        };
      }
    }
    
    setBlockchain(newChain);
    return isValid;
  }, [blockchain]);
  
  // Function to add a transaction
  const addTransaction = () => {
    if (!transactionAmount || !fromWallet || !toWallet) {
      toast({
        title: "Invalid Transaction",
        description: "Please fill in all transaction details",
        variant: "destructive",
      });
      return;
    }
    
    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount",
        variant: "destructive",
      });
      return;
    }
    
    // Create new transaction
    const newTransaction: TransactionType = {
      id: randomHash().slice(0, 16),
      from: fromWallet,
      to: toWallet,
      amount: amount,
      timestamp: Date.now(),
      signature: randomHash().slice(0, 128) // Simulated signature
    };
    
    setPendingTransactions([...pendingTransactions, newTransaction]);
    setShowTransactionDialog(false);
    
    toast({
      title: "Transaction Added",
      description: "Your transaction has been added to the pending pool",
      variant: "success",
    });
    
    // Reset form
    setTransactionAmount('');
  };
  
  // Function to start mining a new block
  const mineBlock = async () => {
    if (pendingTransactions.length === 0) {
      toast({
        title: "No Transactions",
        description: "There are no pending transactions to mine",
        variant: "default",
      });
      return;
    }
    
    const lastBlock = blockchain[blockchain.length - 1];
    const newBlockIndex = lastBlock.index + 1;
    
    // Create a new block (initially without a valid hash)
    const newBlock: BlockData = {
      index: newBlockIndex,
      timestamp: Date.now(),
      transactions: [...pendingTransactions],
      nonce: 0,
      previousHash: lastBlock.hash,
      hash: '', // To be calculated
      difficulty: 3,
      status: 'mining',
      miner: wallets[0]?.address || randomAddress()
    };
    
    // Add the mining block to the chain
    setBlockchain([...blockchain, newBlock]);
    setMiningBlock(newBlockIndex);
    setPendingTransactions([]);
    
    toast({
      title: "Mining Started",
      description: "The mining process has been initiated for a new block",
      variant: "default",
    });
    
    // Simulate mining process
    let nonce = 0;
    let validHash = false;
    let hash = '';
    
    while (!validHash && nonce < 1000) { // Limiting to 1000 iterations for simulation
      nonce++;
      
      // Try a new hash with the current nonce
      const blockToHash = {
        ...newBlock,
        nonce: nonce
      };
      
      hash = await calculateBlockHash(blockToHash);
      validHash = hash.startsWith('0'.repeat(newBlock.difficulty || 2));
      
      // Update every few iterations for visualization
      if (nonce % 10 === 0 || validHash) {
        setBlockchain(currentChain => {
          const updatedChain = [...currentChain];
          const blockIndex = updatedChain.findIndex(b => b.index === newBlockIndex);
          
          if (blockIndex !== -1) {
            updatedChain[blockIndex] = {
              ...updatedChain[blockIndex],
              nonce,
              hash: hash,
              status: validHash ? 'valid' : 'mining'
            };
          }
          
          return updatedChain;
        });
        
        // Small delay to visualize mining process
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Finalize the mining process
    setMiningBlock(null);
    
    if (validHash) {
      toast({
        title: "Block Mined Successfully",
        description: `Found a valid hash after ${nonce} attempts`,
        variant: "success",
      });
    } else {
      toast({
        title: "Mining Limit Reached",
        description: "The simulation reached its iteration limit",
        variant: "default",
      });
    }
  };
  
  // Function to tamper with a block (for demonstrating immutability)
  const tamperWithBlock = async (blockIndex: number) => {
    if (blockIndex < 0 || blockIndex >= blockchain.length) return;
    
    // Clone the blockchain to avoid state mutation issues
    const newChain = [...blockchain];
    const block = { ...newChain[blockIndex] };
    
    // Modify a transaction (if any) or add one
    if (block.transactions.length > 0) {
      const txIndex = Math.floor(Math.random() * block.transactions.length);
      block.transactions = [...block.transactions];
      block.transactions[txIndex] = {
        ...block.transactions[txIndex],
        amount: block.transactions[txIndex].amount + 100 // Tamper by adding 100 coins
      };
    } else {
      block.transactions = [generateTransaction()];
    }
    
    // Recalculate block hash (won't be valid anymore)
    const newHash = await calculateBlockHash(block);
    block.hash = newHash;
    newChain[blockIndex] = block;
    
    setBlockchain(newChain);
    
    toast({
      title: "Block Tampered",
      description: "You've tampered with block data. The blockchain will now be invalid.",
      variant: "destructive",
    });
    
    // Verify the blockchain to show the invalid blocks
    setTimeout(verifyBlockchain, 500);
  };
  
  // Function to view block details
  const viewBlockDetails = (block: BlockData) => {
    setSelectedBlock(block);
  };
  
  // Function to view transaction details
  const viewTransactionDetails = (tx: TransactionType) => {
    setSelectedTransaction(tx);
  };
  
  return (
    <div className={cn("space-y-6", className)}>
      <Tabs defaultValue="blockchain" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full bg-black/30 border border-[#ff00ff]/20">
          <TabsTrigger value="blockchain" className="flex items-center">
            <Blocks className="mr-2 h-4 w-4" /> Blockchain
          </TabsTrigger>
          <TabsTrigger value="hash" className="flex items-center">
            <Binary className="mr-2 h-4 w-4" /> Hash Demo
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center">
            <Lock className="mr-2 h-4 w-4" /> Wallets
          </TabsTrigger>
        </TabsList>
        
        {/* Blockchain Tab */}
        <TabsContent value="blockchain" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                Interactive Blockchain
              </h2>
              <p className="text-gray-400 text-sm">
                Explore how blockchain technology works with this interactive demo
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => verifyBlockchain()}
                className="text-sm bg-black/30 border-[#00e0ff]/30 hover:bg-black/50 hover:text-[#00e0ff]"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Verify Chain
              </Button>
              <Button 
                onClick={() => setShowTransactionDialog(true)}
                className="text-sm bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] hover:opacity-90"
              >
                <Plus className="mr-2 h-4 w-4" /> New Transaction
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="col-span-full lg:col-span-3 bg-black/60 border-[#00e0ff]/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <LinkIcon className="mr-2 h-4 w-4 text-[#00e0ff]" /> 
                  Blockchain Explorer
                </CardTitle>
                <CardDescription>
                  Chain length: {blockchain.length} blocks
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Visual blockchain */}
                  <div className="space-y-4">
                    {/* Genesis block */}
                    <div className="flex items-stretch">
                      <Block 
                        data={blockchain[0]} 
                        isGenesis 
                        onClick={() => viewBlockDetails(blockchain[0])}
                        highlighted={selectedBlock?.index === 0}
                      />
                    </div>
                    
                    {/* Rest of the chain */}
                    {blockchain.slice(1).map((block, idx) => (
                      <div key={block.index} className="flex items-stretch">
                        <div className="flex flex-col items-center mr-2">
                          <div className="h-full w-0.5 bg-gradient-to-b from-[#ff00ff]/50 to-[#00e0ff]/50"></div>
                        </div>
                        <Block 
                          data={block} 
                          onClick={() => viewBlockDetails(block)}
                          onTransactionClick={viewTransactionDetails}
                          highlighted={selectedBlock?.index === block.index}
                          expanded={selectedBlock?.index === block.index}
                          animateEntry={miningBlock === block.index}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              {/* Pending transactions */}
              <Card className="bg-black/60 border-[#00e0ff]/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center text-[#00e0ff]">
                    <Network className="mr-2 h-4 w-4" /> 
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                      Mempool
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Pending transactions: {pendingTransactions.length}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {pendingTransactions.length > 0 ? (
                      <>
                        {pendingTransactions.map(tx => (
                          <Transaction 
                            key={tx.id} 
                            data={tx} 
                            status="pending"
                            onClick={() => viewTransactionDetails(tx)}
                            highlighted={selectedTransaction?.id === tx.id}
                          />
                        ))}
                        
                        <Button 
                          onClick={mineBlock} 
                          disabled={miningBlock !== null}
                          className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:opacity-90 text-white"
                        >
                          {miningBlock !== null ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Mining...
                            </>
                          ) : (
                            <>
                              <Settings2 className="mr-2 h-4 w-4 animate-pulse" />
                              Mine Block
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        <Network className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No pending transactions</p>
                        <p className="text-xs">Add a transaction to start mining</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Block detail view */}
              {selectedBlock && (
                <Card className="bg-black/60 border-[#00e0ff]/30">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        {selectedBlock.index === 0 ? "Genesis Block" : `Block #${selectedBlock.index}`}
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => tamperWithBlock(selectedBlock.index)}
                        className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20"
                      >
                        <MinusCircle className="mr-1 h-3 w-3" /> Tamper
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-gray-500">Timestamp:</div>
                        <div>{new Date(selectedBlock.timestamp).toLocaleString()}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-gray-500">Nonce:</div>
                        <div>{selectedBlock.nonce}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-gray-500">Difficulty:</div>
                        <div>{selectedBlock.difficulty || 2}</div>
                      </div>
                      
                      {selectedBlock.miner && (
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-gray-500">Miner:</div>
                          <div className="truncate">{selectedBlock.miner}</div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-gray-500">Transactions:</div>
                        <div>{selectedBlock.transactions.length}</div>
                      </div>
                    </div>
                    
                    {selectedBlock.transactions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 mt-2 mb-1">Transactions</h4>
                        <div className="max-h-48 overflow-auto space-y-2">
                          {selectedBlock.transactions.map(tx => (
                            <div 
                              key={tx.id} 
                              className="text-xs bg-black/30 p-2 rounded hover:bg-black/40 cursor-pointer"
                              onClick={() => viewTransactionDetails(tx)}
                            >
                              <div className="flex justify-between">
                                <span className="text-gray-500">ID: {tx.id.slice(0, 8)}...</span>
                                <span className="text-green-400">{tx.amount} CHONK</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Transaction detail view */}
              {selectedTransaction && (
                <Transaction 
                  data={selectedTransaction} 
                  status="confirmed" 
                  showSignature
                />
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Hash Demo Tab */}
        <TabsContent value="hash" className="space-y-4">
          <HashVisualization />
        </TabsContent>
        
        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-4">
          <Card className="bg-black/60 border-[#00e0ff]/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Lock className="mr-2 text-[#00e0ff]" /> 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                  Wallet Explorer
                </span>
              </CardTitle>
              <CardDescription>
                Demonstration of wallet addresses and private keys
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {wallets.map((wallet, index) => (
                  <Card key={index} className="bg-black/30 border-[#ff00ff]/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Wallet {index + 1}
                        <Badge className="ml-2 bg-emerald-600/20 text-emerald-400">
                          {wallet.balance.toFixed(2)} CHONK
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">Public Address (share with others)</Label>
                        <div className="text-xs font-mono bg-black/20 p-2 rounded mt-1 break-all">
                          {wallet.address}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-gray-500">Private Key (keep secret!)</Label>
                        <div className="relative">
                          <div className="text-xs font-mono bg-red-950/30 text-red-300 p-2 rounded mt-1 break-all filter blur-[2px] hover:blur-none transition-all">
                            {wallet.privateKey}
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Badge className="bg-red-500/30 text-red-400">Hover to reveal</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* New Transaction Dialog */}
      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent className="sm:max-w-[425px] bg-black/80 border border-[#00e0ff]/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
              Create New Transaction
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill in the details to create a new blockchain transaction
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from">From Wallet</Label>
              <Select value={fromWallet} onValueChange={setFromWallet}>
                <SelectTrigger className="border-[#ff00ff]/30 bg-black/50">
                  <SelectValue placeholder="Select sender wallet" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-[#ff00ff]/30">
                  {wallets.map((wallet, index) => (
                    <SelectItem key={index} value={wallet.address}>
                      Wallet {index + 1} ({wallet.balance.toFixed(2)} CHONK)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to">To Wallet</Label>
              <Select value={toWallet} onValueChange={setToWallet}>
                <SelectTrigger className="border-[#ff00ff]/30 bg-black/50">
                  <SelectValue placeholder="Select recipient wallet" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-[#ff00ff]/30">
                  {wallets.map((wallet, index) => (
                    <SelectItem key={index} value={wallet.address}>
                      Wallet {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (CHONK)</Label>
              <Input
                id="amount"
                type="number"
                min="0.1"
                step="0.1"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                placeholder="Enter amount"
                className="border-[#ff00ff]/30 bg-black/50"
              />
            </div>
            
            <Button 
              onClick={addTransaction} 
              className="w-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] hover:opacity-90"
            >
              Create Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlockchainVisualization;
export { BlockData, TransactionType };
