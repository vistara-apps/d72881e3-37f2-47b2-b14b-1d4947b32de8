'use client';

import { RevenueSplit } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';
import { Plus, Minus, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';

interface RevenueSplitterProps {
  revenueSplit: RevenueSplit;
  variant?: 'creator' | 'collaborator';
  className?: string;
  onUpdateSplit?: (splitId: string, newSplit: RevenueSplit['splitDetails']) => void;
  editable?: boolean;
}

export function RevenueSplitter({ 
  revenueSplit, 
  variant = 'creator', 
  className,
  onUpdateSplit,
  editable = false 
}: RevenueSplitterProps) {
  const [splitDetails, setSplitDetails] = useState(revenueSplit.splitDetails);

  const totalPercentage = splitDetails.reduce((sum, split) => sum + split.percentage, 0);
  const isValid = totalPercentage === 100;

  const updatePercentage = (index: number, change: number) => {
    if (!editable) return;
    
    const newSplitDetails = [...splitDetails];
    const newPercentage = Math.max(0, Math.min(100, newSplitDetails[index].percentage + change));
    newSplitDetails[index].percentage = newPercentage;
    
    setSplitDetails(newSplitDetails);
    onUpdateSplit?.(revenueSplit.splitId, newSplitDetails);
  };

  const addCollaborator = () => {
    if (!editable) return;
    
    const newSplitDetails = [
      ...splitDetails,
      {
        address: '',
        percentage: 0,
        name: 'New Collaborator'
      }
    ];
    setSplitDetails(newSplitDetails);
  };

  const removeCollaborator = (index: number) => {
    if (!editable || splitDetails.length <= 1) return;
    
    const newSplitDetails = splitDetails.filter((_, i) => i !== index);
    setSplitDetails(newSplitDetails);
    onUpdateSplit?.(revenueSplit.splitId, newSplitDetails);
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-accent" />
          Revenue Split
          {variant === 'creator' && (
            <span className="text-sm font-normal text-muted-foreground">
              (Total: {formatCurrency(revenueSplit.totalRevenue)})
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {splitDetails.map((split, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-accent">
                    {split.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-sm">{split.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {split.address || 'Address not set'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {editable && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updatePercentage(index, -5)}
                      disabled={split.percentage <= 0}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updatePercentage(index, 5)}
                      disabled={split.percentage >= 100}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </>
                )}
                <div className="text-right min-w-[60px]">
                  <div className="font-semibold text-accent">{split.percentage}%</div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency((revenueSplit.totalRevenue * split.percentage) / 100)}
                  </div>
                </div>
              </div>
            </div>

            <ProgressBar
              value={split.percentage}
              max={100}
              className="h-1"
            />
          </div>
        ))}

        {editable && (
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={addCollaborator}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Collaborator
            </Button>
            
            <div className={cn(
              'text-sm font-medium',
              isValid ? 'text-accent' : 'text-red-400'
            )}>
              Total: {totalPercentage}%
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
