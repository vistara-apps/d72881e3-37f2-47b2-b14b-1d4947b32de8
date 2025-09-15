'use client';

import { cn } from '@/lib/utils';
import { Zap, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

interface RemixButtonProps {
  variant?: 'primary' | 'disabled';
  contentId: string;
  className?: string;
  onRemix?: (contentId: string) => void;
  disabled?: boolean;
}

export function RemixButton({ 
  variant = 'primary', 
  contentId, 
  className,
  onRemix,
  disabled = false 
}: RemixButtonProps) {
  const handleClick = () => {
    if (!disabled && onRemix) {
      onRemix(contentId);
    }
  };

  if (variant === 'disabled') {
    return (
      <Button
        variant="ghost"
        className={cn('cursor-not-allowed opacity-50', className)}
        disabled
      >
        <Zap className="w-4 h-4 mr-2" />
        Remix Locked
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      className={cn(
        'relative overflow-hidden group hover:scale-105 transition-transform',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-20 transition-opacity" />
      <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse" />
      Remix This
      <Zap className="w-4 h-4 ml-2 group-hover:text-yellow-300 transition-colors" />
    </Button>
  );
}
