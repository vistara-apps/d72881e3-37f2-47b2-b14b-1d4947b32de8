'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { RevenueSplitter } from '@/components/RevenueSplitter'
import { ContentCard } from '@/components/ContentCard'
import { EngagementBadge } from '@/components/EngagementBadge'
import { ContentPiece, SplitDetail } from '@/lib/types'
import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react'

// Mock data - in production this would come from an API
const mockUserContent: ContentPiece[] = [
  {
    contentId: '1',
    creatorId: 'user1',
    title: 'My First Creation',
    description: 'A creative piece I made with love.',
    mediaUrl: '/api/placeholder/400/300',
    createdAt: new Date(),
    tags: ['art', 'creative'],
    views: 1250,
    likes: 89,
    remixes: 12,
    earnings: 0.045,
  },
  {
    contentId: '2',
    creatorId: 'user1',
    title: 'Tutorial Series',
    description: 'Complete guide to digital creation.',
    mediaUrl: '/api/placeholder/400/300',
    createdAt: new Date(),
    tags: ['tutorial', 'guide'],
    views: 2100,
    likes: 156,
    remixes: 8,
    earnings: 0.078,
  },
]

const mockEarnings = {
  total: 0.123,
  thisMonth: 0.045,
  pending: 0.012,
  claimed: 0.111,
}

export default function DashboardPage() {
  const { address } = useAccount()
  const [content, setContent] = useState<ContentPiece[]>([])
  const [selectedContent, setSelectedContent] = useState<string | null>(null)
  const [splits, setSplits] = useState<Record<string, SplitDetail[]>>({})

  useEffect(() => {
    // Load user's content
    setContent(mockUserContent)
  }, [])

  const handleSplitChange = (contentId: string, newSplits: SplitDetail[]) => {
    setSplits(prev => ({
      ...prev,
      [contentId]: newSplits,
    }))
  }

  const handleClaimRevenue = async () => {
    // Implement revenue claiming logic
    console.log('Claiming revenue...')
  }

  return (
    <div className="min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Revenue Dashboard</h1>
          <p className="text-text/80">Manage your content and track earnings</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-text/60">Total Earnings</p>
                <p className="text-xl font-bold">{mockEarnings.total} ETH</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-text/60">This Month</p>
                <p className="text-xl font-bold">{mockEarnings.thisMonth} ETH</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-text/60">Pending</p>
                <p className="text-xl font-bold">{mockEarnings.pending} ETH</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-text/60">Claimed</p>
                <p className="text-xl font-bold">{mockEarnings.claimed} ETH</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content List */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Your Content</h2>
            <div className="space-y-4">
              {content.map((item) => (
                <div
                  key={item.contentId}
                  className={`card cursor-pointer transition-all ${
                    selectedContent === item.contentId ? 'ring-2 ring-accent' : ''
                  }`}
                  onClick={() => setSelectedContent(
                    selectedContent === item.contentId ? null : item.contentId
                  )}
                >
                  <div className="flex gap-4">
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-text/80 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <EngagementBadge type="like" count={item.likes} variant="bronze" />
                        <EngagementBadge type="remix" count={item.remixes} variant="silver" />
                      </div>
                      <p className="text-sm font-medium text-accent">
                        {item.earnings} ETH earned
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Splitter */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Revenue Management</h2>
            {selectedContent ? (
              <RevenueSplitter
                contentId={selectedContent}
                currentSplit={splits[selectedContent] || []}
                onSplitChange={(newSplits) => handleSplitChange(selectedContent, newSplits)}
              />
            ) : (
              <div className="card text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-text/40" />
                <h3 className="text-lg font-semibold mb-2">Select Content</h3>
                <p className="text-text/60">
                  Choose a piece of content to configure revenue sharing
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Claim Revenue Section */}
        <div className="mt-12">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Claim Your Earnings</h3>
                <p className="text-text/80">
                  Transfer your earned revenue to your connected wallet
                </p>
                <p className="text-sm text-text/60 mt-2">
                  Available to claim: {mockEarnings.pending} ETH
                </p>
              </div>
              <button
                onClick={handleClaimRevenue}
                disabled={mockEarnings.pending === 0}
                className="btn-primary px-8 py-3"
              >
                Claim Revenue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

