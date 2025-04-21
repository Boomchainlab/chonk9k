import React from 'react';
import { Badge as BadgeType } from '@shared/schema';
import { cn } from '@/lib/utils';
import { Badge as UIBadge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BadgeProps {
  badge: BadgeType;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ badge, earned = false, size = 'md', className }: BadgeProps) {
  // Define rarity color classes
  const rarityColors = {
    common: 'bg-zinc-400 hover:bg-zinc-400/90', 
    uncommon: 'bg-green-500 hover:bg-green-500/90',
    rare: 'bg-blue-500 hover:bg-blue-500/90',
    epic: 'bg-purple-500 hover:bg-purple-500/90',
    legendary: 'bg-amber-500 hover:bg-amber-500/90'
  };

  // Define size classes
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  // Get color based on rarity, default to gray if not found
  const rarityColor = rarityColors[badge.rarity as keyof typeof rarityColors] || 'bg-gray-500 hover:bg-gray-500/90';
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            'flex flex-col items-center justify-center',
            className
          )}>
            <div 
              className={cn(
                'rounded-full flex items-center justify-center text-white',
                sizeClasses[size],
                !earned && 'opacity-40 grayscale',
              )}
              style={{ 
                backgroundImage: badge.imageUrl.startsWith('http') 
                  ? `url(${badge.imageUrl})` 
                  : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: badge.imageUrl.startsWith('http') ? undefined : 'currentColor',
              }}
            >
              {!badge.imageUrl.startsWith('http') && (
                <UIBadge className={cn(
                  'text-center font-bold border-2 border-white',
                  rarityColor
                )}>
                  {badge.name.slice(0, 2).toUpperCase()}
                </UIBadge>
              )}
            </div>
            <span className={cn(
              'text-xs font-medium mt-1 text-center', 
              !earned && 'text-muted-foreground'
            )}>
              {badge.name}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-bold">{badge.name}</p>
            <p className="text-sm">{badge.description}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {badge.category} • {badge.rarity} Rarity
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}