import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMascot, MascotSettings as MascotSettingsType } from '@/hooks/useMascot';

interface MascotSettingsProps {
  onSave?: (settings: MascotSettingsType) => void;
  className?: string;
}

// Schema for form validation
const mascotSettingsSchema = z.object({
  isEnabled: z.boolean().default(true),
  mascotType: z.enum(['crypto_chonk', 'pixel_chonk', 'robot_chonk']).default('crypto_chonk'),
  animation: z.enum(['default', 'excited', 'thinking', 'teaching']).default('default'),
  speechBubbleStyle: z.enum(['default', 'neon', 'minimal', 'blockchain']).default('default'),
  tipFrequency: z.enum(['always', 'hourly', 'daily', 'weekly']).default('daily'),
});

const MascotSettings: React.FC<MascotSettingsProps> = ({ onSave, className = '' }) => {
  const mascot = useMascot();
  
  // Initialize form with current settings
  const form = useForm<z.infer<typeof mascotSettingsSchema>>({
    resolver: zodResolver(mascotSettingsSchema),
    defaultValues: {
      isEnabled: mascot.settings?.isEnabled ?? true,
      mascotType: mascot.settings?.mascotType ?? 'crypto_chonk',
      animation: mascot.settings?.animation ?? 'default',
      speechBubbleStyle: mascot.settings?.speechBubbleStyle ?? 'default',
      tipFrequency: mascot.settings?.tipFrequency ?? 'daily',
    },
  });
  
  // Handle form submission
  const onSubmit = (values: z.infer<typeof mascotSettingsSchema>) => {
    if (onSave) {
      onSave(values as MascotSettingsType);
    } else if (mascot.updateSettings) {
      mascot.updateSettings(values as MascotSettingsType);
    }
  };
  
  return (
    <Card className={`bg-black/60 backdrop-blur-md border border-[#00e0ff]/30 text-white ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
          Crypto Mentor Settings
        </CardTitle>
        <CardDescription className="text-gray-300">
          Customize your CHONK9K crypto mentor mascot and learning experience.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Enable/Disable Mascot */}
            <FormField
              control={form.control}
              name="isEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#ff00ff]/20 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Crypto Mentor</FormLabel>
                    <FormDescription className="text-gray-400">
                      Show your crypto mentor on screen with helpful tips and insights.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {/* Mascot Type Selection */}
            <FormField
              control={form.control}
              name="mascotType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mascot Character</FormLabel>
                  <FormDescription className="text-gray-400">
                    Choose your favorite mentor mascot character.
                  </FormDescription>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div
                      className={`flex flex-col items-center gap-2 rounded-lg border border-[#ff00ff]/20 p-4 hover:border-[#ff00ff]/60 cursor-pointer transition-all ${field.value === 'crypto_chonk' ? 'bg-[#ff00ff]/10 border-[#ff00ff]' : ''}`}
                      onClick={() => field.onChange('crypto_chonk')}
                    >
                      <div className="h-16 w-16 rounded-full bg-[#ff00ff]/20 flex items-center justify-center">
                        <span className="text-2xl">😺</span>
                      </div>
                      <span className="text-sm font-medium">Crypto Chonk</span>
                    </div>
                    
                    <div
                      className={`flex flex-col items-center gap-2 rounded-lg border border-[#ff00ff]/20 p-4 hover:border-[#ff00ff]/60 cursor-pointer transition-all ${field.value === 'pixel_chonk' ? 'bg-[#ff00ff]/10 border-[#ff00ff]' : ''}`}
                      onClick={() => field.onChange('pixel_chonk')}
                    >
                      <div className="h-16 w-16 rounded-full bg-[#ff00ff]/20 flex items-center justify-center">
                        <span className="text-2xl">🐱</span>
                      </div>
                      <span className="text-sm font-medium">Pixel Chonk</span>
                    </div>
                    
                    <div
                      className={`flex flex-col items-center gap-2 rounded-lg border border-[#ff00ff]/20 p-4 hover:border-[#ff00ff]/60 cursor-pointer transition-all ${field.value === 'robot_chonk' ? 'bg-[#ff00ff]/10 border-[#ff00ff]' : ''}`}
                      onClick={() => field.onChange('robot_chonk')}
                    >
                      <div className="h-16 w-16 rounded-full bg-[#ff00ff]/20 flex items-center justify-center">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <span className="text-sm font-medium">Robot Chonk</span>
                    </div>
                  </div>
                </FormItem>
              )}
            />
            
            {/* Animation Selection */}
            <FormField
              control={form.control}
              name="animation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Animation Style</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-black/60 border-[#ff00ff]/30 text-white">
                        <SelectValue placeholder="Select animation style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black/90 border-[#ff00ff]/30 text-white">
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="excited">Excited</SelectItem>
                      <SelectItem value="thinking">Thinking</SelectItem>
                      <SelectItem value="teaching">Teaching</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-gray-400">
                    How your mascot will animate when interacting with you.
                  </FormDescription>
                </FormItem>
              )}
            />
            
            {/* Speech Bubble Style */}
            <FormField
              control={form.control}
              name="speechBubbleStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Speech Bubble Style</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-black/60 border-[#ff00ff]/30 text-white">
                        <SelectValue placeholder="Select speech bubble style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black/90 border-[#ff00ff]/30 text-white">
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="neon">Neon</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="blockchain">Blockchain</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-gray-400">
                    Visual style for the tips and information bubbles.
                  </FormDescription>
                </FormItem>
              )}
            />
            
            {/* Tip Frequency */}
            <FormField
              control={form.control}
              name="tipFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tip Frequency</FormLabel>
                  <FormDescription className="text-gray-400">
                    How often would you like to receive crypto tips?
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-col space-y-1 mt-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="always" className="border-[#00e0ff]" />
                        </FormControl>
                        <FormLabel className="font-normal">Always (Show tips whenever available)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="hourly" className="border-[#00e0ff]" />
                        </FormControl>
                        <FormLabel className="font-normal">Hourly (Show tips once per hour)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="daily" className="border-[#00e0ff]" />
                        </FormControl>
                        <FormLabel className="font-normal">Daily (Show one tip per day)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="weekly" className="border-[#00e0ff]" />
                        </FormControl>
                        <FormLabel className="font-normal">Weekly (Show one tip per week)</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            {/* Save Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90 transition-opacity"
            >
              Save Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MascotSettings;
