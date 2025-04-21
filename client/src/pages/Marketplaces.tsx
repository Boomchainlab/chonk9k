import { useQuery } from "@tanstack/react-query";
import { MarketplaceListing } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Marketplaces() {
  const isMobile = useIsMobile();
  
  const { data: marketplaces, isLoading } = useQuery({
    queryKey: ['/api/marketplace/listings'],
    refetchOnWindowFocus: false,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">$CHONK9K Token Marketplaces</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get your $CHONK9K tokens on these exchanges and marketplaces - supporting the vision of 
          <span className="font-bold text-primary"> David Okeamah</span>'s Chonk9k project.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden h-[350px]">
              <CardHeader className="pb-0">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full mt-4" />
                <Skeleton className="h-4 w-3/4 mt-2" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full mt-4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {marketplaces && marketplaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplaces.map((marketplace: MarketplaceListing) => (
                <Card key={marketplace.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden">
                          <img 
                            src={marketplace.logo} 
                            alt={`${marketplace.name} logo`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardTitle>{marketplace.name}</CardTitle>
                      </div>
                      <Badge variant={marketplace.status === 'active' ? 'default' : 'outline'}>
                        {marketplace.status === 'active' ? 'Active' : 'Coming Soon'}
                      </Badge>
                    </div>
                    <CardDescription>
                      Listed on {new Date(marketplace.listedDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <span className="font-semibold">Trading Pair:</span> {marketplace.tradingPair}
                    </div>
                    <p className="text-muted-foreground">{marketplace.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => window.open(marketplace.url, '_blank')}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Trade on {marketplace.name}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Coming Soon!</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're currently working on listing $CHONK9K on multiple exchanges. 
                Check back soon for updates on where you can buy and trade your tokens.
              </p>
            </div>
          )}
          
          <div className="mt-16 bg-muted rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Are you an exchange or marketplace?</h2>
            <p className="text-lg mb-6 max-w-3xl mx-auto">
              Interested in listing $CHONK9K on your platform? We're looking to partner with reputable exchanges 
              to increase liquidity and availability of our token.
            </p>
            <Button size="lg" variant="default" onClick={() => window.location.href = "mailto:contact@chonk9k.io"}>
              Contact Us to List $CHONK9K
            </Button>
          </div>
        </>
      )}
    </div>
  );
}