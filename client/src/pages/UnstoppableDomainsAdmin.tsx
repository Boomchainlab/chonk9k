import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DomainBenefitAdmin from '@/components/DomainBenefitAdmin';

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

const UnstoppableDomainsAdmin: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
  
  // This would be replaced with an actual admin endpoint that fetches all domains
  const { data: domains, isLoading } = useQuery({ queryKey: ['/api/unstoppable-domains/all'] });
  
  const filteredDomains = React.useMemo(() => {
    if (!domains) return [];
    if (!searchTerm) return domains;
    
    return domains.filter((domain: Domain) => 
      domain.domainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.tokenId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [domains, searchTerm]);
  
  return (
    <>
      
      <div className="container py-8">
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Unstoppable Domains Admin</h1>
            <p className="text-muted-foreground">
              Manage all Unstoppable Domain NFTs and benefits in the CHONK9K ecosystem.
            </p>
          </div>
          
          <div className="grid gap-6">
            <Tabs defaultValue="domains" className="space-y-6">
              <TabsList>
                <TabsTrigger value="domains">Domains</TabsTrigger>
                <TabsTrigger value="benefits" disabled={!selectedDomainId}>Benefits</TabsTrigger>
              </TabsList>
              
              <TabsContent value="domains" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Search Domains</CardTitle>
                    <CardDescription>
                      Find domains by name or token ID
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="search">Search</Label>
                      <Input
                        id="search"
                        placeholder="Enter domain name or token ID"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    {searchTerm ? `Search Results (${filteredDomains?.length || 0})` : 'All Domains'}
                  </h2>
                  
                  {isLoading ? (
                    <div className="text-center p-8">Loading domains...</div>
                  ) : !filteredDomains || filteredDomains.length === 0 ? (
                    <div className="text-center p-8 border rounded-lg bg-muted/50">
                      <p>No domains found{searchTerm && ' matching your search'}.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredDomains.map((domain: Domain) => (
                        <Card 
                          key={domain.id} 
                          className={`cursor-pointer hover:border-primary/50 ${selectedDomainId === domain.id ? 'border-primary' : ''}`}
                          onClick={() => setSelectedDomainId(domain.id)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg break-all">
                                  {domain.domainName}
                                </CardTitle>
                                <CardDescription>
                                  User ID: {domain.userId} • Network: {domain.network}
                                </CardDescription>
                              </div>
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
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="text-sm">
                              <span className="font-medium">Token ID:</span>{' '}
                              <span className="text-muted-foreground break-all">{domain.tokenId}</span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Created:</span>{' '}
                              <span className="text-muted-foreground">
                                {new Date(domain.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="benefits">
                {selectedDomainId ? (
                  <DomainBenefitAdmin domainId={selectedDomainId} />
                ) : (
                  <div className="text-center p-8 border rounded-lg bg-muted/50">
                    <p>Please select a domain first to manage its benefits.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnstoppableDomainsAdmin;