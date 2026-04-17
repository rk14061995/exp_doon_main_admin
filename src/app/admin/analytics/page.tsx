'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Calendar } from 'lucide-react';

interface AnalyticsData {
  page: string;
  totalViews: number;
  totalVisitors: number;
  dailyStats: Array<{
    date: string;
    views: number;
    visitors: number;
  }>;
}

interface OverallStats {
  totalViews: number;
  totalVisitors: number;
  totalPages: number;
  avgViewsPerPage: number;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalViews: 0,
    totalVisitors: 0,
    totalPages: 0,
    avgViewsPerPage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      
      if (selectedPeriod === '7days') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (selectedPeriod === '30days') {
        startDate.setDate(endDate.getDate() - 30);
      } else if (selectedPeriod === '90days') {
        startDate.setDate(endDate.getDate() - 90);
      }

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const response = await fetch(`/api/analytics?${params}`);
      const data = await response.json();

      setAnalyticsData(data.analytics || []);
      
      // Calculate overall stats
      const stats = (data.analytics || []).reduce(
        (acc: OverallStats, item: AnalyticsData) => {
          acc.totalViews += item.totalViews;
          acc.totalVisitors += item.totalVisitors;
          acc.totalPages += 1;
          return acc;
        },
        { totalViews: 0, totalVisitors: 0, totalPages: 0, avgViewsPerPage: 0 }
      );

      stats.avgViewsPerPage = stats.totalPages > 0 ? Math.round(stats.totalViews / stats.totalPages) : 0;
      setOverallStats(stats);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Views',
      value: overallStats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      title: 'Unique Visitors',
      value: overallStats.totalVisitors.toLocaleString(),
      icon: Users,
      color: 'bg-green-500',
      trend: '+8%',
    },
    {
      title: 'Pages Tracked',
      value: overallStats.totalPages,
      icon: BarChart3,
      color: 'bg-purple-500',
      trend: '+2',
    },
    {
      title: 'Avg Views/Page',
      value: overallStats.avgViewsPerPage.toLocaleString(),
      icon: TrendingUp,
      color: 'bg-yellow-500',
      trend: '+5%',
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your website performance and user engagement</p>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.trend} from last period</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page Performance */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Page Performance</h2>
        </div>
        <div className="p-6">
          {analyticsData.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-900">No analytics data available</p>
              <p className="text-sm text-gray-500 mt-2">Start tracking your website performance</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analyticsData
                .sort((a, b) => b.totalViews - a.totalViews)
                .slice(0, 10)
                .map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{page.page}</p>
                        <p className="text-xs text-gray-500">
                          {page.totalVisitors} unique visitors
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{page.totalViews.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">views</p>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min((page.totalViews / overallStats.totalViews) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Pages by Views</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {analyticsData
                .sort((a, b) => b.totalViews - a.totalViews)
                .slice(0, 5)
                .map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="text-sm text-gray-900">{page.page}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {page.totalViews.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Pages by Visitors</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {analyticsData
                .sort((a, b) => b.totalVisitors - a.totalVisitors)
                .slice(0, 5)
                .map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="text-sm text-gray-900">{page.page}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {page.totalVisitors.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
