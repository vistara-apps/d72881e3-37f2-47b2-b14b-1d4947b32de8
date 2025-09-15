'use client'

import { useState, useEffect } from 'react'
import { ContentCard } from './ContentCard'
import { ContentPiece } from '@/lib/types'

// Mock data - in production this would come from an API
const mockContent: ContentPiece[] = [
  {
    contentId: '1',
    creatorId: 'user1',
    title: 'Amazing Digital Art Creation',
    description: 'A stunning piece of digital art created with AI tools and traditional techniques.',
    mediaUrl: '/api/placeholder/400/300',
    createdAt: new Date(),
    tags: ['art', 'digital', 'ai'],
    views: 1250,
    likes: 89,
    remixes: 12,
    earnings: 0.045,
  },
  {
    contentId: '2',
    creatorId: 'user2',
    title: 'Music Production Tutorial',
    description: 'Learn how to create professional beats using modern production techniques.',
    mediaUrl: '/api/placeholder/400/300',
    createdAt: new Date(),
    tags: ['music', 'tutorial', 'production'],
    views: 2100,
    likes: 156,
    remixes: 8,
    earnings: 0.078,
  },
  {
    contentId: '3',
    creatorId: 'user3',
    title: 'Short Film: The Journey',
    description: 'An emotional short film about self-discovery and growth.',
    mediaUrl: '/api/placeholder/400/300',
    createdAt: new Date(),
    tags: ['film', 'short', 'emotional'],
    views: 890,
    likes: 67,
    remixes: 5,
    earnings: 0.032,
  },
]

export function ContentGrid() {
  const [content, setContent] = useState<ContentPiece[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadContent = async () => {
      setLoading(true)
      // In production, fetch from API
      setTimeout(() => {
        setContent(mockContent)
        setLoading(false)
      }, 1000)
    }

    loadContent()
  }, [])

  const handleRemix = (contentId: string) => {
    // Navigate to remix page
    window.location.href = `/remix?contentId=${contentId}`
  }

  const handleLike = (contentId: string) => {
    // Handle like action
    console.log('Liked content:', contentId)
  }

  const handleShare = (contentId: string) => {
    // Handle share action
    console.log('Shared content:', contentId)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="aspect-video bg-surface rounded-md mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-surface rounded w-3/4"></div>
              <div className="h-3 bg-surface rounded w-full"></div>
              <div className="h-3 bg-surface rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content.map((item) => (
        <ContentCard
          key={item.contentId}
          content={item}
          variant="remixable"
          onRemix={handleRemix}
          onLike={handleLike}
          onShare={handleShare}
        />
      ))}
    </div>
  )
}

