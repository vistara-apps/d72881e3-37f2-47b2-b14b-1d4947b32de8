'use client'

import { useState } from 'react'
import { RevenueSplitterProps, SplitDetail } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, User } from 'lucide-react'

export function RevenueSplitter({ contentId, currentSplit = [], onSplitChange, variant = 'creator' }: RevenueSplitterProps) {
  const [splits, setSplits] = useState<SplitDetail[]>(currentSplit)

  const addSplit = () => {
    if (splits.length < 20) { // Max 20 splits
      const newSplit: SplitDetail = {
        userId: '',
        percentage: 0,
        amount: 0,
        walletAddress: '',
      }
      setSplits([...splits, newSplit])
    }
  }

  const removeSplit = (index: number) => {
    const newSplits = splits.filter((_, i) => i !== index)
    setSplits(newSplits)
    onSplitChange(newSplits)
  }

  const updateSplit = (index: number, field: keyof SplitDetail, value: string | number) => {
    const newSplits = [...splits]
    newSplits[index] = { ...newSplits[index], [field]: value }
    setSplits(newSplits)
    onSplitChange(newSplits)
  }

  const totalPercentage = splits.reduce((sum, split) => sum + split.percentage, 0)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Revenue Split Configuration</h3>
        <button
          onClick={addSplit}
          disabled={splits.length >= 20}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Split
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {splits.map((split, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 p-3 bg-surface rounded-md"
            >
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Wallet Address"
                  value={split.walletAddress}
                  onChange={(e) => updateSplit(index, 'walletAddress', e.target.value)}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Username (optional)"
                  value={split.userId}
                  onChange={(e) => updateSplit(index, 'userId', e.target.value)}
                  className="input"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="Percentage"
                    value={split.percentage || ''}
                    onChange={(e) => updateSplit(index, 'percentage', parseFloat(e.target.value) || 0)}
                    className="input flex-1"
                  />
                  <span className="text-sm text-text/60">%</span>
                </div>
              </div>

              <button
                onClick={() => removeSplit(index)}
                className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {splits.length === 0 && (
          <div className="text-center py-8 text-text/60">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No revenue splits configured</p>
            <p className="text-sm">Add collaborators to share revenue from this content</p>
          </div>
        )}
      </div>

      {splits.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Distribution:</span>
            <span className={`font-bold ${totalPercentage > 100 ? 'text-red-400' : totalPercentage === 100 ? 'text-green-400' : 'text-yellow-400'}`}>
              {totalPercentage.toFixed(1)}%
            </span>
          </div>
          {totalPercentage > 100 && (
            <p className="text-sm text-red-400 mt-1">
              Total percentage exceeds 100%. Please adjust the splits.
            </p>
          )}
          {totalPercentage < 100 && (
            <p className="text-sm text-yellow-400 mt-1">
              {variant === 'creator' ? 'Remaining percentage will go to you.' : 'Remaining percentage will go to the original creator.'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

