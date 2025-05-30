import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  CreditCard,
  ArrowRightLeft,
  User,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  MemoryStick,
  Package
} from 'lucide-react';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
  status: 'pending' | 'confirmed' | 'processing';
  timestamp: Date;
  confirmationTime?: Date;
  blockId?: number;
}

interface Block {
  id: number;
  transactions: Transaction[];
  timestamp: Date;
  miner: string;
}

interface Wallet {
  address: string;
  name: string;
  balance: number;
  color: string;
}

const wallets: Wallet[] = [
  { address: '0xf23fe8ab...', name: 'Alice', balance: 100, color: '#8b5cf6' },
  { address: '0x72ea9284...', name: 'Bob', balance: 80, color: '#ec4899' },
  { address: '0x387fa9d1...', name: 'Charlie', balance: 120, color: '#10b981' },
  { address: '0x49d87f63...', name: 'Miner 1', balance: 200, color: '#f59e0b' },
  { address: '0x9e31a8b2...', name: 'Miner 2', balance: 180, color: '#ef4444' },
];

const TransactionSimulation: React.FC = () => {
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [confirmedTransactions, setConfirmedTransactions] = useState<Transaction[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [newTransactionFrom, setNewTransactionFrom] = useState(wallets[0].address);
  const [newTransactionTo, setNewTransactionTo] = useState(wallets[1].address);
  const [newTransactionAmount, setNewTransactionAmount] = useState(10);
  const [newTransactionFee, setNewTransactionFee] = useState(1);
  const [isMining, setIsMining] = useState(false);
  const [autoMine, setAutoMine] = useState(false);
  const [miningInterval, setMiningInterval] = useState<number | null>(null);
  const [simSpeed, setSimSpeed] = useState(5); // 1 to 10 scale

  // Create a new transaction
  const createTransaction = () => {
    const transaction: Transaction = {
      id: Math.random().toString(36).substring(2, 15),
      from: newTransactionFrom,
      to: newTransactionTo,
      amount: newTransactionAmount,
      fee: newTransactionFee,
      status: 'pending',
      timestamp: new Date(),
    };
    setPendingTransactions([...pendingTransactions, transaction]);
  };

  // Mine a new block
  const mineBlock = () => {
    if (pendingTransactions.length === 0 || isMining) return;
    
    setIsMining(true);
    
    // Sort transactions by fee (highest first) to simulate miner incentive
    const sortedTransactions = [...pendingTransactions].sort((a, b) => b.fee - a.fee);
    
    // Take up to 3 transactions for the block
    const transactionsToMine = sortedTransactions.slice(0, 3);
    const remainingTransactions = sortedTransactions.slice(3);
    
    // Update status to processing
    transactionsToMine.forEach(tx => {
      tx.status = 'processing';
    });
    
    setPendingTransactions([...remainingTransactions, ...transactionsToMine.map(tx => ({...tx}))]);    
    
    // Simulate mining delay based on simulation speed
    setTimeout(() => {
      const miner = Math.random() > 0.5 ? wallets[3] : wallets[4];
      const newBlock: Block = {
        id: blocks.length + 1,
        transactions: transactionsToMine.map(tx => ({
          ...tx,
          status: 'confirmed',
          confirmationTime: new Date(),
          blockId: blocks.length + 1
        })),
        timestamp: new Date(),
        miner: miner.address
      };
      
      setBlocks([...blocks, newBlock]);
      setConfirmedTransactions([...confirmedTransactions, ...newBlock.transactions]);
      
      // Remove the mined transactions from pending
      const updatedPending = pendingTransactions.filter(
        tx => !transactionsToMine.some(minedTx => minedTx.id === tx.id)
      );
      setPendingTransactions(updatedPending);
      
      setIsMining(false);
    }, 11000 / simSpeed); // Adjust timing based on simulation speed
  };

  // Toggle auto-mining
  const toggleAutoMine = () => {
    if (autoMine) {
      // Stop auto-mining
      if (miningInterval) {
        clearInterval(miningInterval);
        setMiningInterval(null);
      }
    } else {
      // Start auto-mining if there are pending transactions
      const interval = window.setInterval(() => {
        if (!isMining && pendingTransactions.length > 0) {
          mineBlock();
        }
      }, 5000) as unknown as number;
      
      setMiningInterval(interval);
    }
    
    setAutoMine(!autoMine);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (miningInterval) {
        clearInterval(miningInterval);
      }
    };
  }, [miningInterval]);

  // Get wallet by address
  const getWallet = (address: string) => {
    return wallets.find(w => w.address === address) || wallets[0];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column - Create transaction */}
        <Card className="col-span-1">
          <CardContent className="pt-6">
            <div className="space-y-5">
              <h3 className="font-medium flex items-center gap-1.5">
                <ArrowRightLeft className="h-4 w-4" /> Create Transaction
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">From Wallet:</label>
                  <Select value={newTransactionFrom} onValueChange={setNewTransactionFrom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sender" />
                    </SelectTrigger>
                    <SelectContent>
                      {wallets.map(wallet => (
                        <SelectItem key={wallet.address} value={wallet.address}>
                          <div className="flex items-center">
                            <div 
                              className="h-3 w-3 rounded-full mr-2" 
                              style={{ backgroundColor: wallet.color }}
                            />
                            {wallet.name} ({wallet.balance} ETH)
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">To Wallet:</label>
                  <Select value={newTransactionTo} onValueChange={setNewTransactionTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {wallets
                        .filter(wallet => wallet.address !== newTransactionFrom)
                        .map(wallet => (
                          <SelectItem key={wallet.address} value={wallet.address}>
                            <div className="flex items-center">
                              <div 
                                className="h-3 w-3 rounded-full mr-2" 
                                style={{ backgroundColor: wallet.color }}
                              />
                              {wallet.name} ({wallet.balance} ETH)
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-sm text-muted-foreground">Amount (ETH):</label>
                    <span className="text-sm font-medium">{newTransactionAmount} ETH</span>
                  </div>
                  <Slider 
                    value={[newTransactionAmount]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={([value]) => setNewTransactionAmount(value)} 
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-sm text-muted-foreground">Transaction Fee (ETH):</label>
                    <span className="text-sm font-medium">{newTransactionFee} ETH</span>
                  </div>
                  <Slider 
                    value={[newTransactionFee]}
                    min={0.1}
                    max={5}
                    step={0.1}
                    onValueChange={([value]) => setNewTransactionFee(value)} 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Higher fees incentivize miners to prioritize your transaction.
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={createTransaction}
                className="w-full"
              >
                Sign & Submit Transaction
              </Button>
              
              <div className="rounded-md bg-muted py-2 px-3">
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium text-foreground mb-1">Transaction Preview:</div>
                  <div>From: {getWallet(newTransactionFrom).name}</div>
                  <div>To: {getWallet(newTransactionTo).name}</div>
                  <div>Amount: {newTransactionAmount} ETH</div>
                  <div>Fee: {newTransactionFee} ETH</div>
                  <div>
                    Total: {newTransactionAmount + newTransactionFee} ETH
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Middle column - Memory Pool (Mempool) */}
        <Card className="col-span-1">
          <CardContent className="pt-6">
            <div className="space-y-5">
              <h3 className="font-medium flex items-center gap-1.5">
                <MemoryStick className="h-4 w-4" /> Memory Pool (Mempool)
                <Badge variant="outline" className="ml-auto">
                  {pendingTransactions.length} Pending
                </Badge>
              </h3>
              
              <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1">
                <AnimatePresence>
                  {pendingTransactions.length === 0 ? (
                    <div className="text-sm text-center text-muted-foreground py-8">
                      No pending transactions
                    </div>
                  ) : (
                    pendingTransactions.map(tx => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card>
                          <CardContent className="p-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-muted rounded">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                              </div>
                              
                              <div className="flex-1 overflow-hidden min-w-0">
                                <div className="flex items-center">
                                  <div 
                                    className="h-2 w-2 rounded-full mr-1" 
                                    style={{ backgroundColor: getWallet(tx.from).color }}
                                  />
                                  <div className="text-xs truncate">{getWallet(tx.from).name}</div>
                                  <div className="mx-1 text-xs">→</div>
                                  <div 
                                    className="h-2 w-2 rounded-full mr-1" 
                                    style={{ backgroundColor: getWallet(tx.to).color }}
                                  />
                                  <div className="text-xs truncate">{getWallet(tx.to).name}</div>
                                </div>
                                
                                <div className="flex items-center justify-between mt-1">
                                  <div className="text-xs font-medium">{tx.amount} ETH</div>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-[10px] py-0 h-4 px-1 ${tx.status === 'processing' ? 'animate-pulse bg-yellow-100 dark:bg-yellow-900' : ''}`}
                                  >
                                    {tx.status === 'processing' ? 'Processing' : 'Pending'}
                                  </Badge>
                                </div>
                                
                                <div className="text-[10px] text-muted-foreground mt-0.5 flex justify-between">
                                  <div>Fee: {tx.fee} ETH</div>
                                  <div className="flex items-center">
                                    <Clock className="h-2.5 w-2.5 mr-0.5" />
                                    {Math.floor((new Date().getTime() - tx.timestamp.getTime()) / 1000)}s
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={mineBlock}
                  disabled={pendingTransactions.length === 0 || isMining}
                >
                  {isMining ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg> 
                      Mining Block...
                    </>
                  ) : 'Mine Block'}
                </Button>
                
                <Button 
                  variant={autoMine ? "destructive" : "outline"}
                  onClick={toggleAutoMine}
                >
                  {autoMine ? 'Stop Auto-mining' : 'Auto-mine'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Right column - Blockchain */}
        <Card className="col-span-1">
          <CardContent className="pt-6">
            <div className="space-y-5">
              <h3 className="font-medium flex items-center gap-1.5">
                <Package className="h-4 w-4" /> Blockchain
                <Badge variant="outline" className="ml-auto">
                  {blocks.length} Blocks
                </Badge>
              </h3>
              
              <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1">
                <AnimatePresence>
                  {blocks.length === 0 ? (
                    <div className="text-sm text-center text-muted-foreground py-8">
                      No blocks mined yet
                    </div>
                  ) : (
                    [...blocks].reverse().map(block => (
                      <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card>
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div className="font-medium text-sm">Block #{block.id}</div>
                              <div className="text-xs text-muted-foreground">
                                {block.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                            
                            <div className="mt-2 text-xs text-muted-foreground">
                              Mined by: {getWallet(block.miner).name}
                            </div>
                            
                            <div className="mt-3 space-y-2">
                              {block.transactions.map(tx => (
                                <div 
                                  key={tx.id} 
                                  className="flex items-center justify-between bg-muted/50 p-1.5 rounded-sm text-xs"
                                >
                                  <div className="flex items-center">
                                    <div 
                                      className="h-2 w-2 rounded-full mr-1" 
                                      style={{ backgroundColor: getWallet(tx.from).color }}
                                    />
                                    <span className="mr-1">{getWallet(tx.from).name}</span>
                                    <span className="mr-1">→</span>
                                    <div 
                                      className="h-2 w-2 rounded-full mr-1" 
                                      style={{ backgroundColor: getWallet(tx.to).color }}
                                    />
                                    <span>{getWallet(tx.to).name}</span>
                                  </div>
                                  <div className="font-medium">{tx.amount} ETH</div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-2 text-[10px] text-muted-foreground flex justify-between">
                              <div>Transactions: {block.transactions.length}</div>
                              <div>
                                Fees: {block.transactions.reduce((acc, tx) => acc + tx.fee, 0)} ETH
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-sm text-muted-foreground space-y-1 mt-2">
        <div className="font-medium text-foreground">How Transactions Work:</div>
        <div className="text-xs">
          1. Transactions are signed and submitted to the network
        </div>
        <div className="text-xs">
          2. They enter the memory pool where they await processing
        </div>
        <div className="text-xs">
          3. Miners prioritize transactions with higher fees
        </div>
        <div className="text-xs">
          4. Once included in a block, transactions are confirmed and become permanent
        </div>
      </div>
    </div>
  );
};

export default TransactionSimulation;