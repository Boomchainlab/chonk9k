import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type Benefit = {
  id: number;
  domainId: number;
  benefitType: string;
  benefitValue: number;
  description: string;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
};

interface DomainBenefitsProps {
  domainId: number;
}

const getBenefitColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'staking_boost':
      return 'bg-blue-500/20 text-blue-600 border-blue-500';
    case 'trivia_boost':
      return 'bg-purple-500/20 text-purple-600 border-purple-500';
    case 'mining_boost':
      return 'bg-amber-500/20 text-amber-600 border-amber-500';
    case 'spin_boost':
      return 'bg-green-500/20 text-green-600 border-green-500';
    case 'token_discount':
      return 'bg-pink-500/20 text-pink-600 border-pink-500';
    default:
      return 'bg-gray-500/20 text-gray-600 border-gray-500';
  }
};

const getBenefitIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'staking_boost':
      return '📈';
    case 'trivia_boost':
      return '🧠';
    case 'mining_boost':
      return '⛏️';
    case 'spin_boost':
      return '🎡';
    case 'token_discount':
      return '💰';
    default:
      return '🎁';
  }
};

const formatBenefitType = (type: string) => {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const getValueDisplay = (type: string, value: number) => {
  switch (type.toLowerCase()) {
    case 'staking_boost':
    case 'mining_boost':
    case 'trivia_boost':
    case 'spin_boost':
      return `+${value}%`;
    case 'token_discount':
      return `-${value}%`;
    default:
      return `${value}`;
  }
};

const DomainBenefits: React.FC<DomainBenefitsProps> = ({ domainId }) => {
  const { data: benefits, isLoading, error } = useQuery({
    queryKey: [`/api/unstoppable-domains/${domainId}/benefits`],
    enabled: !!domainId
  });
  
  if (isLoading) return <div className="p-4">Loading benefits...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading benefits</div>;
  
  if (!benefits || benefits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Domain Benefits</CardTitle>
          <CardDescription>
            This domain doesn't have any active benefits yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Domain Benefits</CardTitle>
        <CardDescription>
          Special benefits you receive with this Unstoppable Domain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {benefits.map((benefit: Benefit) => (
            <div 
              key={benefit.id} 
              className="flex items-start space-x-3 p-3 rounded-md border"
            >
              <div className="text-2xl">{getBenefitIcon(benefit.benefitType)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{formatBenefitType(benefit.benefitType)}</h4>
                  <Badge 
                    variant="outline" 
                    className={`${getBenefitColor(benefit.benefitType)} ${!benefit.isActive ? 'opacity-50' : ''}`}
                  >
                    {getValueDisplay(benefit.benefitType, benefit.benefitValue)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
                
                {benefit.startDate && benefit.endDate && (
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{new Date(benefit.startDate).toLocaleDateString()}</span>
                      <span>{new Date(benefit.endDate).toLocaleDateString()}</span>
                    </div>
                    <Progress
                      value={calculateTimeProgress(benefit.startDate, benefit.endDate)}
                      className="h-1.5"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to calculate time progress percentage
const calculateTimeProgress = (startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();
  
  if (now <= start) return 0;
  if (now >= end) return 100;
  
  const total = end - start;
  const elapsed = now - start;
  return Math.round((elapsed / total) * 100);
};

export default DomainBenefits;