'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import { RevenueSplitter } from '@/components/RevenueSplitter'
import { ContentPiece, SplitDetail } from '@/lib/types'
import { Upload, Wand2, Save, Share } from 'lucide-react'

// Mock original content
const mockOriginalContent: ContentPiece = {
  contentId: '1',
  creatorId: 'original_creator',
  title: 'Amazing Original Art',
  description: 'A beautiful piece of digital art.',
  mediaUrl: '/api/placeholder/600/400',
  createdAt: new Date(),
  tags: ['art', 'digital'],
  views: 1250,
  likes: 89,
  remixes: 12,
  earnings: 0.045,
}

export default function RemixPage() {
  const searchParams = useSearchParams()
  const { address } = useAccount()
  const contentId = searchParams.get('contentId')

  const [originalContent, setOriginalContent] = useState<ContentPiece | null>(null)
  const [remixedContent, setRemixedContent] = useState({
    title: '',
    description: '',
    mediaUrl: '',
    tags: [] as string[],
  })
  const [splits, setSplits] = useState<SplitDetail[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Load original content
    if (contentId) {
      setOriginalContent(mockOriginalContent)
      // Initialize remix with original data
      setRemixedContent({
        title: `Remix of ${mockOriginalContent.title}`,
        description: '',
        mediaUrl: mockOriginalContent.mediaUrl,
        tags: [...mockOriginalContent.tags],
      })
    }
  }, [contentId])

  const handleApplyEffect = (effect: string) => {
    // Simulate applying remix effects
    console.log('Applying effect:', effect)
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      // In production, this would update the mediaUrl with processed content
    }, 2000)
  }

  const handleSaveRemix = async () => {
    if (!originalContent) return

    // Validate splits total 100% or less
    const totalPercentage = splits.reduce((sum, split) => sum + split.percentage, 0)
    if (totalPercentage > 100) {
      alert('Total split percentage cannot exceed 100%')
      return
    }

    // Save remix logic here
    console.log('Saving remix:', {
      originalContentId: originalContent.contentId,
      remixedContent,
      splits,
    })

    // Redirect to success page or show success message
  }

  const handleShareRemix = () => {
    // Share on Farcaster
    console.log('Sharing remix...')
  }

  if (!originalContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Content Not Found</h1>
          <p className="text-text/80">The content you're trying to remix doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Remix Studio</h1>
          <p className="text-text/80">Transform and enhance existing content</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Original Content */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Original Content</h2>
            <div className="card">
              <img
                src={originalContent.mediaUrl}
                alt={originalContent.title}
                className="w-full aspect-video object-cover rounded-md mb-4"
              />
              <h3 className="font-semibold mb-2">{originalContent.title}</h3>
              <p className="text-sm text-text/80 mb-4">{originalContent.description}</p>
              <div className="flex flex-wrap gap-2">
                {originalContent.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Remix Canvas */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Remix</h2>
            <div className="card">
              <div className="relative">
                <img
                  src={remixedContent.mediaUrl || originalContent.mediaUrl}
                  alt="Remix preview"
                  className="w-full aspect-video object-cover rounded-md mb-4"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                    <div className="text-white">Processing...</div>
                  </div>
                )}
              </div>

              {/* Remix Tools */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={remixedContent.title}
                    onChange={(e) => setRemixedContent(prev => ({ ...prev, title: e.target.value }))}
                    className="input w-full"
                    placeholder="Give your remix a title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={remixedContent.description}
                    onChange={(e) => setRemixedContent(prev => ({ ...prev, description: e.target.value }))}
                    className="input w-full h-24 resize-none"
                    placeholder="Describe your remix"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <input
                    type="text"
                    value={remixedContent.tags.join(', ')}
                    onChange={(e) => setRemixedContent(prev => ({
                      ...prev,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }))}
                    className="input w-full"
                    placeholder="Add tags separated by commas"
                  />
                </div>

                {/* Effect Tools */}
                <div>
                  <h3 className="font-medium mb-3">Apply Effects</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Filter', 'Overlay', 'Text', 'Crop', 'Rotate', 'Blur'].map((effect) => (
                      <button
                        key={effect}
                        onClick={() => handleApplyEffect(effect.toLowerCase())}
                        disabled={isProcessing}
                        className="btn-secondary flex items-center gap-2 justify-center"
                      >
                        <Wand2 className="w-4 h-4" />
                        {effect}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Split Configuration */}
        <div className="mt-8">
          <RevenueSplitter
            contentId={`remix-${contentId}`}
            currentSplit={splits}
            onSplitChange={setSplits}
            variant="creator"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={handleSaveRemix}
            className="btn-primary flex items-center gap-2 px-8 py-3"
          >
            <Save className="w-5 h-5" />
            Save Remix
          </button>
          <button
            onClick={handleShareRemix}
            className="btn-secondary flex items-center gap-2 px-8 py-3"
          >
            <Share className="w-5 h-5" />
            Share on Farcaster
          </button>
        </div>
      </div>
    </div>
  )
}

