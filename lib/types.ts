export interface User {
  userId: string;
  farcasterId: string;
  walletAddress: string;
  username: string;
  avatarUrl: string;
  followers: number;
  following: number;
}

export interface ContentPiece {
  contentId: string;
  creatorId: string;
  title: string;
  description: string;
  mediaUrl: string;
  createdAt: Date;
  tags: string[];
  revenueShareSplitId: string;
  views: number;
  likes: number;
  remixes: number;
}

export interface Remix {
  remixId: string;
  originalContentId: string;
  creatorId: string;
  remixContentUrl: string;
  createdAt: Date;
  revenueShareSplitId: string;
  attributedTo: string[];
}

export interface RevenueSplit {
  splitId: string;
  contentId: string;
  splitDetails: {
    address: string;
    percentage: number;
    name: string;
  }[];
  createdAt: Date;
  totalRevenue: number;
}

export interface EngagementReward {
  rewardId: string;
  userId: string;
  contentId: string;
  rewardType: 'like' | 'comment' | 'share' | 'remix' | 'tip';
  amount: number;
  createdAt: Date;
}

export interface DashboardStats {
  totalRevenue: number;
  totalViews: number;
  totalRemixes: number;
  engagementRate: number;
  topContent: ContentPiece[];
  recentActivity: EngagementReward[];
}
