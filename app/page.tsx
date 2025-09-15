'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/minikit';
import { Dashboard } from '@/components/Dashboard';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ContentCard } from '@/components/ContentCard';
import { RevenueSplitter } from '@/components/RevenueSplitter';
import { RemixButton } from '@/components/RemixButton';
import { EngagementBadge } from '@/components/EngagementBadge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { User, DashboardStats, ContentPiece, RevenueSplit } from '@/lib/types';
import { Plus, Sparkles, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const { user: miniKitUser, context } = useMiniKit();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'remix' | 'revenue'>('dashboard');

  // Mock data - in a real app, this would come from your API
  const mockUser: User = {
    userId: '1',
    farcasterId: context?.user?.fid?.toString() || '12345',
    walletAddress: '0x1234...5678',
    username: context?.user?.displayName || 'CreativeUser',
    avatarUrl: context?.user?.pfpUrl || 'https://via.placeholder.com/64',
    followers: 1250,
    following: 890,
  };

  const mockStats: DashboardStats = {
    totalRevenue: 1247.50,
    totalViews: 45600,
    totalRemixes: 234,
    engagementRate: 87,
    topContent: [],
    recentActivity: [],
  };

  const mockContent: ContentPiece[] = [
    {
      contentId: '1',
      creatorId: '1',
      title: 'Digital Art Masterpiece',
      description: 'A stunning digital artwork exploring the intersection of technology and creativity.',
      mediaUrl: 'https://via.placeholder.com/400x300',
      createdAt: new Date('2024-01-15'),
      tags: ['digital', 'art', 'nft'],
      revenueShareSplitId: '1',
      views: 12500,
      likes: 890,
      remixes: 45,
    },
    {
      contentId: '2',
      creatorId: '1',
      title: 'Music Collaboration',
      description: 'An experimental track created with AI assistance and human creativity.',
      mediaUrl: 'https://via.placeholder.com/400x300',
      createdAt: new Date('2024-01-10'),
      tags: ['music', 'ai', 'collaboration'],
      revenueShareSplitId: '2',
      views: 8900,
      likes: 567,
      remixes: 23,
    },
  ];

  const mockRevenueSplit: RevenueSplit = {
    splitId: '1',
    contentId: '1',
    splitDetails: [
      { address: '0x1234...5678', percentage: 70, name: 'Original Creator' },
      { address: '0x9876...4321', percentage: 20, name: 'Collaborator' },
      { address: '0x5555...1111', percentage: 10, name: 'Platform' },
    ],
    createdAt: new Date('2024-01-15'),
    totalRevenue: 247.50,
  };

  const handleRemix = (contentId: string) => {
    console.log('Remixing content:', contentId);
    // In a real app, this would open the remix studio
  };

  const handleLike = (contentId: string) => {
    console.log('Liking content:', contentId);
    // In a real app, this would update the like count
  };

  const handleShare = (contentId: string) => {
    console.log('Sharing content:', contentId);
    // In a real app, this would open share options
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={mockStats} />;
      
      case 'content':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold gradient-text">Your Content</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockContent.map((content) => (
                <ContentCard
                  key={content.contentId}
                  content={content}
                  variant="withRevenue"
                  onRemix={handleRemix}
                  onLike={handleLike}
                  onShare={handleShare}
                />
              ))}
            </div>
          </div>
        );
      
      case 'remix':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold gradient-text">Remix Studio</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Discover remixable content and create your own unique variations with our creative tools.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockContent.map((content) => (
                <ContentCard
                  key={content.contentId}
                  content={content}
                  variant="remixable"
                  onRemix={handleRemix}
                  onLike={handleLike}
                  onShare={handleShare}
                />
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Remix Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <EngagementBadge variant="gold" count={15} label="Gold Remixes" />
                  <EngagementBadge variant="silver" count={28} label="Silver Remixes" />
                  <EngagementBadge variant="bronze" count={42} label="Bronze Remixes" />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'revenue':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold gradient-text">Revenue Management</h2>
            <RevenueSplitter
              revenueSplit={mockRevenueSplit}
              variant="creator"
              editable={true}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="font-semibold text-accent">$247.50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Month</span>
                    <span className="font-semibold">$189.30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Growth</span>
                    <span className="font-semibold text-green-400">+30.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return <Dashboard stats={mockStats} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ProfileHeader user={mockUser} variant="compact" className="border-b border-border" />

      {/* Navigation */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'content', label: 'Content' },
            { id: 'remix', label: 'Remix' },
            { id: 'revenue', label: 'Revenue' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4">
        {renderTabContent()}
      </main>
    </div>
  );
}
