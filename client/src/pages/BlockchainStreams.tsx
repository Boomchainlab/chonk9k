import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Link } from 'wouter';
import quickNodeStreamService, { StreamConfig } from '@/lib/quickNodeStreamService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Play, Pause, Plus, Trash2, RefreshCw, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema for stream creation form
const streamFormSchema = z.object({
  name: z.string().min(3, { message: 'Stream name must be at least 3 characters' }),
  network: z.string().min(1, { message: 'Please select a network' }),
  dataset: z.string().min(1, { message: 'Please select a dataset' }),
  webhookUrl: z.string().url({ message: 'Please enter a valid webhook URL' }),
  isActive: z.boolean().default(true)
});

type StreamFormValues = z.infer<typeof streamFormSchema>;

const BlockchainStreams: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('ethereum');

  // Form setup for stream creation
  const form = useForm<StreamFormValues>({
    resolver: zodResolver(streamFormSchema),
    defaultValues: {
      name: '',
      network: 'ethereum-mainnet',
      dataset: 'block',
      webhookUrl: '',
      isActive: true
    }
  });

  // Query to fetch all streams
  const { data: streamsData, isLoading: isLoadingStreams, error: streamsError, refetch: refetchStreams } = 
    useQuery<any>({
      queryKey: ['quicknode-streams'],
      queryFn: async () => {
        try {
          return await quickNodeStreamService.listStreams();
        } catch (error) {
          console.error('Error fetching streams:', error);
          return { streams: [] };
        }
      },
      enabled: quickNodeStreamService.isConfigured()
    });
    
  // Query to fetch selected stream details
  const { data: streamDetails, isLoading: isLoadingDetails } = 
    useQuery<any>({
      queryKey: ['quicknode-stream', selectedStream?.id],
      queryFn: () => quickNodeStreamService.getStream(selectedStream?.id),
      enabled: !!selectedStream?.id
    });
  
  // Mutation to create a new stream
  const createStreamMutation = useMutation({
    mutationFn: async (formData: StreamFormValues) => {
      if (formData.network.includes('ethereum')) {
        return await quickNodeStreamService.createEthereumBlockMonitor(
          formData.webhookUrl,
          formData.name
        );
      } else if (formData.network.includes('solana')) {
        return await quickNodeStreamService.createSolanaBlockMonitor(
          formData.webhookUrl,
          formData.name
        );
      }
    },
    onSuccess: () => {
      toast({
        title: 'Stream created successfully',
        description: 'Your blockchain data stream has been created.',
      });
      setIsCreateDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['quicknode-streams'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create stream',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Mutation to delete a stream
  const deleteStreamMutation = useMutation({
    mutationFn: (streamId: string) => quickNodeStreamService.deleteStream(streamId),
    onSuccess: () => {
      toast({
        title: 'Stream deleted',
        description: 'The blockchain data stream has been deleted.',
      });
      setSelectedStream(null);
      queryClient.invalidateQueries({ queryKey: ['quicknode-streams'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete stream',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Mutation to update a stream's status
  const updateStreamStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'active' | 'paused' }) => {
      return quickNodeStreamService.updateStream(id, { status });
    },
    onSuccess: () => {
      toast({
        title: 'Stream status updated',
        description: 'The stream status has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['quicknode-streams'] });
      if (selectedStream) {
        queryClient.invalidateQueries({ queryKey: ['quicknode-stream', selectedStream.id] });
      }
    },
    onError: (error) => {
      toast({
        title: 'Failed to update stream status',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Filter streams by network
  const filteredStreams = streamsData?.streams?.filter((stream: any) => {
    if (activeTab === 'ethereum') {
      return stream.network.includes('ethereum');
    } else if (activeTab === 'solana') {
      return stream.network.includes('solana');
    }
    return true;
  }) || [];

  // Handle form submission
  const onSubmit = (values: StreamFormValues) => {
    createStreamMutation.mutate(values);
  };

  // Check if QuickNode is configured
  const isQuickNodeConfigured = quickNodeStreamService.isConfigured();

  // If QuickNode API key is not configured, show setup instructions
  if (!isQuickNodeConfigured) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">QuickNode Blockchain Streams</h1>
              <p className="text-muted-foreground">Real-time blockchain data monitoring for CHONK9K</p>
            </div>
            <Link href="/solana-monitor">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Monitor
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>QuickNode API Setup Required</CardTitle>
              <CardDescription>You need to configure your QuickNode API key to use blockchain streams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  QuickNode Streams API allows you to stream real-time blockchain data from Ethereum 
                  and Solana networks, providing enhanced monitoring for the CHONK9K token.
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Setup Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Create a QuickNode account at <a href="https://quicknode.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">QuickNode.com</a></li>
                    <li>Generate an API key from your QuickNode dashboard</li>
                    <li>Add the API key to your project's environment variables as <code className="bg-background rounded px-1">VITE_QUICKNODE_API_KEY</code></li>
                  </ol>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="https://www.quicknode.com/endpoints/streams" target="_blank" rel="noopener noreferrer">
                  Learn More About QuickNode Streams
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">QuickNode Blockchain Streams</h1>
            <p className="text-muted-foreground">Real-time blockchain data monitoring for CHONK9K</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => refetchStreams()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Link href="/solana-monitor">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Monitor
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Data Streams</span>
                  <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Stream
                  </Button>
                </CardTitle>
                <CardDescription>Active blockchain data monitoring streams</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
                    <TabsTrigger value="solana">Solana</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ethereum" className="pt-4">
                    {isLoadingStreams ? (
                      <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ) : streamsError ? (
                      <div className="text-destructive text-center py-4">
                        Failed to load streams
                      </div>
                    ) : filteredStreams.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No Ethereum streams found
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredStreams.map((stream: any) => (
                          <div 
                            key={stream.id}
                            onClick={() => setSelectedStream(stream)}
                            className={`p-3 border rounded-md cursor-pointer transition-colors hover:bg-muted ${selectedStream?.id === stream.id ? 'border-primary bg-muted/50' : ''}`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium truncate">{stream.name}</span>
                              <Badge variant={stream.status === 'active' ? 'default' : 'secondary'}>
                                {stream.status === 'active' ? 'Active' : 'Paused'}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {stream.network} • {stream.dataset}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="solana" className="pt-4">
                    {isLoadingStreams ? (
                      <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ) : streamsError ? (
                      <div className="text-destructive text-center py-4">
                        Failed to load streams
                      </div>
                    ) : filteredStreams.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No Solana streams found
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredStreams.map((stream: any) => (
                          <div 
                            key={stream.id}
                            onClick={() => setSelectedStream(stream)}
                            className={`p-3 border rounded-md cursor-pointer transition-colors hover:bg-muted ${selectedStream?.id === stream.id ? 'border-primary bg-muted/50' : ''}`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium truncate">{stream.name}</span>
                              <Badge variant={stream.status === 'active' ? 'default' : 'secondary'}>
                                {stream.status === 'active' ? 'Active' : 'Paused'}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {stream.network} • {stream.dataset}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            {selectedStream ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedStream.name}</CardTitle>
                      <CardDescription>{selectedStream.network} • {selectedStream.dataset}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {selectedStream.status === 'active' ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateStreamStatusMutation.mutate({ id: selectedStream.id, status: 'paused' })}
                          disabled={updateStreamStatusMutation.isPending}
                        >
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateStreamStatusMutation.mutate({ id: selectedStream.id, status: 'active' })}
                          disabled={updateStreamStatusMutation.isPending}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Activate
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteStreamMutation.mutate(selectedStream.id)}
                        disabled={deleteStreamMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingDetails ? (
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-40 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : streamDetails ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Stream Details</h3>
                          <div className="p-3 bg-muted rounded-md">
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <span className="text-muted-foreground">Status:</span>
                              <span className="col-span-2">
                                <Badge variant={streamDetails.status === 'active' ? 'default' : 'secondary'}>
                                  {streamDetails.status === 'active' ? 'Active' : 'Paused'}
                                </Badge>
                              </span>
                              
                              <span className="text-muted-foreground">Created:</span>
                              <span className="col-span-2">
                                {new Date(streamDetails.created_at).toLocaleString()}
                              </span>
                              
                              <span className="text-muted-foreground">Region:</span>
                              <span className="col-span-2">{streamDetails.region}</span>
                              
                              <span className="text-muted-foreground">ID:</span>
                              <span className="col-span-2 truncate" title={streamDetails.id}>
                                {streamDetails.id}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Destination</h3>
                          <div className="p-3 bg-muted rounded-md">
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <span className="text-muted-foreground">Type:</span>
                              <span className="col-span-2">{streamDetails.destination}</span>
                              
                              <span className="text-muted-foreground">URL:</span>
                              <span className="col-span-2 truncate" title={streamDetails.destination_attributes?.url}>
                                {streamDetails.destination_attributes?.url}
                              </span>
                              
                              <span className="text-muted-foreground">Max Retry:</span>
                              <span className="col-span-2">
                                {streamDetails.destination_attributes?.max_retry || 'N/A'}
                              </span>
                              
                              <span className="text-muted-foreground">Timeout:</span>
                              <span className="col-span-2">
                                {streamDetails.destination_attributes?.post_timeout_sec || 'N/A'} sec
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Filter Function</h3>
                        <div className="p-3 bg-muted rounded-md">
                          <pre className="text-xs overflow-auto whitespace-pre-wrap">
                            {atob(streamDetails.filter_function)}
                          </pre>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Stream Analytics</h3>
                        <div className="p-3 bg-muted rounded-md text-sm">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-muted-foreground text-xs">Processed</div>
                              <div className="font-medium">{streamDetails.analytics?.processed || 0}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground text-xs">Delivered</div>
                              <div className="font-medium">{streamDetails.analytics?.delivered || 0}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground text-xs">Failed</div>
                              <div className="font-medium">{streamDetails.analytics?.failed || 0}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground text-xs">Last Delivery</div>
                              <div className="font-medium">
                                {streamDetails.analytics?.last_delivered_at ? 
                                  new Date(streamDetails.analytics.last_delivered_at).toLocaleString() : 'Never'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Failed to load stream details
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Stream Details</CardTitle>
                  <CardDescription>Select a stream to view its details or create a new one</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="bg-muted inline-flex p-6 rounded-full">
                      <RefreshCw className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium">No Stream Selected</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Select a stream from the list or create a new one to monitor blockchain data in real-time
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Stream
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Create Stream Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Blockchain Stream</DialogTitle>
            <DialogDescription>
              Configure a new QuickNode stream to monitor blockchain data in real-time
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stream Name</FormLabel>
                    <FormControl>
                      <Input placeholder="CHONK9K Block Monitor" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for your blockchain data stream
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="network"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blockchain Network</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a network" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ethereum-mainnet">Ethereum Mainnet</SelectItem>
                        <SelectItem value="ethereum-sepolia">Ethereum Sepolia</SelectItem>
                        <SelectItem value="base-mainnet">Base Mainnet</SelectItem>
                        <SelectItem value="optimism-mainnet">Optimism Mainnet</SelectItem>
                        <SelectItem value="solana-mainnet">Solana Mainnet</SelectItem>
                        <SelectItem value="solana-devnet">Solana Devnet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dataset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Set</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a dataset" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="block">Block Data</SelectItem>
                        <SelectItem value="transaction">Transaction Data</SelectItem>
                        <SelectItem value="log">Log Data</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="webhookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Webhook URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-server.com/webhook" {...field} />
                    </FormControl>
                    <FormDescription>
                      The URL where blockchain data will be sent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Activate Stream</FormLabel>
                      <FormDescription>
                        Stream will start processing data immediately if enabled
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createStreamMutation.isPending}
                >
                  {createStreamMutation.isPending ? "Creating..." : "Create Stream"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlockchainStreams;
