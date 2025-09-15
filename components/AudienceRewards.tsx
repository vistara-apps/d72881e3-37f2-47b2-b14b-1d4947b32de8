'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Coins, Trophy, Star, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';

interface AudienceRewardsProps {
  contentId: string;
  creatorId: string;
  currentUserId?: string;
  onEngagement?: (type: 'like' | 'comment' | 'share', contentId: string) => void;
  className?: string;
}

interface EngagementStats {
  likes: number;
  comments: number;
  shares: number;
  totalRewards: number;
}

interface RewardTier {
  name: string;
  icon: React.ReactNode;
  threshold: number;
  reward: number;
  color: string;
}

const rewardTiers: RewardTier[] = [
  {
    name: 'Supporter',
    icon: <Heart className="w-4 h-4" />,
    threshold: 1,
    reward: 1,
    color: 'text-red-400'
  },
  {
    name: 'Engager',
    icon: <MessageCircle className="w-4 h-4" />,
    threshold: 5,
    reward: 5,
    color: 'text-blue-400'
  },
  {
    name: 'Influencer',
    icon: <Share2 className="w-4 h-4" />,
    threshold: 10,
    reward: 10,
    color: 'text-green-400'
  },
  {
    name: 'Champion',
    icon: <Trophy className="w-4 h-4" />,
    threshold: 25,
    reward: 25,
    color: 'text-yellow-400'
  },
  {
    name: 'Legend',
    icon: <Star className="w-4 h-4" />,
    threshold: 50,
    reward: 50,
    color: 'text-purple-400'
  }
];

export function AudienceRewards({
  contentId,
  creatorId,
  currentUserId,
  onEngagement,
  className = ''
}: AudienceRewardsProps) {
  const [stats, setStats] = useState<EngagementStats>({
    likes: 0,
    comments: 0,
    shares: 0,
    totalRewards: 0
  });

  const [userEngagements, setUserEngagements] = useState({
    liked: false,
    commented: false,
    shared: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState('');

  // Mock data - in real app, this would come from API
  useEffect(() => {
    // Simulate loading engagement stats
    setStats({
      likes: Math.floor(Math.random() * 100) + 10,
      comments: Math.floor(Math.random() * 50) + 5,
      shares: Math.floor(Math.random() * 25) + 2,
      totalRewards: Math.floor(Math.random() * 500) + 100
    });
  }, [contentId]);

  const handleEngagement = async (type: 'like' | 'comment' | 'share') => {
    if (!currentUserId) {
      alert('Please connect your wallet to engage with content');
      return;
    }

    setIsLoading(true);

    try {
      // In real app, this would call the smart contract
      console.log(`${type} engagement for content ${contentId}`);

      // Update local state
      setStats(prev => ({
        ...prev,
        [type === 'like' ? 'likes' : type === 'comment' ? 'comments' : 'shares']:
          prev[type === 'like' ? 'likes' : type === 'comment' ? 'comments' : 'shares'] + 1
      }));

      setUserEngagements(prev => ({
        ...prev,
        [type === 'like' ? 'liked' : type === 'comment' ? 'commented' : 'shared']: true
      }));

      onEngagement?.(type, contentId);

      // Show reward notification
      showRewardNotification(type);

    } catch (error) {
      console.error('Engagement error:', error);
      alert('Failed to process engagement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showRewardNotification = (type: string) => {
    // In real app, this would show a toast notification
    console.log(`🎉 You earned ${getRewardAmount(type)} tokens for ${type}ing this content!`);
  };

  const getRewardAmount = (type: string): number => {
    switch (type) {
      case 'like': return 1;
      case 'comment': return 2;
      case 'share': return 3;
      default: return 0;
    }
  };

  const handleTip = async () => {
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      alert('Please enter a valid tip amount');
      return;
    }

    setIsLoading(true);

    try {
      // In real app, this would call the smart contract to send tip
      console.log(`Sending ${tipAmount} tokens as tip to creator ${creatorId}`);

      setShowTipModal(false);
      setTipAmount('');

      alert(`🎉 Tip of ${tipAmount} tokens sent successfully!`);

    } catch (error) {
      console.error('Tip error:', error);
      alert('Failed to send tip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentTier = (totalEngagements: number): RewardTier | null => {
    for (let i = rewardTiers.length - 1; i >= 0; i--) {
      if (totalEngagements >= rewardTiers[i].threshold) {
        return rewardTiers[i];
      }
    }
    return null;
  };

  const getNextTier = (totalEngagements: number): RewardTier | null => {
    for (const tier of rewardTiers) {
      if (totalEngagements < tier.threshold) {
        return tier;
      }
    }
    return null;
  };

  const totalUserEngagements = (userEngagements.liked ? 1 : 0) +
                               (userEngagements.commented ? 1 : 0) +
                               (userEngagements.shared ? 1 : 0);

  const currentTier = getCurrentTier(totalUserEngagements);
  const nextTier = getNextTier(totalUserEngagements);
  const progressToNextTier = nextTier ?
    (totalUserEngagements / nextTier.threshold) * 100 : 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Engagement Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Community Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                <Heart className="w-4 h-4" />
                <span className="font-semibold">{stats.likes}</span>
              </div>
              <p className="text-xs text-muted-foreground">Likes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                <MessageCircle className="w-4 h-4" />
                <span className="font-semibold">{stats.comments}</span>
              </div>
              <p className="text-xs text-muted-foreground">Comments</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                <Share2 className="w-4 h-4" />
                <span className="font-semibold">{stats.shares}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shares</p>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-accent mb-1">
              <Coins className="w-4 h-4" />
              <span className="font-semibold">{stats.totalRewards}</span>
            </div>
            <p className="text-xs text-muted-foreground">Total Rewards Distributed</p>
          </div>
        </CardContent>
      </Card>

      {/* User Engagement Actions */}
      {currentUserId && (
        <Card>
          <CardHeader>
            <CardTitle>Engage & Earn Rewards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={userEngagements.liked ? "default" : "outline"}
                size="sm"
                onClick={() => handleEngagement('like')}
                disabled={isLoading || userEngagements.liked}
                className="flex-1"
              >
                <Heart className={`w-4 h-4 mr-1 ${userEngagements.liked ? 'fill-current' : ''}`} />
                {userEngagements.liked ? 'Liked' : 'Like'} (+{getRewardAmount('like')} tokens)
              </Button>

              <Button
                variant={userEngagements.commented ? "default" : "outline"}
                size="sm"
                onClick={() => handleEngagement('comment')}
                disabled={isLoading || userEngagements.commented}
                className="flex-1"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {userEngagements.commented ? 'Commented' : 'Comment'} (+{getRewardAmount('comment')} tokens)
              </Button>

              <Button
                variant={userEngagements.shared ? "default" : "outline"}
                size="sm"
                onClick={() => handleEngagement('share')}
                disabled={isLoading || userEngagements.shared}
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-1" />
                {userEngagements.shared ? 'Shared' : 'Share'} (+{getRewardAmount('share')} tokens)
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowTipModal(true)}
              className="w-full"
            >
              <Coins className="w-4 h-4 mr-2" />
              Send Tip
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reward Tiers */}
      {currentUserId && (
        <Card>
          <CardHeader>
            <CardTitle>Your Reward Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentTier && (
              <div className="text-center p-3 bg-accent/10 rounded-lg">
                <div className={`flex items-center justify-center gap-2 mb-1 ${currentTier.color}`}>
                  {currentTier.icon}
                  <span className="font-semibold">{currentTier.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {totalUserEngagements} engagements • {currentTier.reward} tokens earned
                </p>
              </div>
            )}

            {nextTier && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to {nextTier.name}</span>
                  <span>{totalUserEngagements}/{nextTier.threshold}</span>
                </div>
                <ProgressBar progress={progressToNextTier} className="w-full" />
                <p className="text-xs text-muted-foreground text-center">
                  {nextTier.threshold - totalUserEngagements} more engagements for {nextTier.reward} bonus tokens
                </p>
              </div>
            )}

            {/* Reward Tiers Grid */}
            <div className="grid grid-cols-5 gap-2">
              {rewardTiers.map((tier, index) => (
                <div
                  key={tier.name}
                  className={`text-center p-2 rounded border ${
                    totalUserEngagements >= tier.threshold
                      ? 'bg-accent/20 border-accent'
                      : 'bg-surface border-border'
                  }`}
                >
                  <div className={`mb-1 ${totalUserEngagements >= tier.threshold ? tier.color : 'text-muted-foreground'}`}>
                    {tier.icon}
                  </div>
                  <p className="text-xs font-medium">{tier.name}</p>
                  <p className="text-xs text-muted-foreground">{tier.threshold}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-accent" />
                Send Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tip Amount (in tokens)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowTipModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTip}
                  disabled={isLoading || !tipAmount}
                  className="flex-1"
                >
                  {isLoading ? 'Sending...' : 'Send Tip'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

