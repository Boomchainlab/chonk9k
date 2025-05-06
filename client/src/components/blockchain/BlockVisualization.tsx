import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, AlertCircle, LockIcon, UnlockIcon, Link as LinkIcon, TriangleAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Block {
  id: number;
  timestamp: Date;
  data: string;
  previousHash: string;
  hash: string;
  nonce: number;
}

const BlockVisualization: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [newBlockData, setNewBlockData] = useState('');
  const [isCreatingBlock, setIsCreatingBlock] = useState(false);
  const [tamperedBlock, setTamperedBlock] = useState<number | null>(null);

  // Create genesis block on mount
  useEffect(() => {
    if (blocks.length === 0) {
      const genesisBlock: Block = {
        id: 0,
        timestamp: new Date(),
        data: 'Genesis Block',
        previousHash: '0000000000000000',
        hash: '000dc75a315c77a1f9c98fb6247d03dd18ac52632d7dc6a9920261d8109b37cf',
        nonce: 12345
      };
      setBlocks([genesisBlock]);
    }
  }, [blocks.length]);

  // Simple hash calculation (for demo purposes)
  const calculateHash = (block: Omit<Block, 'hash'>): string => {
    const blockString = block.id + block.timestamp.toISOString() + block.data + block.previousHash + block.nonce;
    // This is a simplified hash for demo purposes, not cryptographically secure
    let hash = 0;
    for (let i = 0; i < blockString.length; i++) {
      const char = blockString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  };

  // Add a new block to the chain
  const addBlock = () => {
    if (!newBlockData.trim()) return;
    
    setIsCreatingBlock(true);
    
    setTimeout(() => {
      const previousBlock = blocks[blocks.length - 1];
      const newBlock: Block = {
        id: previousBlock.id + 1,
        timestamp: new Date(),
        data: newBlockData,
        previousHash: previousBlock.hash,
        nonce: Math.floor(Math.random() * 1000000),
        hash: ''
      };
      
      // Calculate hash
      newBlock.hash = calculateHash(newBlock);
      
      setBlocks([...blocks, newBlock]);
      setNewBlockData('');
      setIsCreatingBlock(false);
    }, 1500); // Simulate mining delay
  };

  // Tamper with block data - for educational purposes
  const tamperWithBlock = (index: number, newData: string) => {
    if (index <= 0 || index >= blocks.length) return; // Don't tamper with genesis block
    
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      data: newData
    };
    
    // Recalculate hash for tampered block but NOT for subsequent blocks
    updatedBlocks[index].hash = calculateHash(updatedBlocks[index]);
    
    setBlocks(updatedBlocks);
    setTamperedBlock(index);
  };

  // Verify if the blockchain is valid
  const isBlockchainValid = (): boolean => {
    for (let i = 1; i < blocks.length; i++) {
      const currentBlock = blocks[i];
      const previousBlock = blocks[i - 1];
      
      // Check if hashes match
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
      
      // Check if current block's hash is correctly calculated
      if (calculateHash({
        id: currentBlock.id,
        timestamp: currentBlock.timestamp,
        data: currentBlock.data,
        previousHash: currentBlock.previousHash,
        nonce: currentBlock.nonce
      }) !== currentBlock.hash) {
        return false;
      }
    }
    return true;
  };

  // Fix the tampered block by recalculating hashes for it and all subsequent blocks
  const fixBlockchain = () => {
    const updatedBlocks = [...blocks];
    
    // Recalculate hashes from the tampered block onwards
    for (let i = tamperedBlock || 1; i < updatedBlocks.length; i++) {
      // Update previous hash link
      if (i > 0) {
        updatedBlocks[i].previousHash = updatedBlocks[i - 1].hash;
      }
      
      // Recalculate hash
      updatedBlocks[i].hash = calculateHash(updatedBlocks[i]);
    }
    
    setBlocks(updatedBlocks);
    setTamperedBlock(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant={isBlockchainValid() ? "outline" : "destructive"} className={`h-6 px-2 ${isBlockchainValid() ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : ''}`}>
            {isBlockchainValid() ? 'Blockchain Valid' : 'Blockchain Invalid'}
          </Badge>
          
          {tamperedBlock !== null && (
            <Button size="sm" variant="outline" onClick={fixBlockchain} className="flex items-center gap-1">
              <LinkIcon className="h-3 w-3" /> Fix Chain
            </Button>
          )}
          
          <div className="ml-auto text-xs text-muted-foreground flex items-center">
            <Info className="h-3 w-3 mr-1" /> 
            Try changing data in a block to see how it breaks the chain
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {blocks.map((block, index) => {
              const isValid = block.hash === calculateHash({
                id: block.id,
                timestamp: block.timestamp,
                data: block.data,
                previousHash: block.previousHash,
                nonce: block.nonce
              });

              const isPreviousHashValid = index === 0 || block.previousHash === blocks[index - 1].hash;

              return (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="col-span-1"
                >
                  <Card className={`overflow-hidden ${!isValid || !isPreviousHashValid ? 'border-red-400 dark:border-red-400' : ''}`}>
                    <CardContent className="p-0">
                      <div className="bg-accent/50 px-4 py-3 border-b flex justify-between items-center">
                        <div className="font-medium">Block #{block.id}</div>
                        <Badge variant={isValid && isPreviousHashValid ? "outline" : "destructive"} className="text-xs px-2 py-0 h-5">
                          {isValid && isPreviousHashValid ? (
                            <LockIcon className="h-3 w-3 mr-1" />
                          ) : (
                            <UnlockIcon className="h-3 w-3 mr-1" />
                          )}
                          {isValid && isPreviousHashValid ? 'Valid' : 'Invalid'}
                        </Badge>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <div className="text-xs space-y-1">
                          <div className="text-muted-foreground">Timestamp:</div>
                          <div className="font-mono text-xs truncate">
                            {block.timestamp.toISOString()}
                          </div>
                        </div>
                        
                        <div className="text-xs space-y-1">
                          <div className="text-muted-foreground">Data:</div>
                          <div className="relative">
                            {index > 0 ? (
                              <Input 
                                className="font-mono text-xs h-8"
                                value={block.data}
                                onChange={(e) => tamperWithBlock(index, e.target.value)}
                              />
                            ) : (
                              <div className="font-mono bg-muted px-3 py-1 rounded text-xs">
                                {block.data}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-xs space-y-1">
                          <div className="text-muted-foreground">Previous Hash:</div>
                          <div className={`font-mono text-xs truncate ${!isPreviousHashValid ? 'text-red-500' : ''}`}>
                            {block.previousHash}
                          </div>
                        </div>
                        
                        <div className="text-xs space-y-1">
                          <div className="text-muted-foreground">Hash:</div>
                          <div className={`font-mono text-xs truncate ${!isValid ? 'text-red-500' : ''}`}>
                            {block.hash}
                          </div>
                        </div>
                        
                        <div className="text-xs space-y-1">
                          <div className="text-muted-foreground">Nonce:</div>
                          <div className="font-mono text-xs">{block.nonce}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Input 
          className="flex-1" 
          placeholder="Enter data for the next block" 
          value={newBlockData} 
          onChange={(e) => setNewBlockData(e.target.value)}
          disabled={isCreatingBlock}
        />
        <Button 
          className="min-w-[120px] gap-1" 
          onClick={addBlock} 
          disabled={!newBlockData.trim() || isCreatingBlock}
        >
          {isCreatingBlock ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg> 
              Mining Block
            </>
          ) : 'Add Block'}
        </Button>
      </div>
      
      {tamperedBlock !== null && (
        <div className="bg-amber-100 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 p-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium">Chain integrity compromised</p>
            <p className="mt-1">You've changed data in Block #{tamperedBlock}, which broke its hash and the links to subsequent blocks. In a real blockchain, this tampering would be rejected by the network.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockVisualization;