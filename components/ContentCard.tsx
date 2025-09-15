'use client'

import { ContentCardProps } from '@/lib/types'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share, Shuffle, Eye } from 'lucide-react'

export function ContentCard({ content, variant = 'simple', onRemix, onLike, onShare }: ContentCardProps) {
  const showRevenue = variant === 'withRevenue'
  const isRemixable = variant === 'remixable'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="card cursor-pointer"
    >
      {/* Content Preview */}
      <div className="aspect-video bg-surface rounded-md mb-4 flex items-center justify-center">
        {content.mediaUrl ? (
          <img
            src={content.mediaUrl}
            alt={content.title}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="text-text/40">Content Preview</div>
        )}
      </div>

      {/* Content Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg line-clamp-2">{content.title}</h3>
        <p className="text-sm text-text/80 line-clamp-3">{content.description}</p>

        {/* Tags */}
        {content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {content.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Metrics */}
        <div className="flex items-center justify-between text-sm text-text/60">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{content.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{content.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shuffle className="w-4 h-4" />
              <span>{content.remixes}</span>
            </div>
          </div>

          {showRevenue && (
            <div className="text-accent font-medium">
              {content.earnings.toFixed(4)} ETH
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLike?.(content.contentId)}
              className="p-2 rounded hover:bg-surface transition-colors"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={() => onShare?.(content.contentId)}
              className="p-2 rounded hover:bg-surface transition-colors"
            >
              <Share className="w-4 h-4" />
            </button>
            <button className="p-2 rounded hover:bg-surface transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>

          {isRemixable && (
            <button
              onClick={() => onRemix?.(content.contentId)}
              className="btn-primary flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Remix
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

