'use client'

import { ProfileHeaderProps } from '@/lib/types'
import { motion } from 'framer-motion'
import { Edit, Users, Heart } from 'lucide-react'

export function ProfileHeader({ user, variant = 'compact', onEdit }: ProfileHeaderProps) {
  const isDetailed = variant === 'detailed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-accent" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-semibold">{user.username}</h2>
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1 rounded hover:bg-surface transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-text/60">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{user.followers} followers</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{user.following} following</span>
            </div>
          </div>

          {isDetailed && (
            <div className="mt-4">
              <p className="text-sm text-text/80">
                Farcaster ID: {user.farcasterId}
              </p>
              <p className="text-xs text-text/60 mt-1 font-mono">
                {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

