'use client';

import { cn } from '@/lib/utils';
import { Trophy, Award, Medal } from 'lucide-react';

interface EngagementBadgeProps {
  variant: 'bronze' | 'silver' | 'gold';
  count: number;
  label: string;
  className?: string;
}

export function EngagementBadge({ variant, count, label, className }: EngagementBadgeProps) {
  const variants = {
    bronze: {
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      icon: Medal,
    },
    silver: {
      bg: 'bg-gray-400/20',
      border: 'border-gray-400/30',
      text: 'text-gray-300',
      icon: Award,
    },
    gold: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: Trophy,
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm',
      config.bg,
      config.border,
      config.text,
      className
    )}>
      <Icon className="w-4 h-4" />
      <span className="font-medium text-sm">{count}</span>
      <span className="text-xs opacity-80">{label}</span>
    </div>
  );
}
