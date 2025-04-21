import React from 'react';
import { Badge as BadgeType, UserBadge } from '@shared/schema';
import { Badge } from './Badge';
import { cn } from '@/lib/utils';

interface BadgeGridProps {
  badges: BadgeType[];
  userBadges?: UserBadge[];
  className?: string;
}

export function BadgeGrid({ badges, userBadges = [], className }: BadgeGridProps) {
  // Create a set of earned badge IDs for quick lookup
  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));
  
  return (
    <div className={cn(
      'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4',
      className
    )}>
      {badges.map(badge => (
        <Badge 
          key={badge.id} 
          badge={badge} 
          earned={earnedBadgeIds.has(badge.id)}
        />
      ))}
    </div>
  );
}