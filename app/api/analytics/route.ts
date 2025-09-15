import { NextRequest, NextResponse } from 'next/server';

// Mock analytics data - in real app, this would be computed from actual data
const generateMockAnalytics = (creatorId: string, timeRange: string) => {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;

  // Generate trending data
  const views = Array.from({ length: days }, () => Math.floor(Math.random() * 1000) + 500);
  const engagement = Array.from({ length: days }, () => Math.floor(Math.random() * 100) + 50);
  const revenue = Array.from({ length: days }, () => Math.floor(Math.random() * 50) + 10);

  const dates = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return date.toISOString().split('T')[0];
  });

  // Calculate totals
  const totalViews = views.reduce((sum, v) => sum + v, 0);
  const totalEngagement = engagement.reduce((sum, e) => sum + e, 0);
  const totalRevenue = revenue.reduce((sum, r) => sum + r, 0);

  // Calculate growth rates (comparing to previous period)
  const midPoint = Math.floor(days / 2);
  const firstHalf = views.slice(0, midPoint).reduce((sum, v) => sum + v, 0);
  const secondHalf = views.slice(midPoint).reduce((sum, v) => sum + v, 0);
  const growthRate = ((secondHalf - firstHalf) / firstHalf) * 100;

  // Mock top content
  const topContent = [
    {
      id: '1',
      title: 'Digital Art Masterpiece',
      views: Math.floor(totalViews * 0.3),
      engagement: Math.floor(totalEngagement * 0.25),
      revenue: totalRevenue * 0.4,
      growth: 15.3
    },
    {
      id: '2',
      title: 'Music Collaboration',
      views: Math.floor(totalViews * 0.25),
      engagement: Math.floor(totalEngagement * 0.2),
      revenue: totalRevenue * 0.3,
      growth: 8.7
    },
    {
      id: '3',
      title: 'Remix Collection',
      views: Math.floor(totalViews * 0.2),
      engagement: Math.floor(totalEngagement * 0.15),
      revenue: totalRevenue * 0.2,
      growth: -2.1
    }
  ];

  // Mock engagement breakdown
  const engagementBreakdown = {
    likes: Math.floor(totalEngagement * 0.4),
    comments: Math.floor(totalEngagement * 0.3),
    shares: Math.floor(totalEngagement * 0.2),
    remixes: Math.floor(totalEngagement * 0.1)
  };

  // Mock revenue breakdown
  const revenueBreakdown = {
    contentSales: totalRevenue * 0.5,
    tips: totalRevenue * 0.25,
    remixes: totalRevenue * 0.2,
    subscriptions: totalRevenue * 0.05
  };

  // Mock audience demographics
  const audienceDemographics = {
    ageGroups: {
      '18-24': 25,
      '25-34': 35,
      '35-44': 25,
      '45+': 15
    },
    locations: {
      'United States': 40,
      'Europe': 30,
      'Asia': 20,
      'Other': 10
    },
    interests: ['Digital Art', 'Music', 'Technology', 'Gaming', 'Design']
  };

  return {
    creatorId,
    timeRange,
    summary: {
      totalViews,
      totalEngagement,
      totalRevenue,
      growthRate,
      engagementRate: (totalEngagement / totalViews) * 100
    },
    trends: {
      views,
      engagement,
      revenue,
      dates
    },
    topContent,
    engagementBreakdown,
    revenueBreakdown,
    audienceDemographics,
    generatedAt: new Date().toISOString()
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    const timeRange = searchParams.get('timeRange') || '30d';
    const metric = searchParams.get('metric'); // views, engagement, revenue

    if (!creatorId) {
      return NextResponse.json(
        { error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    const analytics = generateMockAnalytics(creatorId, timeRange);

    if (metric) {
      // Return specific metric data
      if (metric === 'summary') {
        return NextResponse.json(analytics.summary);
      }

      if (metric === 'trends') {
        return NextResponse.json(analytics.trends);
      }

      if (metric === 'topContent') {
        return NextResponse.json(analytics.topContent);
      }

      if (metric === 'engagement') {
        return NextResponse.json(analytics.engagementBreakdown);
      }

      if (metric === 'revenue') {
        return NextResponse.json(analytics.revenueBreakdown);
      }

      if (metric === 'demographics') {
        return NextResponse.json(analytics.audienceDemographics);
      }

      return NextResponse.json(
        { error: 'Invalid metric specified' },
        { status: 400 }
      );
    }

    // Return full analytics
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, creatorId, contentId, userId, engagementType } = body;

    if (!type || !creatorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Record analytics event
    const event = {
      eventId: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      creatorId,
      contentId,
      userId,
      engagementType,
      timestamp: new Date().toISOString(),
      metadata: body.metadata || {}
    };

    // In a real app, this would be stored in a database
    console.log('Analytics event recorded:', event);

    // Update real-time metrics (in a real app, this would update cached metrics)
    if (type === 'view' && contentId) {
      // Increment view count for content
      console.log(`View recorded for content ${contentId}`);
    }

    if (type === 'engagement' && engagementType && contentId) {
      // Record engagement
      console.log(`${engagementType} recorded for content ${contentId} by user ${userId}`);
    }

    return NextResponse.json({
      success: true,
      event,
      message: 'Analytics event recorded successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error recording analytics event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get real-time metrics
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');

    if (!creatorId) {
      return NextResponse.json(
        { error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    // Mock real-time metrics
    const realTimeMetrics = {
      activeUsers: Math.floor(Math.random() * 100) + 50,
      currentViews: Math.floor(Math.random() * 20) + 5,
      recentEngagements: Math.floor(Math.random() * 50) + 10,
      topContent: [
        {
          id: '1',
          title: 'Trending Content',
          views: Math.floor(Math.random() * 100) + 50,
          engagement: Math.floor(Math.random() * 20) + 5
        }
      ],
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(realTimeMetrics);
  } catch (error) {
    console.error('Error fetching real-time metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

