import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { LockIcon, Key, CheckCircle2, Copy, RefreshCw, KeyRound, FileDigit, HelpCircle, AlertTriangle } from 'lucide-react';

const HashingDemo: React.FC = () => {
  const [inputText, setInputText] = useState('Hello, Blockchain!');
  const [sha256Hash, setSha256Hash] = useState('');
  const [showNonce, setShowNonce] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [difficulty, setDifficulty] = useState(2);
  const [isMining, setIsMining] = useState(false);
  const [miningTime, setMiningTime] = useState(0);
  const [hashRate, setHashRate] = useState(0);
  const [validHash, setValidHash] = useState(false);
  
  // Simple JS implementation of SHA-256 using Web Crypto API
  const calculateSHA256 = async (message: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };
  
  // Calculate hash based on input text and nonce
  useEffect(() => {
    const updateHash = async () => {
      const message = showNonce ? `${inputText}${nonce}` : inputText;
      const hash = await calculateSHA256(message);
      setSha256Hash(hash);
      
      // Check if hash is valid (has specified leading zeros)
      const prefix = '0'.repeat(difficulty);
      setValidHash(hash.startsWith(prefix));
    };
    
    updateHash();
  }, [inputText, nonce, showNonce, difficulty]);
  
  // Mining simulation
  const startMining = async () => {
    if (isMining) return;
    
    setIsMining(true);
    setValidHash(false);
    const startTime = performance.now();
    let currentNonce = 0;
    let hashesComputed = 0;
    let intervalId: number | null = null;
    
    // Update hash rate every 100ms
    intervalId = window.setInterval(() => {
      const timeElapsed = (performance.now() - startTime) / 1000; // in seconds
      if (timeElapsed > 0) {
        setHashRate(Math.round(hashesComputed / timeElapsed));
      }
    }, 100) as unknown as number;
    
    const prefix = '0'.repeat(difficulty);
    
    while (true) {
      if (!isMining) break; // Allow stopping from outside
      
      const message = `${inputText}${currentNonce}`;
      const hash = await calculateSHA256(message);
      hashesComputed++;
      
      if (hash.startsWith(prefix)) {
        // Found valid hash with target difficulty
        const endTime = performance.now();
        const timeElapsed = (endTime - startTime) / 1000; // in seconds
        
        setNonce(currentNonce);
        setSha256Hash(hash);
        setMiningTime(timeElapsed);
        setHashRate(Math.round(hashesComputed / timeElapsed));
        setValidHash(true);
        setIsMining(false);
        
        if (intervalId) clearInterval(intervalId);
        break;
      }
      
      currentNonce++;
      
      // Yield to the main thread occasionally to prevent UI freezing
      if (currentNonce % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
  };
  
  const stopMining = () => {
    setIsMining(false);
  };
  
  // Reset the demo
  const resetDemo = () => {
    setNonce(0);
    setValidHash(false);
    setMiningTime(0);
    setHashRate(0);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="interactive">
        <TabsList className="mb-4">
          <TabsTrigger value="interactive">Interactive Demo</TabsTrigger>
          <TabsTrigger value="explanation">How It Works</TabsTrigger>
        </TabsList>
        
        <TabsContent value="interactive" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="input-text">Input Data</Label>
                    <Input
                      id="input-text"
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      placeholder="Enter text to hash"
                      disabled={isMining}
                    />
                  </div>
                  
                  <div className="flex gap-4 items-end">
                    <div className="space-y-1">
                      <Label htmlFor="nonce-switch">Include Nonce</Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="nonce-switch"
                          checked={showNonce}
                          onCheckedChange={setShowNonce}
                          disabled={isMining}
                        />
                        <span className="text-sm">{showNonce ? 'On' : 'Off'}</span>
                      </div>
                    </div>
                    
                    {showNonce && (
                      <div className="space-y-1">
                        <Label htmlFor="nonce-input">Nonce</Label>
                        <Input
                          id="nonce-input"
                          type="number"
                          value={nonce}
                          onChange={e => setNonce(Number(e.target.value))}
                          className="w-24"
                          disabled={isMining}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Target Difficulty (leading zeros)</Label>
                    <Badge variant="outline">{difficulty}</Badge>
                  </div>
                  <Slider
                    value={[difficulty]}
                    min={1}
                    max={6}
                    step={1}
                    onValueChange={values => setDifficulty(values[0])}
                    disabled={isMining}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Easier</span>
                    <span>Harder</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="flex items-center gap-1.5">
                  <FileDigit className="h-4 w-4" />
                  <span>SHA-256 Hash</span>
                </Label>
                <div className="relative">
                  <div className="font-mono bg-muted p-3 rounded-md text-xs sm:text-sm break-all relative">
                    {sha256Hash ? (
                      <span className="flex items-center gap-1">
                        <span className={validHash ? 'text-green-500 font-bold' : ''}>
                          {sha256Hash.substring(0, difficulty)}
                        </span>
                        <span>
                          {sha256Hash.substring(difficulty)}
                        </span>
                      </span>
                    ) : 'Calculating...'}
                    
                    <button 
                      className="absolute right-2 top-2 p-1 text-muted-foreground hover:text-foreground"
                      onClick={() => navigator.clipboard.writeText(sha256Hash)}
                      title="Copy hash"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {showNonce && validHash && (
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-md flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 text-green-600 dark:text-green-400" />
                  <div className="text-sm">
                    <p className="font-medium">Valid Hash Found!</p>
                    <p>
                      Hash starts with {difficulty} zeros. This would be a valid block hash at the current difficulty.
                      {miningTime > 0 && (
                        <span className="block mt-1">
                          Found in {miningTime.toFixed(2)} seconds at {hashRate.toLocaleString()} hashes/second.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
              
              {showNonce && !validHash && (
                <div className="bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 p-3 rounded-md flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-amber-500" />
                  <div className="text-sm">
                    <p className="font-medium">Invalid Hash</p>
                    <p>
                      The hash does not meet the required difficulty of {difficulty} leading zeros.
                      {showNonce && ' Try mining to find a valid hash with the current difficulty.'}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                {showNonce && (
                  <>
                    <Button
                      onClick={startMining}
                      disabled={isMining || validHash}
                      className="flex gap-1.5"
                    >
                      {isMining ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg> 
                          Mining...
                        </>
                      ) : (
                        <>
                          <KeyRound className="h-4 w-4" /> 
                          Mine for Valid Hash
                        </>
                      )}
                    </Button>
                    
                    {isMining && (
                      <Button variant="outline" onClick={stopMining}>
                        Stop Mining
                      </Button>
                    )}
                    
                    {validHash && (
                      <Button variant="outline" onClick={resetDemo}>
                        <RefreshCw className="h-4 w-4 mr-1.5" /> Reset
                      </Button>
                    )}
                  </>
                )}
                
                {isMining && hashRate > 0 && (
                  <Badge variant="outline" className="h-9 flex items-center gap-1">
                    <span>{hashRate.toLocaleString()}</span>
                    <span className="text-muted-foreground">hashes/sec</span>
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="explanation" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-3">Cryptographic Hashing in Blockchain</h3>
              
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Cryptographic hash functions are the backbone of blockchain technology. They convert any input data into a fixed-size string of characters, which appears random but is deterministic (the same input always produces the same output).                
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Key Properties:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>One-way function:</strong> It's practically impossible to reverse-engineer the original input from the hash output.</li>
                    <li><strong>Deterministic:</strong> The same input always produces the same hash.</li>
                    <li><strong>Avalanche effect:</strong> Even a tiny change in the input produces a completely different hash.</li>
                    <li><strong>Collision resistance:</strong> It's extremely difficult to find two different inputs that produce the same hash.</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Mining and Proof of Work:</h4>
                  <p>
                    In blockchain mining, computers try to find a special hash that starts with a certain number of zeros. This is done by adding a "nonce" (a random number) to the block data and hashing it repeatedly until a valid hash is found.
                  </p>
                  <p>
                    This process is computationally difficult but easy to verify, forming the basis of Proof of Work. The difficulty can be adjusted by changing the number of required leading zeros.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Try It Yourself:</h4>
                  <p>
                    In the interactive demo, you can experience how blockchain miners search for valid hashes:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-1">
                    <li>Turn on the "Include Nonce" switch</li>
                    <li>Set a difficulty level (more zeros = harder)</li>
                    <li>Click "Mine for Valid Hash" to search for a hash that meets the requirements</li>
                    <li>Watch how changing even one character completely changes the hash</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HashingDemo;