import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Progress } from '@/components/ui/progress';
import { HardHat, Hammer, Pickaxe, Coins, Crown, ShieldCheck, Zap, Cpu, FlaskConical, Users, CheckCircle2, Clock } from 'lucide-react';

interface Node {
  id: number;
  name: string;
  type: 'miner' | 'validator';
  hashPower?: number; // For PoW
  stake?: number; // For PoS
  status: 'mining' | 'validating' | 'idle';
  selected: boolean;
  blocks: number;
}

interface Block {
  id: number;
  producer: number; // Node ID
  timestamp: Date;
}

const ConsensusDemo: React.FC = () => {
  const [consensusType, setConsensusType] = useState<'pow' | 'pos'>('pow');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [simulationSpeed, setSimulationSpeed] = useState(5); // 1-10 scale
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationInterval, setSimulationInterval] = useState<number | null>(null);
  const [blockTime, setBlockTime] = useState(0);
  const [totalHashPower, setTotalHashPower] = useState(0);
  const [totalStake, setTotalStake] = useState(0);
  
  // Initialize nodes for both consensus types
  useEffect(() => {
    const powNodes: Node[] = [
      { id: 1, name: 'Mining Pool A', type: 'miner', hashPower: 35, status: 'idle', selected: false, blocks: 0 },
      { id: 2, name: 'Mining Pool B', type: 'miner', hashPower: 25, status: 'idle', selected: false, blocks: 0 },
      { id: 3, name: 'Miner C', type: 'miner', hashPower: 15, status: 'idle', selected: false, blocks: 0 },
      { id: 4, name: 'Miner D', type: 'miner', hashPower: 10, status: 'idle', selected: false, blocks: 0 },
      { id: 5, name: 'Miner E', type: 'miner', hashPower: 8, status: 'idle', selected: false, blocks: 0 },
      { id: 6, name: 'Miner F', type: 'miner', hashPower: 7, status: 'idle', selected: false, blocks: 0 },
    ];
    
    const posNodes: Node[] = [
      { id: 1, name: 'Validator A', type: 'validator', stake: 30, status: 'idle', selected: false, blocks: 0 },
      { id: 2, name: 'Validator B', type: 'validator', stake: 25, status: 'idle', selected: false, blocks: 0 },
      { id: 3, name: 'Validator C', type: 'validator', stake: 20, status: 'idle', selected: false, blocks: 0 },
      { id: 4, name: 'Validator D', type: 'validator', stake: 15, status: 'idle', selected: false, blocks: 0 },
      { id: 5, name: 'Validator E', type: 'validator', stake: 7, status: 'idle', selected: false, blocks: 0 },
      { id: 6, name: 'Validator F', type: 'validator', stake: 3, status: 'idle', selected: false, blocks: 0 },
    ];
    
    if (consensusType === 'pow') {
      setNodes(powNodes);
      setTotalHashPower(powNodes.reduce((sum, node) => sum + (node.hashPower || 0), 0));
    } else {
      setNodes(posNodes);
      setTotalStake(posNodes.reduce((sum, node) => sum + (node.stake || 0), 0));
    }
    
    // Reset blocks when changing consensus type
    setBlocks([]);
    setBlockTime(0);
    
    // Stop any running simulation
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
      setIsSimulationRunning(false);
    }
  }, [consensusType]);
  
  // Simulate a block production based on consensus type
  const produceBlock = () => {
    let selectedNodeId: number | null = null;
    
    // Reset all nodes status
    let updatedNodes = nodes.map(node => ({
      ...node,
      status: 'idle' as 'idle' | 'mining' | 'validating',
      selected: false
    }));
    
    if (consensusType === 'pow') {
      // Set all miners to mining status
      updatedNodes = updatedNodes.map(node => ({
        ...node,
        status: 'mining'
      }));
      
      // Set all miners to mining status for animation
      setNodes(updatedNodes);
      
      // After a delay, select one miner based on hash power
      setTimeout(() => {
        // ProW: Probabilistically select a miner based on their hash power
        const random = Math.random() * totalHashPower;
        let cumulativePower = 0;
        
        for (const node of updatedNodes) {
          cumulativePower += node.hashPower || 0;
          if (random <= cumulativePower) {
            selectedNodeId = node.id;
            break;
          }
        }
        
        if (selectedNodeId) {
          // Update the selected node
          updatedNodes = updatedNodes.map(node => ({
            ...node,
            status: node.id === selectedNodeId ? 'mining' : 'idle',
            selected: node.id === selectedNodeId,
            blocks: node.id === selectedNodeId ? node.blocks + 1 : node.blocks
          }));
          
          // Add the new block
          const newBlock: Block = {
            id: blocks.length + 1,
            producer: selectedNodeId,
            timestamp: new Date()
          };
          
          setBlocks([...blocks, newBlock]);
          setNodes(updatedNodes);
          
          // Update block time if we have more than one block
          if (blocks.length > 0) {
            const lastBlock = blocks[blocks.length - 1];
            const newBlockTime = (newBlock.timestamp.getTime() - lastBlock.timestamp.getTime()) / 1000;
            setBlockTime(newBlockTime);
          }
        }
      }, 1500 / simulationSpeed); // Adjust animation speed
    } else {
      // PoS: Set validators to validating status
      updatedNodes = updatedNodes.map(node => ({
        ...node,
        status: 'validating'
      }));
      
      // Update validators status for animation
      setNodes(updatedNodes);
      
      // After a delay, select one validator based on stake
      setTimeout(() => {
        // PoS: Probabilistically select a validator based on their stake
        const random = Math.random() * totalStake;
        let cumulativeStake = 0;
        
        for (const node of updatedNodes) {
          cumulativeStake += node.stake || 0;
          if (random <= cumulativeStake) {
            selectedNodeId = node.id;
            break;
          }
        }
        
        if (selectedNodeId) {
          // Update the selected node
          updatedNodes = updatedNodes.map(node => ({
            ...node,
            status: node.id === selectedNodeId ? 'validating' : 'idle',
            selected: node.id === selectedNodeId,
            blocks: node.id === selectedNodeId ? node.blocks + 1 : node.blocks
          }));
          
          // Add the new block
          const newBlock: Block = {
            id: blocks.length + 1,
            producer: selectedNodeId,
            timestamp: new Date()
          };
          
          setBlocks([...blocks, newBlock]);
          setNodes(updatedNodes);
          
          // Update block time if we have more than one block
          if (blocks.length > 0) {
            const lastBlock = blocks[blocks.length - 1];
            const newBlockTime = (newBlock.timestamp.getTime() - lastBlock.timestamp.getTime()) / 1000;
            setBlockTime(newBlockTime);
          }
        }
      }, 1500 / simulationSpeed); // Adjust animation speed
    }
  };
  
  // Start or stop the simulation
  const toggleSimulation = () => {
    if (isSimulationRunning) {
      // Stop simulation
      if (simulationInterval) {
        clearInterval(simulationInterval);
        setSimulationInterval(null);
      }
      
      // Reset node statuses
      const resetNodes = nodes.map(node => ({
        ...node,
        status: 'idle' as 'idle',
        selected: false
      }));
      setNodes(resetNodes);
    } else {
      // Start simulation
      produceBlock(); // Produce first block immediately
      
      const interval = window.setInterval(() => {
        produceBlock();
      }, 3000 / simulationSpeed) as unknown as number;
      
      setSimulationInterval(interval);
    }
    
    setIsSimulationRunning(!isSimulationRunning);
  };
  
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);
  
  // Calculate node percentages
  const getNodePercentage = (node: Node) => {
    if (consensusType === 'pow') {
      return ((node.hashPower || 0) / totalHashPower) * 100;
    } else {
      return ((node.stake || 0) / totalStake) * 100;
    }
  };
  
  // Get node by ID
  const getNodeById = (id: number) => {
    return nodes.find(node => node.id === id) || nodes[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Consensus Mechanism</h3>
          <ToggleGroup type="single" value={consensusType} onValueChange={(value) => value && setConsensusType(value as 'pow' | 'pos')}>
            <ToggleGroupItem value="pow" aria-label="Proof of Work" className="flex items-center gap-1.5">
              <Pickaxe className="h-3.5 w-3.5" /> 
              <span>Proof of Work</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="pos" aria-label="Proof of Stake" className="flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5" /> 
              <span>Proof of Stake</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="flex flex-row sm:flex-col justify-between sm:justify-start gap-2 sm:text-right">
          <div>
            <div className="text-sm text-muted-foreground">Simulation Speed</div>
            <div className="flex items-center gap-2 mt-1">
              <Slider 
                value={[simulationSpeed]} 
                min={1} 
                max={10} 
                step={1} 
                onValueChange={values => setSimulationSpeed(values[0])}
                className="w-24" 
              />
              <span className="text-sm font-medium">{simulationSpeed}x</span>
            </div>
          </div>
          
          <Button 
            onClick={toggleSimulation}
            variant={isSimulationRunning ? "destructive" : "default"}
            size="sm"
            className="self-end"
          >
            {isSimulationRunning ? 'Stop Simulation' : 'Start Simulation'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left column: Nodes */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-1.5">
            {consensusType === 'pow' ? (
              <>
                <HardHat className="h-4 w-4" /> 
                <span>Mining Nodes</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" /> 
                <span>Validator Nodes</span>
              </>
            )}
            
            <Badge variant="outline" className="ml-2">
              {nodes.length} Nodes
            </Badge>
            
            {consensusType === 'pow' ? (
              <Badge variant="outline" className="ml-auto">
                {totalHashPower} TH/s
              </Badge>
            ) : (
              <Badge variant="outline" className="ml-auto">
                {totalStake} ETH
              </Badge>
            )}
          </h3>
          
          <div className="space-y-3">
            {nodes.map(node => {
              const percentage = getNodePercentage(node);
              
              return (
                <Card 
                  key={node.id} 
                  className={`${node.selected ? 'border-green-500 dark:border-green-500' : ''}`}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          {consensusType === 'pow' ? (
                            <Cpu className="h-3.5 w-3.5 text-amber-500" />
                          ) : (
                            <Coins className="h-3.5 w-3.5 text-blue-500" />
                          )}
                          <span className="font-medium text-sm">{node.name}</span>
                          
                          {node.status !== 'idle' && (
                            <Badge 
                              variant="outline" 
                              className={`ml-2 text-xs ${node.selected ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'animate-pulse'}`}
                            >
                              {node.status === 'mining' ? 'Mining' : 'Validating'}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Progress value={percentage} className="h-2 w-32" />
                          <span className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {consensusType === 'pow' ? (
                            <span>{node.hashPower} TH/s</span>
                          ) : (
                            <span>{node.stake} ETH</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {node.blocks} blocks mined
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        
        {/* Right column: Stats and Blocks */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-4 text-center">
                <Zap className="h-6 w-6 text-amber-500 mx-auto mb-1" />
                <div className="text-2xl font-bold">{blocks.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Blocks Produced</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 text-center">
                <Clock className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                <div className="text-2xl font-bold">{blockTime.toFixed(1)}s</div>
                <div className="text-xs text-muted-foreground mt-1">Avg Block Time</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 text-center">
                {consensusType === 'pow' ? (
                  <FlaskConical className="h-6 w-6 text-red-500 mx-auto mb-1" />
                ) : (
                  <Users className="h-6 w-6 text-green-500 mx-auto mb-1" />
                )}
                <div className="text-2xl font-bold">
                  {consensusType === 'pow' ? (
                    <span>High</span>
                  ) : (
                    <span>Low</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Energy Usage</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium flex items-center gap-1.5">
              <Crown className="h-4 w-4" /> 
              <span>Recent Blocks</span>
            </h3>
            
            <div className="max-h-[260px] overflow-y-auto pr-1 space-y-2">
              <AnimatePresence>
                {blocks.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No blocks produced yet
                  </div>
                ) : (
                  [...blocks].reverse().slice(0, 5).map((block) => {
                    const producerNode = getNodeById(block.producer);
                    
                    return (
                      <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
                              <div className="font-medium text-sm">Block #{block.id}</div>
                              <div className="text-xs text-muted-foreground">
                                {block.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                            
                            <div className="p-3">
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                <span className="text-sm">Produced by:</span>
                                <span className="text-sm font-medium">{producerNode.name}</span>
                              </div>
                              
                              <div className="mt-1 text-xs text-muted-foreground">
                                {consensusType === 'pow' ? (
                                  <span>Hash power: {producerNode.hashPower} TH/s ({getNodePercentage(producerNode).toFixed(1)}% of network)</span>
                                ) : (
                                  <span>Stake: {producerNode.stake} ETH ({getNodePercentage(producerNode).toFixed(1)}% of network)</span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <h3 className="font-medium mb-2">{consensusType === 'pow' ? 'Proof of Work Explained' : 'Proof of Stake Explained'}</h3>
          
          {consensusType === 'pow' ? (
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                In <strong>Proof of Work</strong>, miners compete to solve complex mathematical puzzles, which requires significant computational power measured in hash rate.
              </p>
              <p>
                The probability of mining a block is proportional to a miner's hash power relative to the total network hash power. More powerful miners have a higher chance of adding new blocks and earning rewards.
              </p>
              <p>
                While secure, PoW consumes substantial electricity for the computation required to solve these puzzles.
              </p>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                In <strong>Proof of Stake</strong>, validators are selected to create new blocks based on the amount of cryptocurrency they've staked (locked up) as collateral.
              </p>
              <p>
                The probability of being chosen to validate the next block is proportional to a validator's stake relative to the total staked in the network. Those with more coins staked have a higher chance of being selected.
              </p>
              <p>
                PoS is more energy-efficient than PoW as it doesn't require solving computational puzzles, but rather secures the network through economic incentives.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsensusDemo;