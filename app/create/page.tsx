'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { RevenueSplitter } from '@/components/RevenueSplitter'
import { ContentFormData, SplitDetail } from '@/lib/types'
import { Upload, Save, X } from 'lucide-react'

export default function CreatePage() {
  const { address } = useAccount()
  const router = useRouter()

  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    tags: [],
    mediaUrl: '',
    revenueSplits: [],
  })

  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Simulate file upload to IPFS/Arweave
    setTimeout(() => {
      // In production, upload to IPFS/Arweave and get the URL
      const mockUrl = `/api/placeholder/600/400` // Placeholder
      setFormData(prev => ({ ...prev, mediaUrl: mockUrl }))
      setPreviewUrl(mockUrl)
      setIsUploading(false)
    }, 2000)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!formData.title || !formData.mediaUrl) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Validate revenue splits
      const totalPercentage = formData.revenueSplits.reduce((sum, split) => sum + split.percentage, 0)
      if (totalPercentage > 100) {
        alert('Total revenue split percentage cannot exceed 100%')
        setIsSubmitting(false)
        return
      }

      // Submit content creation
      console.log('Creating content:', formData)

      // In production, this would:
      // 1. Upload media to IPFS/Arweave
      // 2. Create content record in database
      // 3. Set up revenue splits on blockchain
      // 4. Post to Farcaster

      // Simulate success
      setTimeout(() => {
        alert('Content created successfully!')
        router.push('/dashboard')
      }, 2000)

    } catch (error) {
      console.error('Error creating content:', error)
      alert('Failed to create content. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeMedia = () => {
    setFormData(prev => ({ ...prev, mediaUrl: '' }))
    setPreviewUrl('')
  }

  if (!address) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Connect Your Wallet</h1>
          <p className="text-text/80 mb-8">
            Connect your wallet to create and publish content.
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
          <h1 className="text-3xl font-bold mb-2">Create Content</h1>
          <p className="text-text/80">Share your creativity and set up fair revenue sharing</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
          {/* Media Upload */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Upload Media</h2>

            {!previewUrl ? (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-text/40" />
                <p className="text-lg font-medium mb-2">Upload your content</p>
                <p className="text-text/60 mb-4">
                  Support for images, videos, and other media files
                </p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="btn-primary cursor-pointer inline-block"
                >
                  {isUploading ? 'Uploading...' : 'Choose File'}
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full aspect-video object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Content Details */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Content Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="input w-full"
                  placeholder="Give your content a catchy title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input w-full h-32 resize-none"
                  placeholder="Describe your content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  }))}
                  className="input w-full"
                  placeholder="art, digital, creative (comma separated)"
                />
                <p className="text-xs text-text/60 mt-1">
                  Tags help others discover your content
                </p>
              </div>
            </div>
          </div>

          {/* Revenue Split Configuration */}
          <RevenueSplitter
            contentId="new-content"
            currentSplit={formData.revenueSplits}
            onSplitChange={(splits) => setFormData(prev => ({ ...prev, revenueSplits: splits }))}
            variant="creator"
          />

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.mediaUrl}
              className="btn-primary px-12 py-3 flex items-center gap-2"
            >
              {isSubmitting ? (
                'Creating...'
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create & Publish
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

