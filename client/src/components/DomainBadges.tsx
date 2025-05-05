import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type BadgeItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockCriteria?: string;
};

const badges: BadgeItem[] = [
  {
    id: 'domain-pioneer',
    name: 'Domain Pioneer',
    description: 'Early adopter of Unstoppable Domains with CHONK9K',
    imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/badges/domain-pioneer.svg',
    category: 'achievement',
    rarity: 'uncommon',
    unlocked: true
  },
  {
    id: 'multi-domain',
    name: 'Domain Collector',
    description: 'Registered multiple Unstoppable Domains on CHONK9K',
    imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/badges/domain-collector.svg',
    category: 'achievement',
    rarity: 'rare',
    unlocked: false,
    unlockCriteria: 'Register at least 3 domains'
  },
  {
    id: 'verification-master',
    name: 'Verification Master',
    description: 'Verified all your Unstoppable Domains',
    imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/badges/verification-master.svg',
    category: 'achievement',
    rarity: 'uncommon',
    unlocked: false,
    unlockCriteria: 'Verify all your registered domains'
  },
  {
    id: 'staking-booster',
    name: 'Staking Booster',
    description: 'Unlocked enhanced staking rates with your domains',
    imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/badges/staking-booster.svg',
    category: 'benefit',
    rarity: 'epic',
    unlocked: true
  },
  {
    id: 'governance-voter',
    name: 'Governance Voter',
    description: 'Special voting privileges in CHONK9K DAO proposals',
    imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/badges/governance-voter.svg',
    category: 'benefit',
    rarity: 'rare',
    unlocked: true
  },
  {
    id: 'identity-verified',
    name: 'Identity Verified',
    description: 'Completed full identity verification with Unstoppable Domains',
    imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/badges/identity-verified.svg',
    category: 'verification',
    rarity: 'epic',
    unlocked: false,
    unlockCriteria: 'Complete extended identity verification process'
  },
  {
    id: 'chonk-enthusiast',
    name: 'CHONK Enthusiast',
    description: 'True CHONK9K enthusiast with special platform perks',
    imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/badges/chonk-enthusiast.svg',
    category: 'community',
    rarity: 'legendary',
    unlocked: false,
    unlockCriteria: 'Be active in the community for 30+ days'
  },
  {
    id: 'learning-completed',
    name: 'Learning Completed',
    description: 'Completed all CHONK9K learning modules',
    imageUrl: 'https://d2y4y6koqmb0vn.cloudfront.net/badges/learning-completed.svg',
    category: 'education',
    rarity: 'common',
    unlocked: false,
    unlockCriteria: 'Complete all learning modules'
  }
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'uncommon':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'rare':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'epic':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'legendary':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getBadgeImage = (imageUrl: string) => {
  // Use the LearnWeb3 badges image for all badge types
  return '/attached_assets/IMG_9299.png';
};

interface DomainBadgesProps {
  userId: number;
}

const DomainBadges: React.FC<DomainBadgesProps> = ({ userId }) => {
  // In a real implementation, we'd fetch badges related to the user's domains
  // For now, we'll use the mock data
  const userBadges = badges;
  
  const categories = ['all', 'achievement', 'benefit', 'verification', 'community', 'education'];
  const [activeCategory, setActiveCategory] = React.useState('all');
  
  const filteredBadges = React.useMemo(() => {
    if (activeCategory === 'all') return userBadges;
    return userBadges.filter(badge => badge.category === activeCategory);
  }, [activeCategory, userBadges]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Domain Badges</CardTitle>
        <CardDescription>
          Special achievements and benefits unlocked with your Unstoppable Domains
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="w-full overflow-x-auto flex justify-start pl-1 pr-1">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="capitalize text-xs px-3"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <ScrollArea className="h-80 mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBadges.map((badge) => (
                <TooltipProvider key={badge.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`relative p-4 rounded-lg border ${badge.unlocked ? '' : 'opacity-50'} transition-all duration-200 hover:border-primary hover:shadow-sm`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 mb-3">
                            <img 
                              src={getBadgeImage(badge.imageUrl)} 
                              alt={badge.name} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <h4 className="font-medium text-sm truncate w-full">{badge.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={`mt-2 text-xs capitalize ${getRarityColor(badge.rarity)}`}
                          >
                            {badge.rarity}
                          </Badge>
                        </div>
                        {!badge.unlocked && (
                          <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                            <span className="flex items-center p-1 rounded-md text-xs">
                              🔒
                            </span>
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <div className="space-y-2 p-2 max-w-xs">
                        <h4 className="font-bold">{badge.name}</h4>
                        <p className="text-sm">{badge.description}</p>
                        {!badge.unlocked && badge.unlockCriteria && (
                          <div className="mt-2 pt-2 border-t border-border">
                            <span className="text-xs font-medium">To unlock: {badge.unlockCriteria}</span>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DomainBadges;
