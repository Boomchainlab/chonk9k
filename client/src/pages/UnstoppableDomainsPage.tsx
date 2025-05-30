import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnstoppableDomains from '@/components/UnstoppableDomains';
import DomainBadges from '@/components/DomainBadges';
import NFTCollectionGallery from '@/components/NFTCollectionGallery';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarIcon, CrownIcon, MessageSquareIcon, Trophy, Users, Gem, BarChart4 } from 'lucide-react';

const UnstoppableDomainsPage: React.FC = () => {
  // In a real app, you would fetch the current user
  const { data: currentUser } = useQuery<{ id: number }>({ queryKey: ['/api/user'] });
  const userId = currentUser?.id || 1; // fallback for development

  return (
    <>
      <div className="container py-8">
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Unstoppable Domains</h1>
            <p className="text-muted-foreground">
              Manage your Unstoppable Domain NFTs and access exclusive benefits in the CHONK9K ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitCard 
              icon={<CrownIcon className="h-6 w-6" />}
              title="Premium Access"
              description="Gain exclusive access to premium features and content"
            />
            <BenefitCard 
              icon={<Trophy className="h-6 w-6" />}
              title="Enhanced Staking"
              description="Increased APY rates and special staking pools"
            />
            <BenefitCard 
              icon={<MessageSquareIcon className="h-6 w-6" />}
              title="Unique Username"
              description="Use your domain as your username across the platform"
            />
            <BenefitCard 
              icon={<Users className="h-6 w-6" />}
              title="DAO Governance"
              description="Special voting privileges in CHONK9K DAO proposals"
            />
          </div>
          
          <Tabs defaultValue="domains" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-auto p-1">
              <TabsTrigger value="domains" className="py-2">
                <div className="flex items-center space-x-2">
                  <Gem className="h-4 w-4" />
                  <span>My Domains</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="badges" className="py-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4" />
                  <span>Badges</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="collections" className="py-2">
                <div className="flex items-center space-x-2">
                  <BarChart4 className="h-4 w-4" />
                  <span>NFT Collections</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="domains" className="mt-6">
              <div className="rounded-xl border bg-card shadow">
                <div className="p-6">
                  <UnstoppableDomains userId={userId} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="badges" className="mt-6">
              <DomainBadges userId={userId} />
            </TabsContent>
            
            <TabsContent value="collections" className="mt-6">
              <div className="rounded-xl border bg-card shadow">
                <div className="p-6">
                  <NFTCollectionGallery userId={userId} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 p-2.5 rounded-full text-primary">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default UnstoppableDomainsPage;