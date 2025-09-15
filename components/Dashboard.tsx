'use client';

import { DashboardStats } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { TrendingUp, Users, Zap, Eye, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { CircularProgress } from './ui/CircularProgress';
import { ProgressBar } from './ui/ProgressBar';

interface DashboardProps {
  stats: DashboardStats;
  className?: string;
}

export function Dashboard({ stats, className }: DashboardProps) {
  return (
    <div className={className}>
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-accent">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold text-primary">
                {formatNumber(stats.totalViews)}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Engagement Rate Circle */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Creator Economy</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CircularProgress
              value={stats.engagementRate}
              size="xl"
              label="Engagement"
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {stats.engagementRate}% above average
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm">Remix Rate</span>
              </div>
              <span className="font-semibold">80/100</span>
            </div>
            <ProgressBar value={80} max={100} />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm">Growth Rate</span>
              </div>
              <span className="font-semibold">65/100</span>
            </div>
            <ProgressBar value={65} max={100} />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <span className="text-sm">Community</span>
              </div>
              <span className="font-semibold">92/100</span>
            </div>
            <ProgressBar value={92} max={100} />
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 hover:shadow-neon-sm transition-all duration-200 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">Revenue Sharing</h3>
              <p className="text-sm text-muted-foreground">Manage splits</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-neon-sm transition-all duration-200 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Creative Remix</h3>
              <p className="text-sm text-muted-foreground">User-Centric Tools</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
