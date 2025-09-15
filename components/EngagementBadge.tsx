'use client'

import { EngagementBadgeProps } from '@/lib/types'
import { Heart, MessageCircle, Share, Shuffle } from 'lucide-react'

const badgeVariants = {
  bronze: 'bg-amber-600/20 text-amber-400 border-amber-600/30',
  silver: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
  gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
}

const engagementIcons = {
  like: Heart,
  comment: MessageCircle,
  share: Share,
  remix: Shuffle,
}

export function EngagementBadge({ type, count, variant = 'bronze' }: EngagementBadgeProps) {
  const Icon = engagementIcons[type]

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${badgeVariants[variant]}`}>
      <Icon className="w-3 h-3" />
      <span>{count}</span>
    </div>
  )
}

