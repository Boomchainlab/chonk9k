import React, { useState } from 'react';
import { Link } from 'wouter';
import TokenMoodVisualizer from '@/components/TokenMoodVisualizer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const TokenMoodVisualizerPage: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const [activeSize, setActiveSize] = useState<'sm' | 'md' | 'lg'>('md');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ff1493] to-[#8a2be2]">
            CHONK9K Mood-o-Meter™
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            An advanced visualization tool for tracking $CHONK9K's market sentiments
          </p>
          <div className="flex justify-center mb-6">
            <Link href="/token/mood">
              <Button variant="outline" className="text-muted-foreground mr-2">
                Back to Basic Mood Tracker
              </Button>
            </Link>
            <Link href="/token">
              <Button variant="outline" className="text-muted-foreground mr-2">
                Back to Token Page
              </Button>
            </Link>
            <Link href="/blockchain-streams">
              <Button variant="secondary" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600">
                Blockchain Streams
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mb-8">
          <TokenMoodVisualizer 
            timeframe={activeTimeframe} 
            size={activeSize} 
            showDetails={true} 
            customClass="shadow-xl"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Timeframe Controls</CardTitle>
              <CardDescription>Select a different timeframe to analyze token mood</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTimeframe} onValueChange={(value) => setActiveTimeframe(value as 'day' | 'week' | 'month')} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="day">24 Hours</TabsTrigger>
                  <TabsTrigger value="week">7 Days</TabsTrigger>
                  <TabsTrigger value="month">30 Days</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Different timeframes help understand short vs long-term market sentiments
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Display Size Options</CardTitle>
              <CardDescription>Adjust the visual display size of the mood indicator</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeSize} onValueChange={(value) => setActiveSize(value as 'sm' | 'md' | 'lg')} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="sm">Small</TabsTrigger>
                  <TabsTrigger value="md">Medium</TabsTrigger>
                  <TabsTrigger value="lg">Large</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Choose the size that best fits your screen or preference
            </CardFooter>
          </Card>
        </div>
        
        <div className="bg-card border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">About The Mood-o-Meter™</h2>
          <div className="space-y-4">
            <p>
              The CHONK9K Mood-o-Meter™ is an advanced visualization tool that tracks and represents the
              market sentiment for the $CHONK9K token based on real-time price data from CoinMarketCap.
            </p>
            <p>
              The indicator uses a sophisticated algorithm with 7 distinct mood states ranging from "Ecstatic" 
              to "Panic" based on percentage price changes over different timeframes.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 my-4">
              <div className="text-center p-2 bg-fuchsia-100 dark:bg-fuchsia-950 border border-fuchsia-300 dark:border-fuchsia-800 rounded">
                <div className="text-fuchsia-500 text-xl">🚀</div>
                <div className="text-sm font-medium">Ecstatic</div>
                <div className="text-xs text-muted-foreground">+10%+</div>
              </div>
              <div className="text-center p-2 bg-green-100 dark:bg-green-950 border border-green-300 dark:border-green-800 rounded">
                <div className="text-green-500 text-xl">😄</div>
                <div className="text-sm font-medium">Happy</div>
                <div className="text-xs text-muted-foreground">+5% to +10%</div>
              </div>
              <div className="text-center p-2 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded">
                <div className="text-emerald-400 text-xl">😊</div>
                <div className="text-sm font-medium">Optimistic</div>
                <div className="text-xs text-muted-foreground">+1% to +5%</div>
              </div>
              <div className="text-center p-2 bg-blue-100 dark:bg-blue-950 border border-blue-300 dark:border-blue-800 rounded">
                <div className="text-blue-400 text-xl">😐</div>
                <div className="text-sm font-medium">Neutral</div>
                <div className="text-xs text-muted-foreground">-1% to +1%</div>
              </div>
              <div className="text-center p-2 bg-yellow-100 dark:bg-yellow-950 border border-yellow-300 dark:border-yellow-800 rounded">
                <div className="text-yellow-500 text-xl">🙁</div>
                <div className="text-sm font-medium">Concerned</div>
                <div className="text-xs text-muted-foreground">-1% to -5%</div>
              </div>
              <div className="text-center p-2 bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 rounded">
                <div className="text-amber-500 text-xl">😨</div>
                <div className="text-sm font-medium">Worried</div>
                <div className="text-xs text-muted-foreground">-5% to -10%</div>
              </div>
              <div className="text-center p-2 bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 rounded">
                <div className="text-red-500 text-xl">😱</div>
                <div className="text-sm font-medium">Panic</div>
                <div className="text-xs text-muted-foreground">-10%+</div>
              </div>
            </div>
            <p>
              This feature is particularly useful for both new and experienced $CHONK9K token holders to quickly gauge
              market sentiment without needing to analyze complex price charts or technical indicators.
            </p>
          </div>
          <div className="flex items-center justify-between border-t pt-4 mt-4">
            <div className="text-sm text-muted-foreground">
              Data refreshes automatically every 60 seconds
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#ff1493]/20 to-[#8a2be2]/20 text-primary border border-primary/20">
                Advanced Visualization
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenMoodVisualizerPage;