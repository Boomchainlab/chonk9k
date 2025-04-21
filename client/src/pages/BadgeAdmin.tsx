import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge as BadgeType, insertBadgeSchema } from '@shared/schema';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/Badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Extend the insert schema with client-side validation
const formSchema = insertBadgeSchema.extend({
  requirement: z.enum(['token_purchase', 'community_engagement', 'hodl_duration', 'special_event']),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),
  category: z.enum(['holder', 'trader', 'community', 'special'])
});

type FormValues = z.infer<typeof formSchema>;

export default function BadgeAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Define default values
  const defaultValues: Partial<FormValues> = {
    name: '',
    description: '',
    imageUrl: 'https://cryptologos.cc/logos/chonk-chonk-logo.svg', // Example default
    requirement: 'token_purchase',
    requirementValue: 1000,
    category: 'holder',
    rarity: 'common'
  };
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  
  // Query to fetch all badges
  const { data: badges, isLoading: isLoadingBadges } = useQuery({
    queryKey: ['/api/badges'],
    queryFn: async () => {
      // For demo purposes, return mock badges
      return [
        {
          id: 1,
          name: "Early Adopter",
          description: "One of the first to join the Chonk9k community",
          imageUrl: "https://cryptologos.cc/logos/chonk-chonk-logo.svg",
          requirement: "token_purchase",
          requirementValue: 1000,
          category: "holder",
          rarity: "uncommon",
          createdAt: new Date()
        },
        {
          id: 2,
          name: "Diamond Hands",
          description: "Held $CHONK tokens for more than 30 days",
          imageUrl: "https://cryptologos.cc/logos/maker-mkr-logo.svg",
          requirement: "hodl_duration",
          requirementValue: 30,
          category: "holder",
          rarity: "rare",
          createdAt: new Date()
        },
        {
          id: 5,
          name: "Launch Party",
          description: "Participated in the IDO launch event",
          imageUrl: "https://cryptologos.cc/logos/pancakeswap-cake-logo.svg",
          requirement: "special_event",
          requirementValue: 1,
          category: "special",
          rarity: "legendary",
          createdAt: new Date()
        }
      ] as BadgeType[];
    }
  });
  
  // Mutation to create a new badge
  const createBadgeMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // For demo purposes, simulate a successful badge creation
      return {
        ...data,
        id: Math.floor(Math.random() * 1000) + 10,
        createdAt: new Date()
      } as BadgeType;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/badges'] });
      
      // Reset form
      form.reset(defaultValues);
      
      // Show success toast
      toast({
        title: 'Badge Created',
        description: 'The badge has been successfully created.',
      });
    },
    onError: (error) => {
      console.error('Error creating badge:', error);
      toast({
        title: 'Failed to Create Badge',
        description: 'There was an error creating the badge. Please try again.',
        variant: 'destructive'
      });
    }
  });
  
  // Handle form submission
  function onSubmit(data: FormValues) {
    createBadgeMutation.mutate(data);
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Badge Administration</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Badge Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Badge</CardTitle>
            <CardDescription>Add a new badge to the community rewards system</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badge Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Diamond Hands" {...field} />
                      </FormControl>
                      <FormDescription>A short, catchy name for the badge</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Awarded to community members who hold tokens for an extended period."
                          className="min-h-24" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Explain how to earn this badge</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/badge-image.png" {...field} />
                      </FormControl>
                      <FormDescription>URL for the badge image (SVG or PNG recommended)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="holder">Holder</SelectItem>
                            <SelectItem value="trader">Trader</SelectItem>
                            <SelectItem value="community">Community</SelectItem>
                            <SelectItem value="special">Special</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Badge classification</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rarity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rarity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select rarity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="common">Common</SelectItem>
                            <SelectItem value="uncommon">Uncommon</SelectItem>
                            <SelectItem value="rare">Rare</SelectItem>
                            <SelectItem value="epic">Epic</SelectItem>
                            <SelectItem value="legendary">Legendary</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Badge rarity level</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="requirement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requirement Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select requirement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="token_purchase">Token Purchase</SelectItem>
                            <SelectItem value="community_engagement">Community Engagement</SelectItem>
                            <SelectItem value="hodl_duration">HODL Duration</SelectItem>
                            <SelectItem value="special_event">Special Event</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>What users need to do</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="requirementValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requirement Value</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            step={1} 
                            placeholder="1000"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Threshold needed to earn badge</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createBadgeMutation.isPending}
                >
                  {createBadgeMutation.isPending ? 'Creating...' : 'Create Badge'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Existing Badges Display */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Badges</CardTitle>
            <CardDescription>Currently available community badges</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingBadges ? (
              <div className="text-center py-8 text-muted-foreground">Loading badges...</div>
            ) : !badges || badges.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No badges created yet.</p>
                <p className="text-sm mt-2">Create your first badge using the form.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {badges.map(badge => (
                  <Badge key={badge.id} badge={badge} earned={true} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}