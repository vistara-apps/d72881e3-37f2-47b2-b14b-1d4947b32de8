'use client';

import { User } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Settings, Share2 } from 'lucide-react';
import { Button } from './ui/Button';

interface ProfileHeaderProps {
  user: User;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export function ProfileHeader({ user, variant = 'detailed', className }: ProfileHeaderProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3 p-4', className)}>
        <div className="relative">
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-10 h-10 rounded-full border-2 border-accent"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-background" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{user.username}</h3>
          <p className="text-sm text-muted-foreground">
            {formatNumber(user.followers)} followers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6 border-b border-border', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-16 h-16 rounded-full border-3 border-accent shadow-neon-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full border-3 border-background flex items-center justify-center">
              <div className="w-2 h-2 bg-background rounded-full" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">{user.username}</h1>
            <p className="text-muted-foreground">@{user.farcasterId}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{formatNumber(user.followers)}</div>
          <div className="text-sm text-muted-foreground">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{formatNumber(user.following)}</div>
          <div className="text-sm text-muted-foreground">Following</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">4.2K</div>
          <div className="text-sm text-muted-foreground">Content</div>
        </div>
      </div>
    </div>
  );
}
