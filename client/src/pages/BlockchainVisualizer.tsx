import React from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { BlockchainVisualization, ConsensusVisualization, HashVisualization } from '@/components/blockchain-visualization';
import { MentorMascot } from '@/components/mascot';

const BlockchainVisualizer: React.FC = () => {
  useDocumentTitle('CHONK9K - Interactive Blockchain Visualizer');
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
          Interactive Blockchain Visualizer
        </h1>
        <p className="text-gray-400 text-center mt-2 max-w-3xl mx-auto">
          Explore the core concepts of blockchain technology with our interactive visualization tool.
          Learn how blocks are linked, transactions are processed, and why blockchain is immutable.
        </p>
      </header>
      
      <main className="space-y-10">
        {/* Main Blockchain Visualization */}
        <section>
          <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
            Blockchain Explorer
          </h2>
          <BlockchainVisualization />
        </section>
        
        {/* Consensus Mechanisms Section */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
            Consensus Mechanisms
          </h2>
          <p className="text-gray-400 mb-4 max-w-3xl">
            Explore how different consensus algorithms secure blockchain networks by ensuring all nodes agree on the state of the ledger.
          </p>
          <ConsensusVisualization />
        </section>
        
        {/* Hash Visualization Section */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
            Hash Functions & Mining
          </h2>
          <p className="text-gray-400 mb-4 max-w-3xl">
            Explore how cryptographic hash functions secure the blockchain and how miners compete to find valid block hashes.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <HashVisualization />
            <div className="bg-black/60 backdrop-blur-md border border-[#00e0ff]/30 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-[#00e0ff]">How Mining Works</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="bg-[#ff00ff]/20 rounded-full p-2 text-center text-[#ff00ff] font-bold">1</div>
                  <div>
                    <h4 className="font-bold">Collect Transactions</h4>
                    <p className="text-sm text-gray-400">Miners gather unconfirmed transactions from the mempool to include in a new block.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#ff00ff]/20 rounded-full p-2 text-center text-[#ff00ff] font-bold">2</div>
                  <div>
                    <h4 className="font-bold">Create Block Header</h4>
                    <p className="text-sm text-gray-400">Miners construct a block header with transaction data, timestamp, and previous block hash.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#ff00ff]/20 rounded-full p-2 text-center text-[#ff00ff] font-bold">3</div>
                  <div>
                    <h4 className="font-bold">Proof of Work</h4>
                    <p className="text-sm text-gray-400">Miners continuously change a nonce value and hash the block header until finding a hash that meets the difficulty target.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#ff00ff]/20 rounded-full p-2 text-center text-[#ff00ff] font-bold">4</div>
                  <div>
                    <h4 className="font-bold">Broadcast Solution</h4>
                    <p className="text-sm text-gray-400">Once a valid hash is found, the miner broadcasts the block to the network for verification and adds it to their chain.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#ff00ff]/20 rounded-full p-2 text-center text-[#ff00ff] font-bold">5</div>
                  <div>
                    <h4 className="font-bold">Receive Rewards</h4>
                    <p className="text-sm text-gray-400">The successful miner receives block rewards and transaction fees as compensation for securing the network.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Add the mentor mascot to help explain blockchain concepts */}
      <MentorMascot position="bottom-right" />
    </div>
  );
};

export default BlockchainVisualizer;
