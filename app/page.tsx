'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { FrameSDK } from '@farcaster/frame-sdk'
import { ContentGrid } from '@/components/ContentGrid'
import { ProfileHeader } from '@/components/ProfileHeader'
import { Navigation } from '@/components/Navigation'
import { User } from '@/lib/types'

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const [user, setUser] = useState<User | null>(null)
  const [isFrame, setIsFrame] = useState(false)

  useEffect(() => {
    // Check if we're in a Farcaster Frame
    const checkFrame = async () => {
      try {
        await FrameSDK.actions.ready()
        setIsFrame(true)

        // Get user context from Frame
        const context = await FrameSDK.context
        if (context?.user) {
          setUser({
            userId: context.user.fid.toString(),
            farcasterId: context.user.fid.toString(),
            walletAddress: address || '',
            username: context.user.username || '',
            avatarUrl: context.user.pfpUrl,
            followers: 0, // Would fetch from API
            following: 0, // Would fetch from API
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
      } catch (error) {
        // Not in a frame, continue as web app
        setIsFrame(false)
      }
    }

    checkFrame()
  }, [address])

  if (!isConnected && !isFrame) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to CreatorShare</h1>
          <p className="text-lg mb-8 text-text/80">
            Connect your wallet to start creating and sharing content with fair revenue distribution.
          </p>
          <w3m-button />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {user && <ProfileHeader user={user} variant="compact" />}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Content</h2>
          <ContentGrid />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Revenue Sharing</h3>
            <p className="text-text/80 mb-4">
              Set up fair revenue splits for your content and collaborations.
            </p>
            <button className="btn-primary">Manage Revenue</button>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Remix Studio</h3>
            <p className="text-text/80 mb-4">
              Create amazing remixes of existing content with attribution.
            </p>
            <button className="btn-primary">Start Remixing</button>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Performance Insights</h3>
            <p className="text-text/80 mb-4">
              Track your content performance and optimize your strategy.
            </p>
            <button className="btn-primary">View Analytics</button>
          </div>
        </div>
      </main>
    </div>
  )
}

