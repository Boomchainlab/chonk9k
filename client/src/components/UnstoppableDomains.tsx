import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import DomainDetailsModal from './DomainDetailsModal';

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

interface UnstoppableDomainsProps {
  userId: number;
}

const UnstoppableDomains: React.FC<UnstoppableDomainsProps> = ({ userId }) => {
  const [newDomain, setNewDomain] = useState('');
  const [newTokenId, setNewTokenId] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum');
  const [useAsUsername, setUseAsUsername] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch user's domains
  const { data: domains, isLoading, error } = useQuery({
    queryKey: [`/api/users/${userId}/unstoppable-domains`],
    enabled: !!userId
  });
  
  // Register new domain mutation
  const registerDomainMutation = useMutation({
    mutationFn: async (domainData: { userId: number; domainName: string; tokenId: string; network: string }) => {
      return await apiRequest('POST', '/api/unstoppable-domains', domainData);
    },
    onSuccess: () => {
      toast({
        title: 'Domain Registered!',
        description: 'Your Unstoppable Domain has been registered successfully.',
      });
      setNewDomain('');
      setNewTokenId('');
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/unstoppable-domains`] });
    },
    onError: (error: any) => {
      toast({
        title: 'Registration Failed',
        description: error?.message || 'Failed to register domain. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Verify domain mutation
  const verifyDomainMutation = useMutation({
    mutationFn: async (domainId: number) => {
      return await apiRequest('POST', `/api/unstoppable-domains/${domainId}/verify`, {});
    },
    onSuccess: () => {
      toast({
        title: 'Domain Verified!',
        description: 'Your domain has been verified successfully.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/unstoppable-domains`] });
    },
    onError: (error: any) => {
      toast({
        title: 'Verification Failed',
        description: error?.message || 'Failed to verify domain. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Update user preference mutation
  const updatePreferenceMutation = useMutation({
    mutationFn: async (useAsUsername: boolean) => {
      return await apiRequest('PATCH', `/api/users/${userId}/unstoppable-domain-preference`, { useAsUsername });
    },
    onSuccess: () => {
      toast({
        title: 'Preference Updated',
        description: useAsUsername ? 'Your domains will now be used as your username.' : 'Your domains will not be used as your username.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error?.message || 'Failed to update preference. Please try again.',
        variant: 'destructive',
      });
      // Reset switch to previous state
      setUseAsUsername(!useAsUsername);
    }
  });
  
  const handleRegisterDomain = () => {
    if (!newDomain || !newTokenId) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both a domain name and token ID.',
        variant: 'destructive',
      });
      return;
    }
    
    registerDomainMutation.mutate({
      userId,
      domainName: newDomain,
      tokenId: newTokenId,
      network: selectedNetwork
    });
  };
  
  const handleVerifyDomain = (domainId: number) => {
    verifyDomainMutation.mutate(domainId);
  };
  
  const handlePreferenceChange = () => {
    const newValue = !useAsUsername;
    setUseAsUsername(newValue);
    updatePreferenceMutation.mutate(newValue);
  };
  
  if (isLoading) return <div className="p-4">Loading domains...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading domains</div>;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Unstoppable Domains</h2>
        <div className="flex items-center space-x-2">
          <Switch
            id="use-domain-username"
            checked={useAsUsername}
            onCheckedChange={handlePreferenceChange}
          />
          <Label htmlFor="use-domain-username">Use as username</Label>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Register New Domain</CardTitle>
          <CardDescription>
            Register your Unstoppable Domain NFTs to access special benefits in the CHONK9K ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="domain-name">Domain Name</Label>
                <Input
                  id="domain-name"
                  placeholder="yourdomain.crypto"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token-id">Token ID</Label>
                <Input
                  id="token-id"
                  placeholder="0x123..."
                  value={newTokenId}
                  onChange={(e) => setNewTokenId(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Network</Label>
              <div className="flex gap-2">
                {['Ethereum', 'Polygon', 'Solana'].map((network) => (
                  <Button
                    key={network}
                    type="button"
                    variant={selectedNetwork === network ? 'default' : 'outline'}
                    onClick={() => setSelectedNetwork(network)}
                  >
                    {network}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleRegisterDomain} 
            disabled={registerDomainMutation.isPending}
          >
            {registerDomainMutation.isPending ? 'Registering...' : 'Register Domain'}
          </Button>
        </CardFooter>
      </Card>
      
      <h3 className="text-xl font-semibold">Your Domains</h3>
      
      {!domains || domains.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p>You haven't registered any Unstoppable Domains yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Register your domains above to unlock special benefits in the CHONK9K ecosystem.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain: Domain) => (
            <Card key={domain.id} className={domain.verified ? 'border-green-500/50 hover:border-green-600/70' : 'hover:border-primary/50'} style={{ cursor: 'pointer' }}>
              <DomainDetailsModal domain={domain}>
                <div className="w-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg break-all">{domain.domainName}</CardTitle>
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
                    <CardDescription>Network: {domain.network}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm">
                      <span className="font-medium">Token ID:</span>{' '}
                      <span className="text-muted-foreground break-all">{domain.tokenId}</span>
                    </div>
                    {domain.nftImageUrl && (
                      <div className="mt-2 rounded-md overflow-hidden">
                        <img 
                          src={domain.nftImageUrl} 
                          alt={domain.domainName} 
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()} asChild>
                      <a href={`https://opensea.io/assets/${domain.network.toLowerCase()}/${domain.tokenId}`} target="_blank" rel="noopener noreferrer">
                        View on OpenSea
                      </a>
                    </Button>
                    {!domain.verified && (
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerifyDomain(domain.id);
                        }}
                        disabled={verifyDomainMutation.isPending}
                      >
                        Verify
                      </Button>
                    )}
                  </CardFooter>
                </div>
              </DomainDetailsModal>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnstoppableDomains;