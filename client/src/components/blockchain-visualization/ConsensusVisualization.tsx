import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Pause, RefreshCw, Info, Award, Server, Database, Shield, Zap, Clock } from 'lucide-react';

interface ConsensusVisualizationProps {
  className?: string;
}

type Node = {
  id: number;
  position: { x: number; y: number };
  state: 'pending' | 'leader' | 'validator' | 'mining' | 'staking' | 'failed';
  stake?: number;
  computing?: number;
  selected?: boolean;
  delay?: number;
};

type ConsensusType = 'pow' | 'pos' | 'dpos' | 'pbft';

const ConsensusVisualization: React.FC<ConsensusVisualizationProps> = ({ className = '' }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [simulation, setSimulation] = useState<'running' | 'paused' | 'stopped'>('stopped');
  const [consensusType, setConsensusType] = useState<ConsensusType>('pow');
  const [round, setRound] = useState(0);
  const [roundTime, setRoundTime] = useState(2000); // Time in ms
  const [blockHeight, setBlockHeight] = useState(0);
  const [nodeCount, setNodeCount] = useState(7);
  
  const animationRef = useRef<number>();
  const timeRef = useRef<number>(0);
  const lastRoundRef = useRef<number>(0);
  
  // Initialize or reset nodes
  const initializeNodes = () => {
    const centerX = 150;
    const centerY = 150;
    const radius = 120;
    
    const newNodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Node type depends on consensus algorithm
      newNodes.push({
        id: i,
        position: { x, y },
        state: 'pending',
        stake: Math.floor(Math.random() * 100) + 1, // 1-100 stake for PoS
        computing: Math.floor(Math.random() * 100) + 1, // 1-100 hashpower for PoW
        delay: Math.floor(Math.random() * 200) // 0-200ms network delay
      });
    }
    
    setNodes(newNodes);
    setRound(0);
    setBlockHeight(0);
  };
  
  // Start the simulation
  const startSimulation = () => {
    if (simulation === 'running') return;
    
    setSimulation('running');
    timeRef.current = 0;
    animationRef.current = requestAnimationFrame(simulationLoop);
  };
  
  // Pause the simulation
  const pauseSimulation = () => {
    if (simulation !== 'running') return;
    
    setSimulation('paused');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };
  
  // Stop and reset the simulation
  const stopSimulation = () => {
    if (simulation === 'stopped') return;
    
    setSimulation('stopped');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    initializeNodes();
  };
  
  // Simulation loop - runs each animation frame
  const simulationLoop = (timestamp: number) => {
    if (!timeRef.current) {
      timeRef.current = timestamp;
    }
    
    const elapsed = timestamp - timeRef.current;
    
    // New round check
    if (timestamp - lastRoundRef.current >= roundTime) {
      nextRound();
      lastRoundRef.current = timestamp;
    }
    
    animationRef.current = requestAnimationFrame(simulationLoop);
  };
  
  // Simulate one round of consensus
  const nextRound = () => {
    setRound(prevRound => prevRound + 1);
    
    // Simulate consensus algorithm
    switch (consensusType) {
      case 'pow':
        simulatePoW();
        break;
      case 'pos':
        simulatePoS();
        break;
      case 'dpos':
        simulateDPoS();
        break;
      case 'pbft':
        simulatePBFT();
        break;
    }
  };
  
  // Simulate Proof of Work consensus
  const simulatePoW = () => {
    setNodes(prevNodes => {
      const newNodes = [...prevNodes];
      
      // Reset states first
      newNodes.forEach(node => {
        node.state = 'pending';
        node.selected = false;
      });
      
      // Mining phase - all nodes try to mine
      newNodes.forEach(node => {
        node.state = 'mining';
      });
      
      // After a delay (use setTimeout in real implementation)
      setTimeout(() => {
        setNodes(currentNodes => {
          const updatedNodes = [...currentNodes];
          
          // Randomly select a winner weighted by computing power
          const totalPower = updatedNodes.reduce((sum, node) => sum + (node.computing || 1), 0);
          let randomPower = Math.random() * totalPower;
          let winnerIndex = 0;
          
          for (let i = 0; i < updatedNodes.length; i++) {
            randomPower -= (updatedNodes[i].computing || 1);
            if (randomPower <= 0) {
              winnerIndex = i;
              break;
            }
          }
          
          // Set winner as leader
          updatedNodes.forEach((node, index) => {
            if (index === winnerIndex) {
              node.state = 'leader';
              node.selected = true;
            } else {
              node.state = 'validator';
            }
          });
          
          // Increment block height after all nodes validate
          setBlockHeight(prevHeight => prevHeight + 1);
          
          return updatedNodes;
        });
      }, roundTime * 0.7);
      
      return newNodes;
    });
  };
  
  // Simulate Proof of Stake consensus
  const simulatePoS = () => {
    setNodes(prevNodes => {
      const newNodes = [...prevNodes];
      
      // Reset states first
      newNodes.forEach(node => {
        node.state = 'pending';
        node.selected = false;
      });
      
      // Staking phase - all nodes are staking
      newNodes.forEach(node => {
        node.state = 'staking';
      });
      
      // After a delay
      setTimeout(() => {
        setNodes(currentNodes => {
          const updatedNodes = [...currentNodes];
          
          // Randomly select a winner weighted by stake
          const totalStake = updatedNodes.reduce((sum, node) => sum + (node.stake || 1), 0);
          let randomStake = Math.random() * totalStake;
          let winnerIndex = 0;
          
          for (let i = 0; i < updatedNodes.length; i++) {
            randomStake -= (updatedNodes[i].stake || 1);
            if (randomStake <= 0) {
              winnerIndex = i;
              break;
            }
          }
          
          // Set winner as leader
          updatedNodes.forEach((node, index) => {
            if (index === winnerIndex) {
              node.state = 'leader';
              node.selected = true;
            } else {
              node.state = 'validator';
            }
          });
          
          // Increment block height after all nodes validate
          setBlockHeight(prevHeight => prevHeight + 1);
          
          return updatedNodes;
        });
      }, roundTime * 0.7);
      
      return newNodes;
    });
  };
  
  // Simulate Delegated Proof of Stake consensus
  const simulateDPoS = () => {
    setNodes(prevNodes => {
      const newNodes = [...prevNodes];
      
      // Reset states first
      newNodes.forEach(node => {
        node.state = 'pending';
        node.selected = false;
      });
      
      // Select top validators by stake (delegates)
      const delegates = [...newNodes]
        .sort((a, b) => (b.stake || 0) - (a.stake || 0))
        .slice(0, Math.max(3, Math.floor(newNodes.length / 2)));
      
      const delegateIds = delegates.map(d => d.id);
      
      // Set delegates
      newNodes.forEach(node => {
        if (delegateIds.includes(node.id)) {
          node.state = 'validator';
        } else {
          node.state = 'pending';
        }
      });
      
      // After a delay
      setTimeout(() => {
        setNodes(currentNodes => {
          const updatedNodes = [...currentNodes];
          
          // Delegates take turns - select one based on round
          const leaderIndex = round % delegateIds.length;
          const leaderId = delegateIds[leaderIndex];
          
          // Set leader
          updatedNodes.forEach(node => {
            if (node.id === leaderId) {
              node.state = 'leader';
              node.selected = true;
            }
          });
          
          // Increment block height after delegates validate
          setBlockHeight(prevHeight => prevHeight + 1);
          
          return updatedNodes;
        });
      }, roundTime * 0.7);
      
      return newNodes;
    });
  };
  
  // Simulate Practical Byzantine Fault Tolerance consensus
  const simulatePBFT = () => {
    // PBFT has pre-prepare, prepare, commit phases
    setNodes(prevNodes => {
      const newNodes = [...prevNodes];
      
      // Reset states first
      newNodes.forEach(node => {
        node.state = 'pending';
        node.selected = false;
      });
      
      // 1. Select primary/leader for this round (deterministic based on round)
      const leaderIndex = round % newNodes.length;
      newNodes[leaderIndex].state = 'leader';
      newNodes[leaderIndex].selected = true;
      
      // 2. Pre-prepare phase - leader proposes
      setTimeout(() => {
        setNodes(currentNodes => {
          // Some nodes might fail randomly (Byzantine fault)
          return currentNodes.map(node => {
            if (node.id !== leaderIndex && Math.random() < 0.1) {
              return { ...node, state: 'failed' };
            }
            return node;
          });
        });
        
        // 3. Prepare phase - nodes validate and broadcast
        setTimeout(() => {
          setNodes(currentNodes => {
            const updatedNodes = [...currentNodes];
            
            updatedNodes.forEach(node => {
              if (node.state !== 'failed' && node.id !== leaderIndex) {
                node.state = 'validator';
              }
            });
            
            return updatedNodes;
          });
          
          // 4. Commit phase - if enough validators agree (2/3)
          setTimeout(() => {
            setNodes(currentNodes => {
              const validatorCount = currentNodes.filter(
                node => node.state === 'validator' || node.state === 'leader'
              ).length;
              
              // Need 2/3 majority for consensus
              if (validatorCount >= Math.ceil((2 * currentNodes.length) / 3)) {
                setBlockHeight(prevHeight => prevHeight + 1);
              }
              
              return currentNodes;
            });
          }, roundTime * 0.2);
        }, roundTime * 0.2);
      }, roundTime * 0.2);
      
      return newNodes;
    });
  };
  
  // Handle consensus type change
  const handleConsensusChange = (value: ConsensusType) => {
    setConsensusType(value);
    stopSimulation();
  };
  
  // Handle node count change
  const handleNodeCountChange = (value: number[]) => {
    setNodeCount(value[0]);
    stopSimulation();
  };
  
  // Handle round time change
  const handleRoundTimeChange = (value: number[]) => {
    setRoundTime(value[0]);
  };
  
  // Get node color based on state
  const getNodeColor = (state: Node['state']) => {
    switch (state) {
      case 'leader':
        return 'bg-amber-500';
      case 'validator':
        return 'bg-green-500';
      case 'mining':
        return 'bg-blue-500 animate-pulse';
      case 'staking':
        return 'bg-purple-500 animate-pulse';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get node label based on state
  const getNodeLabel = (state: Node['state']) => {
    switch (state) {
      case 'leader':
        return 'Leader';
      case 'validator':
        return 'Validator';
      case 'mining':
        return 'Mining';
      case 'staking':
        return 'Staking';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };
  
  // Initialize nodes on mount and when node count changes
  useEffect(() => {
    initializeNodes();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodeCount]);
  
  return (
    <Card className={cn("border border-[#00e0ff]/30 bg-black/60 backdrop-blur-md overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
              Consensus Mechanism Visualizer
            </span>
          </CardTitle>
          
          <Badge variant="outline" className="bg-black/40 text-xs">
            Block Height: {blockHeight}
          </Badge>
        </div>
        
        <CardDescription>
          Explore how different consensus mechanisms work in blockchain networks
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={consensusType} onValueChange={(v) => handleConsensusChange(v as ConsensusType)} className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-2 bg-black/30 p-1 border border-[#ff00ff]/30">
            <TabsTrigger value="pow" className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 data-[state=active]:shadow-md">
              <Zap className="h-4 w-4" />
              <span className="text-xs">Proof of Work</span>
            </TabsTrigger>
            <TabsTrigger value="pos" className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:shadow-md">
              <Shield className="h-4 w-4" />
              <span className="text-xs">Proof of Stake</span>
            </TabsTrigger>
            <TabsTrigger value="dpos" className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:shadow-md">
              <Award className="h-4 w-4" />
              <span className="text-xs">Delegated PoS</span>
            </TabsTrigger>
            <TabsTrigger value="pbft" className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:shadow-md">
              <Server className="h-4 w-4" />
              <span className="text-xs">PBFT</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center justify-between space-x-2 px-1">
            <div>
              <Badge variant="outline" className="bg-black/40 text-xs">
                {simulation === 'running' ? (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 animate-pulse text-green-400" />
                    <span className="text-green-400">Running</span>
                  </span>
                ) : simulation === 'paused' ? (
                  <span className="flex items-center gap-1">
                    <span className="text-amber-400">Paused</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400">Stopped</span>
                  </span>
                )}
              </Badge>
              <Badge variant="outline" className="bg-black/40 text-xs ml-2">
                Round: {round}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              {simulation === 'running' ? (
                <Button variant="outline" size="sm" onClick={pauseSimulation} className="h-8 w-8 p-0">
                  <Pause className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={startSimulation} className="h-8 w-8 p-0 bg-black/30 border-green-500/30 text-green-500 hover:bg-black/50 hover:text-green-400">
                  <Play className="h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={stopSimulation} className="h-8 w-8 p-0 bg-black/30 border-red-500/30 text-red-500 hover:bg-black/50 hover:text-red-400">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="border border-[#ff00ff]/20 rounded-md p-4 bg-black/20">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Network Visualization */}
              <div className="flex-1 border border-gray-800 rounded-md bg-black/40 relative overflow-hidden" style={{ height: '300px' }}>
                {/* Network graph */}
                <svg width="100%" height="100%" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
                  {/* Connection lines */}
                  {nodes.map((node, i) => (
                    nodes.filter(n => n.id !== node.id).map((otherNode, j) => (
                      <line 
                        key={`line-${node.id}-${otherNode.id}`}
                        x1={node.position.x}
                        y1={node.position.y}
                        x2={otherNode.position.x}
                        y2={otherNode.position.y}
                        stroke={node.selected || otherNode.selected ? "rgba(255, 0, 255, 0.5)" : "rgba(100, 100, 100, 0.1)"}
                        strokeWidth={node.selected || otherNode.selected ? 2 : 1}
                        strokeDasharray={node.state === 'failed' || otherNode.state === 'failed' ? "4 2" : "none"}
                      />
                    ))
                  ))}
                  
                  {/* Nodes */}
                  {nodes.map((node) => (
                    <g key={node.id} className="transition-all duration-300">
                      <circle 
                        cx={node.position.x}
                        cy={node.position.y}
                        r={node.selected ? 16 : 12}
                        className={cn(
                          getNodeColor(node.state),
                          "stroke-2",
                          node.selected ? "stroke-[#ff00ff] shadow-lg" : "stroke-gray-800"
                        )}
                      />
                      
                      <text 
                        x={node.position.x}
                        y={node.position.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-white text-[9px] font-bold select-none pointer-events-none"
                      >
                        {node.id + 1}
                      </text>
                      
                      {node.selected && (
                        <text 
                          x={node.position.x}
                          y={node.position.y + 25}
                          textAnchor="middle"
                          className="fill-white text-[8px] font-medium select-none pointer-events-none"
                        >
                          {getNodeLabel(node.state)}
                        </text>
                      )}
                    </g>
                  ))}
                </svg>
                
                {/* Legend */}
                <div className="absolute bottom-2 right-2 bg-black/70 p-2 rounded text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span>Leader</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Validator</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Failed</span>
                  </div>
                </div>
              </div>
              
              {/* Consensus Algorithm Description */}
              <div className="flex-1 space-y-4">
                <TabsContent value="pow" className="space-y-4 mt-0">
                  <div className="text-sm space-y-2">
                    <h3 className="font-bold">Proof of Work (PoW)</h3>
                    <p className="text-gray-400">Miners compete to solve complex mathematical puzzles. The first to solve it gets to create the next block and receives a reward.</p>
                    <ul className="list-disc list-inside text-gray-400">
                      <li>High security but energy intensive</li>
                      <li>Used by Bitcoin and Ethereum (pre-merge)</li>
                      <li>Difficulty adjusts to maintain block time</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-400">Node Computing Power:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {nodes.filter((_, i) => i < 6).map((node) => (
                        <div key={node.id} className="flex items-center space-x-2">
                          <span className="text-xs">Node {node.id + 1}</span>
                          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-blue-500 h-2"
                              style={{ width: `${node.computing}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="pos" className="space-y-4 mt-0">
                  <div className="text-sm space-y-2">
                    <h3 className="font-bold">Proof of Stake (PoS)</h3>
                    <p className="text-gray-400">Validators create blocks based on the amount of cryptocurrency they have staked. More stake = higher chance of selection.</p>
                    <ul className="list-disc list-inside text-gray-400">
                      <li>Energy efficient alternative to PoW</li>
                      <li>Used by Ethereum 2.0, Cardano, Solana</li>
                      <li>Economic security through staked assets</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-400">Node Stake Amounts:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {nodes.filter((_, i) => i < 6).map((node) => (
                        <div key={node.id} className="flex items-center space-x-2">
                          <span className="text-xs">Node {node.id + 1}</span>
                          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-purple-500 h-2"
                              style={{ width: `${node.stake}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="dpos" className="space-y-4 mt-0">
                  <div className="text-sm space-y-2">
                    <h3 className="font-bold">Delegated Proof of Stake (DPoS)</h3>
                    <p className="text-gray-400">Token holders vote for a small number of delegates who take turns producing blocks in a round-robin fashion.</p>
                    <ul className="list-disc list-inside text-gray-400">
                      <li>Higher throughput than PoS</li>
                      <li>Used by EOS, Tron, Lisk</li>
                      <li>Democratic governance structure</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-400">Delegates (Top Stakers):</Label>
                    <div className="flex flex-wrap gap-2">
                      {nodes.sort((a, b) => (b.stake || 0) - (a.stake || 0)).slice(0, 3).map((node) => (
                        <Badge key={node.id} className="bg-blue-900/30 text-blue-300 border border-blue-500/30">
                          Node {node.id + 1} ({node.stake}%)
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="pbft" className="space-y-4 mt-0">
                  <div className="text-sm space-y-2">
                    <h3 className="font-bold">Practical Byzantine Fault Tolerance (PBFT)</h3>
                    <p className="text-gray-400">A consensus algorithm designed to work in asynchronous systems that can tolerate Byzantine faults (malicious nodes).</p>
                    <ul className="list-disc list-inside text-gray-400">
                      <li>High throughput with immediate finality</li>
                      <li>Used by Hyperledger Fabric, Zilliqa</li>
                      <li>Tolerates up to 1/3 of nodes being faulty</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Phase:</span>
                      <Badge variant="outline" className="text-xs">
                        {round % 3 === 0 ? 'Pre-prepare' : round % 3 === 1 ? 'Prepare' : 'Commit'}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-400 mt-2">
                      <div className="flex justify-between">
                        <span>Nodes Available:</span>
                        <span>{nodes.filter(n => n.state !== 'failed').length}/{nodes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consensus Threshold:</span>
                        <span>{Math.ceil((2 * nodes.length) / 3)} nodes</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400 flex items-center gap-1">
                    <span>Simulation Settings</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Adjust network parameters</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Network Nodes: {nodeCount}</span>
                      </div>
                      <Slider
                        defaultValue={[nodeCount]}
                        min={3}
                        max={12}
                        step={1}
                        onValueChange={handleNodeCountChange}
                        disabled={simulation !== 'stopped'}
                        className="py-2"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Simulation Speed: {roundTime}ms</span>
                      </div>
                      <Slider
                        defaultValue={[roundTime]}
                        min={500}
                        max={5000}
                        step={500}
                        onValueChange={handleRoundTimeChange}
                        className="py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-gray-400 italic">
        <p>
          Consensus mechanisms are the protocols that ensure all nodes in a blockchain network agree on the current state of the blockchain.
          They are essential for maintaining the integrity and security of decentralized systems.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ConsensusVisualization;
