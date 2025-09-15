'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Heart, MessageCircle, Share, Trophy } from 'lucide-react'

interface RewardAction {
  type: 'like' | 'comment' | 'share' | 'remix'
  contentId: string
  contentTitle: string
  reward: number
  timestamp: Date
  claimed: boolean
}

interface AudienceRewardsProps {
  userId: string
  onClaimReward?: (actionId: string) => void
}

// Mock data
const mockRewards: RewardAction[] = [
  {
    type: 'like',
    contentId: '1',
    contentTitle: 'Amazing Digital Art',
    reward: 0.001,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    claimed: false,
  },
  {
    type: 'comment',
    contentId: '2',
    contentTitle: 'Music Production Tutorial',
    reward: 0.002,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    claimed: true,
  },
  {
    type: 'share',
    contentId: '1',
    contentTitle: 'Amazing Digital Art',
    reward: 0.003,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    claimed: false,
  },
]

const rewardIcons = {
  like: Heart,
  comment: MessageCircle,
  share: Share,
  remix: Trophy,
}

export function AudienceRewards({ userId, onClaimReward }: AudienceRewardsProps) {
  const [rewards, setRewards] = useState<RewardAction[]>(mockRewards)
  const [claiming, setClaiming] = useState<string | null>(null)

  const unclaimedRewards = rewards.filter(r => !r.claimed)
  const totalUnclaimed = unclaimedRewards.reduce((sum, r) => sum + r.reward, 0)

  const handleClaimAll = async () => {
    setClaiming('all')
    // Simulate claiming process
    setTimeout(() => {
      setRewards(prev => prev.map(r => ({ ...r, claimed: true })))
      setClaiming(null)
      onClaimReward?.('all')
    }, 2000)
  }

  const handleClaimSingle = async (index: number) => {
    setClaiming(`single-${index}`)
    setTimeout(() => {
      setRewards(prev => prev.map((r, i) =>
        i === index ? { ...r, claimed: true } : r
      ))
      setClaiming(null)
      onClaimReward?.(`single-${index}`)
    }, 1500)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Gift className="w-5 h-5 text-accent" />
            Audience Rewards
          </h3>
          <p className="text-sm text-text/80 mt-1">
            Earn tokens for engaging with content
          </p>
        </div>

        {unclaimedRewards.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-text/60">Available to claim</p>
            <p className="text-lg font-bold text-accent">{totalUnclaimed.toFixed(4)} ETH</p>
          </div>
        )}
      </div>

      {/* Claim All Button */}
      {unclaimedRewards.length > 0 && (
        <div className="mb-6">
          <button
            onClick={handleClaimAll}
            disabled={claiming === 'all'}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {claiming === 'all' ? (
              'Claiming...'
            ) : (
              <>
                <Gift className="w-4 h-4" />
                Claim All Rewards ({totalUnclaimed.toFixed(4)} ETH)
              </>
            )}
          </button>
        </div>
      )}

      {/* Rewards List */}
      <div className="space-y-3">
        {rewards.length === 0 ? (
          <div className="text-center py-8 text-text/60">
            <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No rewards yet</p>
            <p className="text-sm">Start engaging with content to earn rewards!</p>
          </div>
        ) : (
          rewards.map((reward, index) => {
            const Icon = rewardIcons[reward.type]
            const isClaiming = claiming === `single-${index}`

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  reward.claimed
                    ? 'bg-surface/50 border-border/50'
                    : 'bg-accent/5 border-accent/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  reward.claimed ? 'bg-surface' : 'bg-accent/20'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    reward.claimed ? 'text-text/60' : 'text-accent'
                  }`} />
                </div>

                <div className="flex-1">
                  <p className="font-medium">{reward.contentTitle}</p>
                  <p className="text-sm text-text/60 capitalize">
                    {reward.type} • {reward.timestamp.toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`font-bold ${
                    reward.claimed ? 'text-text/60' : 'text-accent'
                  }`}>
                    +{reward.reward} ETH
                  </p>
                  {reward.claimed && (
                    <p className="text-xs text-green-400">Claimed</p>
                  )}
                </div>

                {!reward.claimed && (
                  <button
                    onClick={() => handleClaimSingle(index)}
                    disabled={isClaiming}
                    className="btn-secondary text-sm px-3 py-1"
                  >
                    {isClaiming ? 'Claiming...' : 'Claim'}
                  </button>
                )}
              </motion.div>
            )
          })
        )}
      </div>

      {/* Reward Info */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="font-medium mb-2">How to Earn Rewards</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" />
            <span>Like: 0.001 ETH</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <span>Comment: 0.002 ETH</span>
          </div>
          <div className="flex items-center gap-2">
            <Share className="w-4 h-4 text-green-400" />
            <span>Share: 0.003 ETH</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>Remix: 0.01 ETH</span>
          </div>
        </div>
      </div>
    </div>
  )
}

