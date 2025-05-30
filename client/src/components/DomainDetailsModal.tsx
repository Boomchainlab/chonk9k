import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, NetworkIcon, Gem, Link, ExternalLink } from 'lucide-react';
import DomainBenefits from './DomainBenefits';

type Domain = {
  id: number;
  userId: number;
  domainName: string;
  tokenId: string;
  network: string;
  verified: boolean;
  nftImageUrl: string | null;
  metadata: any | null;
  createdAt: string;
};

interface DomainDetailsModalProps {
  domain: Domain;
  children: React.ReactNode;
}

const DomainDetailsModal: React.FC<DomainDetailsModalProps> = ({ domain, children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="break-all">{domain.domainName}</DialogTitle>
            {domain.verified ? (
              <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500">
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 border-yellow-500">
                Unverified
              </Badge>
            )}
          </div>
          <DialogDescription>
            Registered on {new Date(domain.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="font-medium">Network</div>
                <div className="text-muted-foreground">{domain.network}</div>
              </div>
              <div>
                <div className="font-medium">Status</div>
                <div className="text-muted-foreground">{domain.verified ? 'Verified' : 'Unverified'}</div>
              </div>
            </div>
            
            <div>
              <div className="font-medium">Token ID</div>
              <div className="text-muted-foreground break-all">{domain.tokenId}</div>
            </div>
            
            {domain.nftImageUrl && (
              <div className="pt-2">
                <div className="font-medium">NFT Image</div>
                <div className="mt-2 rounded-md overflow-hidden border">
                  <img 
                    src={domain.nftImageUrl} 
                    alt={domain.domainName} 
                    className="w-full h-48 object-contain bg-black/5"
                  />
                </div>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" asChild>
                <a 
                  href={`https://opensea.io/assets/${domain.network.toLowerCase()}/${domain.tokenId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View on OpenSea
                </a>
              </Button>
              
              <Button variant="outline" asChild>
                <a 
                  href={`https://${domain.domainName}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Visit Domain
                </a>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="benefits" className="space-y-4 pt-4">
            <DomainBenefits domainId={domain.id} />
          </TabsContent>
          
          <TabsContent value="metadata" className="space-y-4 pt-4">
            {domain.metadata ? (
              <div className="max-h-[400px] overflow-y-auto rounded-md bg-muted p-4">
                <pre className="text-xs whitespace-pre-wrap break-all">
                  {JSON.stringify(domain.metadata, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg bg-muted/50">
                <p>No metadata available for this domain.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DomainDetailsModal;