'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';

interface PerformanceInsightsProps {
  creatorId: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange?: (range: string) => void;
  className?: string;
}

interface AnalyticsData {
  totalViews: number;
  totalEngagement: number;
  totalRevenue: number;
  growthRate: number;
  topContent: ContentPerformance[];
  engagementBreakdown: {
    likes: number;
    comments: number;
    shares: number;
    remixes: number;
  };
  revenueBreakdown: {
    contentSales: number;
    tips: number;
    remixes: number;
    subscriptions: number;
  };
  audienceDemographics: {
    ageGroups: { [key: string]: number };
    locations: { [key: string]: number };
    interests: string[];
  };
  trends: {
    views: number[];
    engagement: number[];
    revenue: number[];
    dates: string[];
  };
}

interface ContentPerformance {
  id: string;
  title: string;
  views: number;
  engagement: number;
  revenue: number;
  growth: number;
}

const timeRanges = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y', label: '1 Year' }
];

export function PerformanceInsights({
  creatorId,
  timeRange = '30d',
  onTimeRangeChange,
  className = ''
}: PerformanceInsightsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'engagement' | 'revenue'>('views');

  useEffect(() => {
    loadAnalyticsData();
  }, [creatorId, timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);

    try {
      // Mock data - in real app, this would come from API
      const mockData: AnalyticsData = {
        totalViews: Math.floor(Math.random() * 100000) + 50000,
        totalEngagement: Math.floor(Math.random() * 10000) + 5000,
        totalRevenue: Math.floor(Math.random() * 5000) + 1000,
        growthRate: (Math.random() - 0.5) * 40, // -20% to +20%
        topContent: [
          {
            id: '1',
            title: 'Digital Art Masterpiece',
            views: 15420,
            engagement: 892,
            revenue: 247.50,
            growth: 15.3
          },
          {
            id: '2',
            title: 'Music Collaboration',
            views: 12350,
            engagement: 567,
            revenue: 189.30,
            growth: 8.7
          },
          {
            id: '3',
            title: 'Remix Collection',
            views: 9870,
            engagement: 445,
            revenue: 156.80,
            growth: -2.1
          }
        ],
        engagementBreakdown: {
          likes: Math.floor(Math.random() * 5000) + 2000,
          comments: Math.floor(Math.random() * 2000) + 500,
          shares: Math.floor(Math.random() * 1000) + 200,
          remixes: Math.floor(Math.random() * 500) + 100
        },
        revenueBreakdown: {
          contentSales: Math.floor(Math.random() * 2000) + 500,
          tips: Math.floor(Math.random() * 1000) + 200,
          remixes: Math.floor(Math.random() * 1500) + 300,
          subscriptions: Math.floor(Math.random() * 500) + 100
        },
        audienceDemographics: {
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
        },
        trends: {
          views: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000) + 500),
          engagement: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 50),
          revenue: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 10),
          dates: Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toISOString().split('T')[0];
          })
        }
      };

      setData(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-surface rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">Performance Insights</h2>
        <div className="flex items-center gap-2">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeRangeChange?.(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{formatNumber(data.totalViews)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {data.growthRate >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm ${data.growthRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Math.abs(data.growthRate).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Engagement</p>
                <p className="text-2xl font-bold">{formatNumber(data.totalEngagement)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {((data.totalEngagement / data.totalViews) * 100).toFixed(1)}% engagement rate
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(data.totalRevenue / data.totalViews * 1000)} per 1K views
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Trends Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            {[
              { key: 'views', label: 'Views', color: 'bg-blue-400' },
              { key: 'engagement', label: 'Engagement', color: 'bg-green-400' },
              { key: 'revenue', label: 'Revenue', color: 'bg-yellow-400' }
            ].map((metric) => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key as any)}
                className={`flex items-center gap-2 px-3 py-1 rounded ${
                  selectedMetric === metric.key ? 'bg-accent text-white' : 'bg-surface'
                }`}
              >
                <div className={`w-3 h-3 rounded ${metric.color}`}></div>
                {metric.label}
              </button>
            ))}
          </div>

          {/* Simple chart visualization */}
          <div className="h-64 flex items-end justify-between gap-1">
            {data.trends[selectedMetric].map((value, index) => {
              const maxValue = Math.max(...data.trends[selectedMetric]);
              const height = (value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-accent/60 rounded-t min-h-[4px]"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  ></div>
                  {index % 7 === 0 && (
                    <span className="text-xs text-muted-foreground mt-1 transform -rotate-45 origin-top-left">
                      {data.trends.dates[index].slice(-2)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Engagement Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(data.engagementBreakdown).map(([type, count]) => {
              const percentage = (count / data.totalEngagement) * 100;
              const icons = {
                likes: Heart,
                comments: MessageCircle,
                shares: Share2,
                remixes: Activity
              };
              const colors = {
                likes: 'text-red-400',
                comments: 'text-blue-400',
                shares: 'text-green-400',
                remixes: 'text-purple-400'
              };
              const Icon = icons[type as keyof typeof icons];

              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${colors[type as keyof typeof colors]}`} />
                    <span className="capitalize">{type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatNumber(count)}</span>
                    <span className="text-sm text-muted-foreground">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(data.revenueBreakdown).map(([source, amount]) => {
              const percentage = (amount / data.totalRevenue) * 100;
              return (
                <div key={source} className="flex items-center justify-between">
                  <span className="capitalize">{source.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatCurrency(amount)}</span>
                    <span className="text-sm text-muted-foreground">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Top Content */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topContent.map((content, index) => (
              <div key={content.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{content.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatNumber(content.views)} views</span>
                      <span>{formatNumber(content.engagement)} engagement</span>
                      <span>{formatCurrency(content.revenue)} revenue</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {content.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm ${content.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {content.growth >= 0 ? '+' : ''}{content.growth.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audience Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Audience Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Age Groups</h4>
              <div className="space-y-2">
                {Object.entries(data.audienceDemographics.ageGroups).map(([age, percentage]) => (
                  <div key={age} className="flex items-center justify-between">
                    <span className="text-sm">{age}</span>
                    <div className="flex items-center gap-2">
                      <ProgressBar progress={percentage} className="w-20" />
                      <span className="text-sm text-muted-foreground w-8">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Top Locations</h4>
              <div className="space-y-2">
                {Object.entries(data.audienceDemographics.locations).map(([location, percentage]) => (
                  <div key={location} className="flex items-center justify-between">
                    <span className="text-sm">{location}</span>
                    <div className="flex items-center gap-2">
                      <ProgressBar progress={percentage} className="w-20" />
                      <span className="text-sm text-muted-foreground w-8">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-3">Top Interests</h4>
            <div className="flex flex-wrap gap-2">
              {data.audienceDemographics.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

