'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { AudienceRewards } from '@/components/AudienceRewards'
import { ContentCard } from '@/components/ContentCard'
import { ContentPiece } from '@/lib/types'
import { Wallet, CheckCircle, Clock, AlertCircle } from 'lucide-react'

// Mock data for claimable revenue
const mockClaimableContent: ContentPiece[] = [
  {
    contentId: '1',
    creatorId: 'user1',
    title: 'Digital Art Masterpiece',
    description: 'A stunning digital artwork.',
    mediaUrl: '/api/placeholder/400/300',
    createdAt: new Date(),
    tags: ['art', 'digital'],
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

interface ClaimStatus {
  contentId: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  txHash?: string
}

export default function ClaimPage() {
  const { address } = useAccount()
  const [selectedContent, setSelectedContent] = useState<string[]>([])
  const [claimStatuses, setClaimStatuses] = useState<Record<string, ClaimStatus>>({})
  const [isClaiming, setIsClaiming] = useState(false)

  const totalClaimable = mockClaimableContent.reduce((sum, content) => sum + content.earnings, 0)

  const handleContentSelect = (contentId: string) => {
    setSelectedContent(prev =>
      prev.includes(contentId)
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    )
  }

  const handleClaimRevenue = async () => {
    if (selectedContent.length === 0) return

    setIsClaiming(true)

    // Initialize claim statuses
    const initialStatuses: Record<string, ClaimStatus> = {}
    selectedContent.forEach(contentId => {
      const content = mockClaimableContent.find(c => c.contentId === contentId)
      if (content) {
        initialStatuses[contentId] = {
          contentId,
          amount: content.earnings,
          status: 'pending',
        }
      }
    })
    setClaimStatuses(initialStatuses)

    // Simulate claiming process
    for (const contentId of selectedContent) {
      // Update status to processing
      setClaimStatuses(prev => ({
        ...prev,
        [contentId]: { ...prev[contentId], status: 'processing' }
      }))

      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update status to completed
      setClaimStatuses(prev => ({
        ...prev,
        [contentId]: {
          ...prev[contentId],
          status: 'completed',
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`
        }
      }))
    }

    setIsClaiming(false)
    setSelectedContent([])
  }

  const getStatusIcon = (status: ClaimStatus['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'processing':
        return <AlertCircle className="w-4 h-4 text-blue-400 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />
    }
  }

  const getStatusText = (status: ClaimStatus['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'processing':
        return 'Processing'
      case 'completed':
        return 'Completed'
      case 'failed':
        return 'Failed'
    }
  }

  if (!address) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Connect Your Wallet</h1>
          <p className="text-text/80 mb-8">
            Connect your wallet to claim your earned revenue.
          </p>
          <w3m-button />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Claim Revenue</h1>
          <p className="text-text/80">Transfer your earned revenue to your wallet</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Selection */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Select Content to Claim</h2>

              <div className="space-y-4">
                {mockClaimableContent.map((content) => {
                  const isSelected = selectedContent.includes(content.contentId)
                  const claimStatus = claimStatuses[content.contentId]

                  return (
                    <div
                      key={content.contentId}
                      className={`border rounded-lg p-4 transition-all ${
                        isSelected
                          ? 'border-accent bg-accent/5'
                          : 'border-border hover:border-accent/50'
                      } ${claimStatus ? 'opacity-75' : ''}`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleContentSelect(content.contentId)}
                          disabled={!!claimStatus}
                          className="mt-1"
                        />

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{content.title}</h3>
                              <p className="text-sm text-text/80 mt-1">{content.description}</p>
                              <p className="text-sm text-accent font-bold mt-2">
                                {content.earnings} ETH available
                              </p>
                            </div>

                            {claimStatus && (
                              <div className="flex items-center gap-2">
                                {getStatusIcon(claimStatus.status)}
                                <span className="text-sm">{getStatusText(claimStatus.status)}</span>
                              </div>
                            )}
                          </div>

                          {claimStatus?.txHash && (
                            <p className="text-xs text-text/60 mt-2 font-mono">
                              TX: {claimStatus.txHash.slice(0, 10)}...{claimStatus.txHash.slice(-8)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {mockClaimableContent.length === 0 && (
                <div className="text-center py-12 text-text/60">
                  <Wallet className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No revenue to claim</p>
                  <p className="text-sm">Create content and earn from audience engagement!</p>
                </div>
              )}
            </div>
          </div>

          {/* Claim Summary & Audience Rewards */}
          <div className="space-y-6">
            {/* Claim Summary */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Claim Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Selected Content:</span>
                  <span>{selectedContent.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-bold text-accent">
                    {selectedContent.reduce((sum, contentId) => {
                      const content = mockClaimableContent.find(c => c.contentId === contentId)
                      return sum + (content?.earnings || 0)
                    }, 0).toFixed(4)} ETH
                  </span>
                </div>
              </div>

              <button
                onClick={handleClaimRevenue}
                disabled={selectedContent.length === 0 || isClaiming}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                {isClaiming ? 'Processing...' : 'Claim Revenue'}
              </button>
            </div>

            {/* Audience Rewards */}
            <AudienceRewards
              userId={address}
              onClaimReward={(actionId) => {
                console.log('Claimed reward:', actionId)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

