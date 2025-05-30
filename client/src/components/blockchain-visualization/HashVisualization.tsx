import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Hash, Info, RefreshCw, Copy } from 'lucide-react';

interface HashVisualizationProps {
  className?: string;
  interactive?: boolean;
  showControls?: boolean;
  defaultInput?: string;
  defaultAlgorithm?: 'SHA-256' | 'keccak-256' | 'simple';
}

// A simplified hash function for demonstration purposes
const simpleHash = (input: string): string => {
  let hash = 0;
  if (input.length === 0) return hash.toString(16);
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string and ensure it's consistently 8 characters
  const hexHash = (hash >>> 0).toString(16).padStart(8, '0');
  return hexHash.padEnd(64, '0'); // Pad to make it look like SHA-256
};

// Convert a string to bytes for crypto API
const stringToBytes = (str: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};

// Convert bytes to hex string
const bytesToHex = (bytes: ArrayBuffer): string => {
  return Array.from(new Uint8Array(bytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Function to compute hash using the Web Crypto API
const computeCryptoHash = async (input: string, algorithm: string): Promise<string> => {
  try {
    if (algorithm === 'simple') {
      return simpleHash(input);
    }
    
    // Use Web Crypto API for real hashing
    const data = stringToBytes(input);
    const hashBuffer = await window.crypto.subtle.digest(
      algorithm === 'SHA-256' ? 'SHA-256' : 'SHA-1', // Fallback to SHA-1 if keccak not available
      data
    );
    
    return bytesToHex(hashBuffer);
  } catch (err) {
    console.error('Hashing error:', err);
    // Fallback to simple hash
    return simpleHash(input);
  }
};

const HashVisualization: React.FC<HashVisualizationProps> = ({
  className = '',
  interactive = true,
  showControls = true,
  defaultInput = 'Hello, Blockchain!',
  defaultAlgorithm = 'SHA-256'
}) => {
  const [input, setInput] = useState(defaultInput);
  const [algorithm, setAlgorithm] = useState<'SHA-256' | 'keccak-256' | 'simple'>(defaultAlgorithm);
  const [hash, setHash] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(2); // Number of leading zeros
  const [isValid, setIsValid] = useState<boolean>(false);
  const [nonce, setNonce] = useState<number>(0);
  const [mining, setMining] = useState<boolean>(false);
  const [colorMode, setColorMode] = useState<'monochrome' | 'colorful'>('colorful');
  
  const { toast } = useToast();
  
  // Effect to compute hash when input, algorithm, or nonce changes
  useEffect(() => {
    const computeHash = async () => {
      if (!input) {
        setHash('');
        return;
      }
      
      // Include nonce in the input for mining demonstration
      const dataWithNonce = nonce > 0 ? `${input}:${nonce}` : input;
      const newHash = await computeCryptoHash(dataWithNonce, algorithm);
      setHash(newHash);
      
      // Check if hash meets difficulty (starts with N zeros)
      const validPrefix = '0'.repeat(difficulty);
      setIsValid(newHash.startsWith(validPrefix));
    };
    
    computeHash();
  }, [input, algorithm, nonce, difficulty]);
  
  // Function to mine a block by incrementing nonce until hash meets difficulty
  const mineBlock = async () => {
    if (mining) return;
    
    setMining(true);
    let currentNonce = nonce;
    const validPrefix = '0'.repeat(difficulty);
    let isHashValid = false;
    
    // Start mining loop
    const startMining = async () => {
      const maxIterations = 100; // Process in batches to keep UI responsive
      let iterations = 0;
      
      while (!isHashValid && iterations < maxIterations) {
        currentNonce++;
        iterations++;
        
        const dataWithNonce = `${input}:${currentNonce}`;
        const newHash = await computeCryptoHash(dataWithNonce, algorithm);
        
        if (newHash.startsWith(validPrefix)) {
          isHashValid = true;
          setNonce(currentNonce);
          setHash(newHash);
          setIsValid(true);
          setMining(false);
          
          toast({
            title: "Block Mined!",
            description: `Found a valid hash with nonce: ${currentNonce}`,
            variant: "success",
          });
          
          return;
        }
      }
      
      // Update UI with current progress
      setNonce(currentNonce);
      
      // Continue mining if not found yet
      if (!isHashValid) {
        requestAnimationFrame(startMining);
      }
    };
    
    // Begin mining
    startMining();
  };
  
  // Function to stop mining
  const stopMining = () => {
    setMining(false);
  };
  
  // Function to reset
  const reset = () => {
    setNonce(0);
    setMining(false);
  };
  
  // Function to copy hash to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Copied!",
      description: "Hash copied to clipboard",
      variant: "default",
    });
  };
  
  // Visualize the hash with colors
  const renderColorizedHash = () => {
    if (!hash) return null;
    
    // Simple visualization: color by character value
    if (colorMode === 'colorful') {
      return (
        <div className="flex flex-wrap">
          {hash.split('').map((char, index) => {
            // Generate a color based on the character value
            const hue = (parseInt(char, 16) * 22.5) % 360; // Map 0-15 to hues
            const valid = index < difficulty && char === '0';
            
            return (
              <span 
                key={index} 
                className={cn(
                  "inline-block px-0.5 py-0.5 font-mono text-xs md:text-sm rounded transition-colors",
                  valid ? "text-green-400" : ""
                )}
                style={colorMode === 'colorful' ? { color: `hsl(${hue}, 100%, 75%)` } : {}}
              >
                {char}
              </span>
            );
          })}
        </div>
      );
    }
    
    // Monochrome mode: just highlight leading zeros
    return (
      <div className="font-mono text-xs md:text-sm break-all">
        <span className="text-green-400">
          {hash.substring(0, difficulty).replace(/[^0]/g, char => (
            <span key={Math.random()} className="text-red-400">{char}</span>
          ))}
        </span>
        <span className="text-gray-400">
          {hash.substring(difficulty)}
        </span>
      </div>
    );
  };
  
  return (
    <Card className={cn("border border-[#00e0ff]/30 bg-black/60 backdrop-blur-md", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center">
            <Hash className="mr-2 text-[#00e0ff]" /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
              Hash Visualizer
            </span>
          </CardTitle>
          
          {isValid && (
            <Badge variant="outline" className="bg-green-500/20 text-green-400">
              Valid Hash
            </Badge>
          )}
        </div>
        
        <CardDescription>
          See how blockchain hashing works with proof of work
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Input and Algorithm */}
        {interactive && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Data Input:</label>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter data to hash"
                className="border-[#ff00ff]/30 bg-black/50 text-white"
                disabled={mining}
              />
            </div>
            
            {showControls && (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-400">Hash Algorithm:</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Different algorithms produce different hash outputs</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant={algorithm === 'SHA-256' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAlgorithm('SHA-256')}
                      className={algorithm === 'SHA-256' ? "bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]" : ""}
                      disabled={mining}
                    >
                      SHA-256
                    </Button>
                    <Button 
                      variant={algorithm === 'keccak-256' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAlgorithm('keccak-256')}
                      className={algorithm === 'keccak-256' ? "bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]" : ""}
                      disabled={mining}
                    >
                      Keccak-256
                    </Button>
                    <Button 
                      variant={algorithm === 'simple' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAlgorithm('simple')}
                      className={algorithm === 'simple' ? "bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]" : ""}
                      disabled={mining}
                    >
                      Simple
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-400">Visualization:</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">How to display the hash visually</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant={colorMode === 'colorful' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setColorMode('colorful')}
                      className={colorMode === 'colorful' ? "bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]" : ""}
                    >
                      Colorful
                    </Button>
                    <Button 
                      variant={colorMode === 'monochrome' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setColorMode('monochrome')}
                      className={colorMode === 'monochrome' ? "bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]" : ""}
                    >
                      Monochrome
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Hash Output */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Hash Output:</label>
              {mining && <RefreshCw className="h-3 w-3 text-amber-500 animate-spin" />}
              <Badge variant="outline" className="bg-black/40 text-xs">
                Nonce: {nonce}
              </Badge>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={copyToClipboard}
              disabled={!hash}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="min-h-[60px] bg-black/30 rounded-md p-3 overflow-x-auto">
            {renderColorizedHash()}
          </div>
        </div>
        
        {/* Mining Controls */}
        {showControls && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400">Difficulty (leading zeros): {difficulty}</label>
                <Badge variant="outline" className="text-xs">
                  Target: {'0'.repeat(difficulty)}...
                </Badge>
              </div>
              
              <Slider
                defaultValue={[difficulty]}
                max={8}
                min={1}
                step={1}
                onValueChange={(vals) => setDifficulty(vals[0])}
                disabled={mining}
                className="py-2"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                className="flex-1 bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] hover:opacity-90"
                onClick={mineBlock}
                disabled={mining || isValid}
              >
                {mining ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Mining...
                  </>
                ) : isValid ? "Already Valid" : "Mine Block"}
              </Button>
              
              {mining && (
                <Button variant="outline" onClick={stopMining}>
                  Stop
                </Button>
              )}
              
              <Button variant="outline" onClick={reset} disabled={mining && nonce === 0}>
                Reset
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-gray-400 italic">
        <p>
          Blockchain uses hashing to link blocks together and secure the chain.
          Miners compete to find a hash with a specific number of leading zeros by changing the nonce value.
        </p>
      </CardFooter>
    </Card>
  );
};

export default HashVisualization;
