import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

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

interface DomainBenefitAdminProps {
  domainId: number;
}

const benefitTypes = [
  { value: 'staking_boost', label: 'Staking Boost' },
  { value: 'trivia_boost', label: 'Trivia Boost' },
  { value: 'mining_boost', label: 'Mining Boost' },
  { value: 'spin_boost', label: 'Spin Wheel Boost' },
  { value: 'token_discount', label: 'Token Discount' },
  { value: 'early_access', label: 'Early Access' },
  { value: 'governance_boost', label: 'Governance Boost' },
  { value: 'referral_boost', label: 'Referral Bonus' },
];

const DomainBenefitAdmin: React.FC<DomainBenefitAdminProps> = ({ domainId }) => {
  const [benefitType, setBenefitType] = useState('');
  const [benefitValue, setBenefitValue] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch domain info
  const { data: domain, isLoading: domainLoading } = useQuery({
    queryKey: [`/api/unstoppable-domains/${domainId}`],
    enabled: !!domainId
  });
  
  // Fetch domain benefits
  const { data: benefits, isLoading: benefitsLoading } = useQuery({
    queryKey: [`/api/unstoppable-domains/${domainId}/benefits`],
    enabled: !!domainId
  });
  
  // Add benefit mutation
  const addBenefitMutation = useMutation({
    mutationFn: async (benefitData: any) => {
      return await apiRequest('POST', `/api/unstoppable-domains/${domainId}/benefits`, benefitData);
    },
    onSuccess: () => {
      toast({
        title: 'Benefit Added!',
        description: 'The domain benefit has been added successfully.',
      });
      resetForm();
      queryClient.invalidateQueries({ queryKey: [`/api/unstoppable-domains/${domainId}/benefits`] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Add Benefit',
        description: error?.message || 'Failed to add domain benefit. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  const resetForm = () => {
    setBenefitType('');
    setBenefitValue('');
    setDescription('');
    setStartDate(new Date());
    setEndDate(undefined);
    setIsActive(true);
  };
  
  const handleAddBenefit = () => {
    if (!benefitType || !benefitValue || !description) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate benefit value is a number
    const numValue = parseFloat(benefitValue);
    if (isNaN(numValue)) {
      toast({
        title: 'Invalid Value',
        description: 'Benefit value must be a number.',
        variant: 'destructive',
      });
      return;
    }
    
    addBenefitMutation.mutate({
      domainId,
      benefitType,
      benefitValue: numValue,
      description,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      isActive
    });
  };
  
  if (domainLoading) return <div className="p-4">Loading domain information...</div>;
  if (!domain) return <div className="p-4 text-red-500">Domain not found</div>;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{domain.domainName}</h2>
          <p className="text-muted-foreground">
            Manage the benefits for this Unstoppable Domain
          </p>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Benefit</CardTitle>
          <CardDescription>
            Create a new benefit for this Unstoppable Domain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="benefit-type">Benefit Type</Label>
              <Select value={benefitType} onValueChange={setBenefitType}>
                <SelectTrigger id="benefit-type">
                  <SelectValue placeholder="Select benefit type" />
                </SelectTrigger>
                <SelectContent>
                  {benefitTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="benefit-value">Value</Label>
              <Input
                id="benefit-value"
                type="number"
                placeholder="e.g. 5, 10, 15"
                value={benefitValue}
                onChange={(e) => setBenefitValue(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the benefit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => (
                      startDate ? date < startDate : false
                    )}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is-active">Active</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetForm}>
            Reset
          </Button>
          <Button
            onClick={handleAddBenefit}
            disabled={addBenefitMutation.isPending}
          >
            {addBenefitMutation.isPending ? 'Adding...' : 'Add Benefit'}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="py-4">
        <h3 className="text-xl font-semibold mb-4">Current Benefits</h3>
        
        {benefitsLoading ? (
          <div className="p-4">Loading benefits...</div>
        ) : !benefits || benefits.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted/50">
            <p>No benefits have been added to this domain yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {benefits.map((benefit: Benefit) => (
              <Card key={benefit.id} className={!benefit.isActive ? 'opacity-60' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      {benefitTypes.find(t => t.value === benefit.benefitType)?.label || benefit.benefitType}
                    </CardTitle>
                    <Badge variant="outline">
                      {benefit.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Value:</span>
                      <span>{benefit.benefitValue}%</span>
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                    {(benefit.startDate || benefit.endDate) && (
                      <div className="pt-2 text-sm text-muted-foreground">
                        {benefit.startDate && (
                          <span>From: {new Date(benefit.startDate).toLocaleDateString()}</span>
                        )}
                        {benefit.startDate && benefit.endDate && ' • '}
                        {benefit.endDate && (
                          <span>To: {new Date(benefit.endDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainBenefitAdmin;