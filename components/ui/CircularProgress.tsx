'use client';

import { cn } from '@/lib/utils';
import { generateGradient } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showValue?: boolean;
  label?: string;
  className?: string;
}

export function CircularProgress({ 
  value, 
  size = 'md', 
  showValue = true, 
  label,
  className 
}: CircularProgressProps) {
  const sizes = {
    sm: { container: 'w-16 h-16', text: 'text-xs', stroke: 4 },
    md: { container: 'w-24 h-24', text: 'text-sm', stroke: 6 },
    lg: { container: 'w-32 h-32', text: 'text-lg', stroke: 8 },
    xl: { container: 'w-40 h-40', text: 'text-xl', stroke: 10 },
  };

  const { container, text, stroke } = sizes[size];
  const radius = 50 - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn('relative flex items-center justify-center', container, className)}>
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="hsl(215, 35%, 30%)"
          strokeWidth={stroke}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(170, 70%, 45%)" />
            <stop offset="100%" stopColor="hsl(210, 80%, 50%)" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className={cn('font-bold gradient-text', text)}>
            {value}%
          </span>
        )}
        {label && (
          <span className="text-xs text-muted-foreground mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
