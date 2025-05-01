import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NftCollectionCardProps {
  collection: {
    id: number;
    name: string;
    description: string;
    logo: string;
    url: string;
    trading_pair: string;
    status: string;
  };
}

const NftCollectionCard: React.FC<NftCollectionCardProps> = ({ collection }) => {
  return (
    <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md overflow-hidden bg-primary/10">
              <img 
                src={collection.logo} 
                alt={collection.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{collection.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs font-normal py-0">
                  {collection.trading_pair}
                </Badge>
                <Badge variant={collection.status === 'active' ? 'default' : 'outline'} className="text-xs py-0">
                  {collection.status === 'active' ? 'Live' : 'Coming Soon'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="min-h-[80px] text-sm text-muted-foreground">
          {collection.description}
        </CardDescription>
        
        {collection.name.includes('NFT') && (
          <div className="mt-4 p-3 rounded-md bg-primary/5 border border-primary/10">
            <h4 className="text-sm font-medium mb-2">NFT Utilities:</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
              <li>Exclusive Chonk9k staking boosts</li>
              <li>Community governance voting rights</li>
              <li>Priority access to new Chonk features</li>
              <li>Special mining rig availability</li>
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.open(collection.url, '_blank')}
          className="gap-1.5"
        >
          View Collection <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NftCollectionCard;