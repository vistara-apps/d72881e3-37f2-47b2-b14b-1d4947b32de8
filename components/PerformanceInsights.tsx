'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Eye, Heart, DollarSign, Calendar, Download } from 'lucide-react'
import { PerformanceMetrics } from '@/lib/types'

// Mock data
const mockMetrics: PerformanceMetrics[] = [
  { contentId: '1', views: 1200, engagement: 85, revenue: 0.045, remixes: 12, period: 'day' },
  { contentId: '2', views: 2100, engagement: 156, revenue: 0.078, remixes: 8, period: 'day' },
  { contentId: '3', views: 890, engagement: 67, revenue: 0.032, remixes: 5, period: 'day' },
]

const timeSeriesData = [
  { date: '2024-01-01', views: 1200, revenue: 0.045, engagement: 85 },
  { date: '2024-01-02', views: 1350, revenue: 0.052, engagement: 92 },
  { date: '2024-01-03', views: 1180, revenue: 0.048, engagement: 78 },
  { date: '2024-01-04', views: 1420, revenue: 0.061, engagement: 105 },
  { date: '2024-01-05', views: 1680, revenue: 0.073, engagement: 118 },
  { date: '2024-01-06', views: 1520, revenue: 0.065, engagement: 98 },
  { date: '2024-01-07', views: 1890, revenue: 0.082, engagement: 132 },
]

const contentTypeData = [
  { name: 'Images', value: 45, color: '#8884d8' },
  { name: 'Videos', value: 30, color: '#82ca9d' },
  { name: 'Tutorials', value: 15, color: '#ffc658' },
  { name: 'Music', value: 10, color: '#ff7300' },
]

interface PerformanceInsightsProps {
  userId: string
  timeRange?: 'day' | 'week' | 'month' | 'year'
}

export function PerformanceInsights({ userId, timeRange = 'week' }: PerformanceInsightsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'revenue' | 'engagement'>('views')
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d')

  const totalViews = mockMetrics.reduce((sum, m) => sum + m.views, 0)
  const totalRevenue = mockMetrics.reduce((sum, m) => sum + m.revenue, 0)
  const totalEngagement = mockMetrics.reduce((sum, m) => sum + m.engagement, 0)

  const exportData = () => {
    // Export analytics data
    console.log('Exporting data...')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Performance Insights</h2>
          <p className="text-text/80">Track your content performance and audience engagement</p>
        </div>
        <button onClick={exportData} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-text/60">Total Views</p>
              <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
              <p className="text-sm text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12.5%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-text/60">Total Revenue</p>
              <p className="text-2xl font-bold">{totalRevenue.toFixed(4)} ETH</p>
              <p className="text-sm text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8.2%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-text/60">Engagement</p>
              <p className="text-2xl font-bold">{totalEngagement}</p>
              <p className="text-sm text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +15.3%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Performance Over Time</h3>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded text-sm ${
                  selectedPeriod === period
                    ? 'bg-accent text-text'
                    : 'bg-surface text-text/80 hover:bg-border'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          {(['views', 'revenue', 'engagement'] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                selectedMetric === metric
                  ? 'bg-accent text-text'
                  : 'bg-surface text-text/80 hover:bg-border'
              }`}
            >
              {metric}
            </button>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke="#00D4AA"
                strokeWidth={2}
                dot={{ fill: '#00D4AA', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Content Performance & Content Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Content */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Top Performing Content</h3>
          <div className="space-y-4">
            {mockMetrics
              .sort((a, b) => b.views - a.views)
              .slice(0, 5)
              .map((metric, index) => (
                <div key={metric.contentId} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Content #{metric.contentId}</p>
                    <p className="text-sm text-text/60">
                      {metric.views} views • {metric.revenue.toFixed(4)} ETH
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-accent">
                      {((metric.revenue / metric.views) * 1000).toFixed(2)} ETH/1K views
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Content Type Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Content Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {contentTypeData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Insights & Recommendations</h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <h4 className="font-medium text-green-400 mb-2">Trending Content</h4>
            <p className="text-sm text-text/80">
              Your tutorial content is performing 40% better than average. Consider creating more educational content.
            </p>
          </div>

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <h4 className="font-medium text-yellow-400 mb-2">Engagement Opportunity</h4>
            <p className="text-sm text-text/80">
              Content with interactive elements gets 2x more engagement. Try adding polls or Q&A sections.
            </p>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="font-medium text-blue-400 mb-2">Revenue Optimization</h4>
            <p className="text-sm text-text/80">
              Setting up revenue splits increases average earnings by 25%. Configure splits for your top content.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

