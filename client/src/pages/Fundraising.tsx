import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import ChonkTokenLogo from "@/components/ChonkTokenLogo";
import { Badge } from "@/components/ui/badge";
import { Copy, Link, Share2, ExternalLink, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Fundraising() {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const walletAddress = "2Lp2SGS9AKYVKCorizjzJLPHn4swatnbvEQ2UB2bKorJy";
  const fundingGoal = 50000; // In USD
  const currentlyRaised = 12750; // Example amount
  const percentageRaised = (currentlyRaised / fundingGoal) * 100;
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast({
      title: "Address copied!",
      description: "The wallet address has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopied(false), 3000);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-4">
            Boomchainlab Youth Web3 Initiative <span className="animate-pulse">⚡</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Help us increase youth participation in web3 technology and blockchain education in our community.
            <a href="https://boomchainlabgravatar.link" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">boomchainlabgravatar.link</a>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                Building the next generation of web3 developers and enthusiasts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">About This Initiative</h3>
                  <p className="text-muted-foreground">
                    We aim to bridge the digital divide by introducing young people in our community to the world of web3 
                    technologies, blockchain development, and cryptocurrency. With your support, we can provide the resources, 
                    education, and mentorship needed to inspire the next generation of innovators.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm font-medium">Learn more at:</span>
                    <a 
                      href="https://boomchainlabgravatar.link" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline font-medium text-sm bg-primary/10 px-2 py-1 rounded flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                      boomchainlabgravatar.link
                    </a>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">What We'll Achieve Together</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Develop and deploy web3 educational workshops for youth aged 14-21</li>
                    <li>Provide hardware and software resources for hands-on blockchain learning</li>
                    <li>Create scholarships for promising students to pursue deeper blockchain education</li>
                    <li>Establish a community hub where young people can collaborate on web3 projects</li>
                    <li>Connect students with mentors in the blockchain industry</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 bg-primary/5">
                  <h3 className="text-xl font-semibold mb-3">Meet Our Founder</h3>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      DO
                    </div>
                    <div>
                      <h4 className="text-lg font-medium">David Okeamah</h4>
                      <p className="text-sm text-muted-foreground mb-2">Founder of CHONK9K & <a href="https://github.com/Boomchainlab" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Boomchainlab</a> Organization</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        <a href="https://x.com/Agunnnaya001" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                          </svg>
                          <span>@Agunnnaya001</span>
                        </a>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        "I believe that blockchain technology and web3 represent a meaningful opportunity for young people 
                        in our community to develop valuable skills and participate in the digital economy. With your support, 
                        we can make web3 education accessible to all youth, regardless of background."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Fundraising Progress</CardTitle>
              <CardDescription>
                Help us reach our goal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-4 border rounded-lg bg-card">
                <span className="text-3xl font-bold">${currentlyRaised.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground block">of ${fundingGoal.toLocaleString()} goal</span>
                <div className="mt-3">
                  <Progress value={percentageRaised} className="h-2" />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Raised</span>
                    <span className="text-xs font-medium">{percentageRaised.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Contribute with CHONK9K Tokens</h3>
                <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                  <div className="flex items-center">
                    <ChonkTokenLogo size={20} />
                    <span className="ml-2 font-mono text-sm">{walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={handleCopyAddress}>
                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button className="w-full" size="lg">
                <Link className="mr-2 h-4 w-4" /> Open in Wallet
              </Button>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Other Ways to Help</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Share2 className="mr-2 h-4 w-4" /> Share this Initiative
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" /> Join as a Mentor
                  </Button>
                  <a 
                    href="https://boomchainlabgravatar.link" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full flex items-center justify-start px-3 py-1.5 text-sm border rounded-md hover:bg-primary/10 transition-colors mt-2 font-medium text-primary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    Visit boomchainlabgravatar.link
                  </a>
                </div>
              </div>
            </CardContent>
            <CardFooter className="block space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">Verified</Badge>
                <span>Fundraiser managed by <a href="https://github.com/Boomchainlab" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Boomchainlab</a></span>
              </div>
              <p>
                Your contributions help create learning opportunities for youth in our community
              </p>
              <div className="flex items-center mt-1 pt-2 border-t">
                <Badge variant="secondary" className="mr-2">Website</Badge>
                <a href="https://boomchainlabgravatar.link" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">boomchainlabgravatar.link</a>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
              <CardDescription>
                See how your contribution will make a difference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="programs">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="programs">Programs</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
                
                <TabsContent value="programs" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mr-2">
                          <span>1</span>
                        </div>
                        Web3 Weekend Workshops
                      </h3>
                      <p className="text-muted-foreground">
                        Bi-weekly workshops introducing blockchain concepts, cryptocurrency basics, and smart contract development
                        for beginners. Designed to be accessible and engaging for youth with no prior experience.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mr-2">
                          <span>2</span>
                        </div>
                        Hackathon Sponsorships
                      </h3>
                      <p className="text-muted-foreground">
                        Support for local youth to participate in web3 hackathons, including travel stipends, equipment access,
                        and pre-hackathon training sessions to ensure they are prepared to compete.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mr-2">
                          <span>3</span>
                        </div>
                        Mentorship Program
                      </h3>
                      <p className="text-muted-foreground">
                        One-on-one mentoring with industry professionals who can guide students through their web3 journey,
                        providing insights, feedback, and career advice.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <div className="h-8 w-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center mr-2">
                          <span>4</span>
                        </div>
                        Scholarship Fund
                      </h3>
                      <p className="text-muted-foreground">
                        Financial support for promising students who demonstrate exceptional interest and aptitude in blockchain
                        technology, allowing them to pursue more advanced education and certification.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="resources" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-3">
                        <span className="text-lg">🖥️</span>
                      </div>
                      <h3 className="font-medium mb-1">Hardware Lab</h3>
                      <p className="text-sm text-muted-foreground">
                        Community computers and equipment dedicated to blockchain development and experimentation
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-3">
                        <span className="text-lg">📚</span>
                      </div>
                      <h3 className="font-medium mb-1">Learning Library</h3>
                      <p className="text-sm text-muted-foreground">
                        Digital and physical resources for students to deepen their blockchain knowledge
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-3">
                        <span className="text-lg">🔑</span>
                      </div>
                      <h3 className="font-medium mb-1">Software Access</h3>
                      <p className="text-sm text-muted-foreground">
                        Licenses and subscriptions to premium blockchain development tools and platforms
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-3">
                        <span className="text-lg">🏆</span>
                      </div>
                      <h3 className="font-medium mb-1">Incentive Rewards</h3>
                      <p className="text-sm text-muted-foreground">
                        Bounties and prizes for students who complete projects or achieve learning milestones
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-3">
                        <span className="text-lg">🌐</span>
                      </div>
                      <h3 className="font-medium mb-1">Online Hub</h3>
                      <p className="text-sm text-muted-foreground">
                        A dedicated virtual space for community collaboration and resource sharing
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-3">
                        <span className="text-lg">📝</span>
                      </div>
                      <h3 className="font-medium mb-1">Learning Materials</h3>
                      <p className="text-sm text-muted-foreground">
                        Custom curriculum and educational content tailored to youth audiences
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="timeline" className="py-4">
                  <div className="relative border-l border-primary/30 pl-8 ml-4 space-y-10">
                    <div className="relative">
                      <div className="absolute -left-[41px] h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                        <span>1</span>
                      </div>
                      <h3 className="text-lg font-semibold">Phase 1: Foundation (Months 1-3)</h3>
                      <p className="text-muted-foreground mt-1 mb-2">
                        Establish infrastructure, develop curriculum, and recruit initial mentors
                      </p>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">In Progress</Badge>
                          <span>25% Complete</span>
                        </div>
                        <Progress value={25} className="h-1" />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[41px] h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <span>2</span>
                      </div>
                      <h3 className="text-lg font-semibold">Phase 2: Pilot Programs (Months 4-6)</h3>
                      <p className="text-muted-foreground mt-1 mb-2">
                        Launch initial workshops, mentorship program, and begin community outreach
                      </p>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">Upcoming</Badge>
                          <span>Not Started</span>
                        </div>
                        <Progress value={0} className="h-1" />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[41px] h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <span>3</span>
                      </div>
                      <h3 className="text-lg font-semibold">Phase 3: Expansion (Months 7-12)</h3>
                      <p className="text-muted-foreground mt-1 mb-2">
                        Scale programs, form industry partnerships, and develop advanced tracks
                      </p>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">Upcoming</Badge>
                          <span>Not Started</span>
                        </div>
                        <Progress value={0} className="h-1" />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[41px] h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <span>4</span>
                      </div>
                      <h3 className="text-lg font-semibold">Phase 4: Sustainability (Beyond Year 1)</h3>
                      <p className="text-muted-foreground mt-1 mb-2">
                        Establish long-term funding, evaluate impact, and refine programs
                      </p>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">Planning</Badge>
                          <span>Preparing Strategy</span>
                        </div>
                        <Progress value={5} className="h-1" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recognition Tiers</CardTitle>
              <CardDescription>
                Contributor benefits and acknowledgment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-blue-500/20 p-4 text-center">
                    <h3 className="font-bold text-xl">Community Builder</h3>
                    <div className="text-sm text-muted-foreground">Contributions of $100-$499</div>
                  </div>
                  <div className="p-4 space-y-3">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Name listed on our supporters page</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Exclusive supporter NFT badge</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Regular updates on program progress</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden border-primary">
                  <div className="bg-primary p-4 text-center">
                    <h3 className="font-bold text-xl text-white">Innovation Partner</h3>
                    <div className="text-sm text-primary-foreground/80">Contributions of $500-$2,499</div>
                  </div>
                  <div className="p-4 space-y-3">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">All Community Builder benefits</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Invitation to quarterly virtual meetups</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Personalized thank-you from program participants</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Limited edition CHONK9K token gift</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-amber-500/20 p-4 text-center">
                    <h3 className="font-bold text-xl">Web3 Champion</h3>
                    <div className="text-sm text-muted-foreground">Contributions of $2,500+</div>
                  </div>
                  <div className="p-4 space-y-3">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">All Innovation Partner benefits</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Named scholarship or program feature</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Speaking opportunity at program events</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Executive summary impact report</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                All contributions are tracked transparently on the blockchain and acknowledged in program materials.
                Corporate matching and recurring donation options available.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
