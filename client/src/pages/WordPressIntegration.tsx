import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const WordPressIntegration: React.FC = () => {
  const [embedType, setEmbedType] = useState('mood');
  const [width, setWidth] = useState('300px');
  const [height, setHeight] = useState('400px');
  const { toast } = useToast();
  
  interface EmbedResponse {
    iframeCode: string;
    shortcode: string;
    embedUrl: string;
  }
  
  interface ResourceResponse {
    phpCode: string;
    baseUrl: string;
  }
  
  // Fetch embed code
  const { data: embedData, isLoading: isEmbedLoading } = useQuery<EmbedResponse>({
    queryKey: [`/api/wordpress/embed?type=${embedType}&width=${width}&height=${height}`],
    staleTime: 60000,
  });
  
  // Fetch WordPress plugin resources
  const { data: resourceData, isLoading: isResourceLoading } = useQuery<ResourceResponse>({
    queryKey: ['/api/wordpress/embed-resources'],
    staleTime: Infinity, // This doesn't change often
  });
  
  const copyToClipboard = (text: string, successMessage: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: successMessage,
      });
    }).catch(err => {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually.",
        variant: "destructive"
      });
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
        WordPress Integration
      </h1>
      
      <p className="text-lg mb-8">
        Integrate the CHONK9K token mood indicators and pricing widgets into your WordPress site
        with these easy-to-use embed options.
      </p>
      
      <Tabs defaultValue="iframe" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="iframe">iFrame Embed</TabsTrigger>
          <TabsTrigger value="shortcode">WordPress Shortcode</TabsTrigger>
          <TabsTrigger value="plugin">WordPress Plugin</TabsTrigger>
        </TabsList>
        
        <TabsContent value="iframe" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>iFrame Embed Code</CardTitle>
              <CardDescription>
                Copy this HTML code and paste it into your WordPress page or post in the HTML/Text mode.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="embedType">Widget Type</Label>
                    <select 
                      id="embedType"
                      className="w-full p-2 border rounded-md mt-1"
                      value={embedType}
                      onChange={(e) => setEmbedType(e.target.value)}
                    >
                      <option value="mood">Mood Indicator</option>
                      <option value="price">Price Tracker</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="width">Width</Label>
                    <Input 
                      id="width" 
                      value={width} 
                      onChange={(e) => setWidth(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input 
                      id="height" 
                      value={height} 
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="iframeCode">HTML Code</Label>
                  <div className="relative">
                    <textarea 
                      id="iframeCode"
                      rows={6}
                      className="w-full p-3 font-mono text-sm border rounded-md bg-muted"
                      readOnly
                      value={embedData?.iframeCode || 'Loading...'}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => embedData?.iframeCode && copyToClipboard(embedData.iframeCode, "HTML code copied to clipboard!")}
                      disabled={isEmbedLoading || !embedData?.iframeCode}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Preview</h3>
                  <div className="border rounded-md p-4 flex justify-center items-center bg-card">
                    {embedData?.embedUrl ? (
                      <iframe 
                        src={embedData.embedUrl}
                        width={width}
                        height={height}
                        title={`CHONK9K ${embedType} Widget`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                      />
                    ) : (
                      <div className="text-muted-foreground">Loading preview...</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shortcode" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>WordPress Shortcode</CardTitle>
              <CardDescription>
                Use this shortcode in your WordPress posts and pages after installing the CHONK9K Integration plugin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="shortcodeType">Widget Type</Label>
                    <select 
                      id="shortcodeType"
                      className="w-full p-2 border rounded-md mt-1"
                      value={embedType}
                      onChange={(e) => setEmbedType(e.target.value)}
                    >
                      <option value="mood">Mood Indicator</option>
                      <option value="price">Price Tracker</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="shortcodeWidth">Width</Label>
                    <Input 
                      id="shortcodeWidth" 
                      value={width} 
                      onChange={(e) => setWidth(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shortcodeHeight">Height</Label>
                    <Input 
                      id="shortcodeHeight" 
                      value={height} 
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="shortcode">Shortcode</Label>
                  <div className="relative">
                    <textarea 
                      id="shortcode"
                      rows={2}
                      className="w-full p-3 font-mono text-sm border rounded-md bg-muted"
                      readOnly
                      value={embedData?.shortcode || 'Loading...'}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => embedData?.shortcode && copyToClipboard(embedData.shortcode, "Shortcode copied to clipboard!")}
                      disabled={isEmbedLoading || !embedData?.shortcode}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <Alert className="mt-4">
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>
                    To use shortcodes, you'll need to install the CHONK9K Integration plugin on your WordPress site.
                    See the "WordPress Plugin" tab for instructions.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plugin" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>WordPress Plugin</CardTitle>
              <CardDescription>
                Install this custom plugin on your WordPress site to enable shortcodes and advanced integration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Plugin Installation Instructions</h3>
                  <ol className="list-decimal ml-6 space-y-2">
                    <li>Copy the PHP code below</li>
                    <li>In your WordPress admin, go to <strong>Plugins → Add New → Upload Plugin</strong></li>
                    <li>Or create a new file called <code>chonk9k-integration.php</code> in your <code>wp-content/plugins/</code> directory</li>
                    <li>Paste the code into this file</li>
                    <li>Activate the plugin from the WordPress dashboard</li>
                  </ol>
                </div>
                
                <div>
                  <Label htmlFor="phpCode">PHP Plugin Code</Label>
                  <div className="relative">
                    <textarea 
                      id="phpCode"
                      rows={20}
                      className="w-full p-3 font-mono text-sm border rounded-md bg-muted"
                      readOnly
                      value={resourceData?.phpCode || 'Loading...'}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => resourceData?.phpCode && copyToClipboard(resourceData.phpCode, "Plugin code copied to clipboard!")}
                      disabled={isResourceLoading || !resourceData?.phpCode}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <Alert>
                  <AlertTitle>Usage</AlertTitle>
                  <AlertDescription>
                    Once the plugin is activated, you can use the <code>[chonk9k_embed]</code> shortcode anywhere on your WordPress site.
                    You can customize the widget with these attributes: <code>type</code>, <code>width</code>, and <code>height</code>.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Examples:</h4>
                  <p className="mb-2"><code>[chonk9k_embed]</code> - Default mood widget</p>
                  <p className="mb-2"><code>[chonk9k_embed type="price" width="400px" height="300px"]</code> - Price widget with custom size</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WordPressIntegration;
