import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { insertMarketplaceListingSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MarketplaceListing } from "@shared/schema";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Pencil, ExternalLink, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Extend schema with custom validation
const formSchema = insertMarketplaceListingSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  url: z.string().url({ message: "Please enter a valid URL" }),
  logo: z.string().url({ message: "Please enter a valid logo URL" }),
  tradingPair: z.string().min(3, { message: "Trading pair is required" }),
  listedDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function MarketplaceAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Query for marketplace listings
  const { data: marketplaces, isLoading } = useQuery({
    queryKey: ['/api/marketplace/listings'],
  });

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      logo: "",
      description: "",
      tradingPair: "CHONK9K/USDT",
      status: "active",
      listedDate: new Date().toISOString().split('T')[0],
      sortOrder: 0,
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (values: FormValues) => 
      apiRequest('/api/marketplace/listings', { method: 'POST', body: values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/listings'] });
      form.reset();
      toast({
        title: "Marketplace listing created",
        description: "The exchange has been added to the marketplace listings.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating listing",
        description: "There was an error adding the marketplace. Please try again.",
        variant: "destructive",
      });
      console.error("Create error:", error);
    },
  });

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values);
  };
  
  // Edit handler
  const handleEdit = (listing: MarketplaceListing) => {
    setEditingId(listing.id);
    const formatted = {
      ...listing,
      listedDate: new Date(listing.listedDate).toISOString().split('T')[0],
    };
    form.reset(formatted);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Form */}
        <div className="md:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Marketplace Listing" : "Add New Marketplace Listing"}</CardTitle>
              <CardDescription>
                Add or update exchanges and marketplaces where $CHONK9K can be traded.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exchange/Marketplace Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Binance, Uniswap" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trading URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tradingPair"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trading Pair</FormLabel>
                        <FormControl>
                          <Input placeholder="CHONK9K/USDT" {...field} />
                        </FormControl>
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
                            placeholder="Brief description of the exchange or any special notes..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="coming_soon">Coming Soon</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="listedDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Listing Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      "Saving..."
                    ) : editingId ? (
                      "Update Marketplace"
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Marketplace
                      </>
                    )}
                  </Button>
                  
                  {editingId && (
                    <Button
                      type="button" 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => {
                        setEditingId(null);
                        form.reset({
                          name: "",
                          url: "",
                          logo: "",
                          description: "",
                          tradingPair: "CHONK9K/USDT",
                          status: "active",
                          listedDate: new Date().toISOString().split('T')[0],
                          sortOrder: 0,
                        });
                      }}
                    >
                      Cancel Editing
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        {/* Marketplace listings */}
        <div className="md:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Current Marketplace Listings</CardTitle>
              <CardDescription>
                Manage where $CHONK9K is available for trading
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="text-center py-8">Loading marketplaces...</div>
              ) : marketplaces && marketplaces.length > 0 ? (
                <div className="overflow-auto max-h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exchange</TableHead>
                        <TableHead>Pair</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {marketplaces.map((marketplace: MarketplaceListing) => (
                        <TableRow key={marketplace.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <img 
                                src={marketplace.logo} 
                                alt={marketplace.name}
                                className="w-6 h-6 rounded-sm object-cover"
                              />
                              {marketplace.name}
                            </div>
                          </TableCell>
                          <TableCell>{marketplace.tradingPair}</TableCell>
                          <TableCell>
                            <Badge variant={marketplace.status === 'active' ? 'default' : 'outline'}>
                              {marketplace.status === 'active' ? 'Active' : 'Coming Soon'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(marketplace)}
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(marketplace.url, '_blank')}
                                title="Visit"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No marketplace listings yet. Add your first exchange using the form.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}