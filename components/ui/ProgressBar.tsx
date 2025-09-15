'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
  label?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  showValue = false,
  label 
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-muted-foreground">{label}</span>}
          {showValue && <span className="text-sm font-medium">{value}/{max}</span>}
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
