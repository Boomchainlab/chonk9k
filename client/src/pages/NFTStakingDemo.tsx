import React from 'react';
import { ChonkNFTStakingDemo } from '@/components/ChonkNFTStakingDemo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NFTStakingDemo() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="bg-primary/5 border-none">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold">CHONK9K NFT Staking</CardTitle>
          <CardDescription>
            Stake your Cyber Chonk NFTs to earn CHONK9K token rewards according to the EIP-9000 standard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-lg overflow-hidden border bg-card p-4">
              <h2 className="text-xl font-bold mb-2">What is NFT Staking?</h2>
              <p className="text-muted-foreground">
                NFT staking is a process where you lock your NFTs in a smart contract to earn token rewards. In the CHONK9K ecosystem, 
                staking your Cyber Chonk NFTs earns you CHONK9K tokens based on the rarity of your NFTs and the duration of staking.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/10 rounded-md">
                  <h3 className="font-bold">Key Benefits</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li>Earn passive income with your NFT collection</li>
                    <li>Higher rarity NFTs earn more rewards</li>
                    <li>No lock-up periods - unstake anytime</li>
                    <li>Rewards accrue in real-time</li>
                  </ul>
                </div>
                <div className="p-4 bg-primary/10 rounded-md">
                  <h3 className="font-bold">How Rewards Are Calculated</h3>
                  <div className="mt-2 text-sm">
                    <code className="block p-2 bg-black/20 rounded-md">
                      Reward = (Base Rate × Time Staked × Rarity Multiplier × Token Count) / 10000
                    </code>
                    <div className="mt-2">
                      <div>• Base Rate: 12% APY</div>
                      <div>• Rarity Multipliers: 1x to 5x</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ChonkNFTStakingDemo />
      
      <Card className="bg-card/50 border-none mt-8">
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
          <CardDescription>
            Based on the EIP-9000 CHONK9K Token Standard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black/90 rounded-lg p-4 overflow-x-auto text-green-400 font-mono text-sm">
            <code>
              {`interface INFTStaking {
    function stakeNFT(uint256 tokenId, address nftContract) external;
    function unstakeNFT(uint256 tokenId, address nftContract) external;
    function getStakedNFTs(address staker) external view returns (StakedNFT[] memory);
    function calculateRewards(address staker) external view returns (uint256);
    function claimRewards() external returns (uint256);
    
    struct StakedNFT {
        uint256 tokenId;
        address nftContract;
        uint256 stakingStartTime;
        uint256 lastRewardCalculation;
        uint256 rarityMultiplier; // 100 = 1x, 200 = 2x, etc.
    }
}`}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
