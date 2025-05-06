import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2 } from 'lucide-react';

// Fallback component if the actual visualization components can't be loaded
const PlaceholderComponent: React.FC<{title: string}> = ({title}) => (
  <div className="p-8 border rounded-md bg-muted/30">
    <div className="flex flex-col items-center justify-center space-y-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium">{title} Component</h3>
        <p className="text-sm text-muted-foreground">This component is currently being developed.</p>
      </div>
    </div>
  </div>
);

// Lazy load components to improve error handling
const BlockVisualization = lazy(() => 
  import('@/components/blockchain/BlockVisualization')
    .catch(() => ({ default: () => <PlaceholderComponent title="Block Visualization" /> }))
);
const TransactionSimulation = lazy(() => 
  import('@/components/blockchain/TransactionSimulation')
    .catch(() => ({ default: () => <PlaceholderComponent title="Transaction Simulation" /> }))
);
const ConsensusDemo = lazy(() => 
  import('@/components/blockchain/ConsensusDemo')
    .catch(() => ({ default: () => <PlaceholderComponent title="Consensus Mechanism Demo" /> }))
);
const HashingDemo = lazy(() => 
  import('@/components/blockchain/HashingDemo')
    .catch(() => ({ default: () => <PlaceholderComponent title="Cryptographic Hashing Demo" /> }))
);

const BlockchainVisualizer: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState('blocks');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Blockchain Visualizer</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Interactive visualizations to understand blockchain concepts
          </p>
        </div>

        <Tabs 
          defaultValue="blocks"
          value={selectedConcept}
          onValueChange={setSelectedConcept}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-4 w-full max-w-3xl">
              <TabsTrigger value="blocks">Blocks & Chain</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="consensus">Consensus</TabsTrigger>
              <TabsTrigger value="hashing">Cryptography</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="max-w-5xl mx-auto w-full">
            <TabsContent value="blocks" className="mt-0">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Blockchain Structure</CardTitle>
                      <CardDescription>
                        Visualize how blocks connect to form a chain using cryptographic links
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Interactive</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                    <BlockVisualization />
                  </Suspense>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => window.open('https://ethereum.org/en/developers/docs/blocks/', '_blank')}>Learn More</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="mt-0">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Transaction Lifecycle</CardTitle>
                      <CardDescription>
                        See how transactions move from mempool to confirmed blocks
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Animation</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                    <TransactionSimulation />
                  </Suspense>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => window.open('https://ethereum.org/en/developers/docs/transactions/', '_blank')}>Learn More</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="consensus" className="mt-0">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Consensus Mechanisms</CardTitle>
                      <CardDescription>
                        Compare Proof of Work and Proof of Stake consensus models
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Simulation</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                    <ConsensusDemo />
                  </Suspense>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => window.open('https://ethereum.org/en/developers/docs/consensus-mechanisms/', '_blank')}>Learn More</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="hashing" className="mt-0">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Cryptographic Hashing</CardTitle>
                      <CardDescription>
                        Experiment with hash functions and see how they secure the blockchain
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Try It</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                    <HashingDemo />
                  </Suspense>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => window.open('https://ethereum.org/en/developers/docs/consensus-mechanisms/pow/mining-algorithms/ethash/', '_blank')}>Learn More</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default BlockchainVisualizer;
