'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  Eye, 
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react';

interface DashboardStats {
  content: number;
  subscriptions: number;
  comments: number;
  views: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  date: string;
  status: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    content: 0,
    subscriptions: 0,
    comments: 0,
    views: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [contentRes, subscriptionsRes, commentsRes, analyticsRes] = await Promise.all([
        fetch('/api/content?limit=5'),
        fetch('/api/subscriptions?limit=5'),
        fetch('/api/comments?limit=5'),
        fetch('/api/analytics?limit=50'),
      ]);

      const contentData = await contentRes.json();
      const subscriptionsData = await subscriptionsRes.json();
      const commentsData = await commentsRes.json();
      const analyticsData = await analyticsRes.json();

      setStats({
        content: contentData.pagination?.total || 0,
        subscriptions: subscriptionsData.pagination?.total || 0,
        comments: commentsData.pagination?.total || 0,
        views: analyticsData.rawData?.reduce((total: number, item: any) => total + item.views, 0) || 0,
      });

      const activity: RecentActivity[] = [
        ...(contentData.content || []).map((item: any) => ({
          id: item._id,
          type: 'content',
          title: item.title,
          date: item.createdAt,
          status: item.status,
        })),
        ...(commentsData.comments || []).map((item: any) => ({
          id: item._id,
          type: 'comment',
          title: `${item.name} on ${item.page}`,
          date: item.createdAt,
          status: item.status,
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Content',
      value: stats.content,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Subscriptions',
      value: stats.subscriptions,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Comments',
      value: stats.comments,
      icon: MessageSquare,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Views',
      value: stats.views,
      icon: Eye,
      color: 'bg-purple-500',
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Explore Dehradun Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        activity.type === 'content' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.status === 'published' || activity.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : activity.status === 'draft' || activity.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/admin/content/new"
                className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FileText className="h-5 w-5 mr-2" />
                New Content
              </a>
              <a
                href="/admin/analytics"
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                View Analytics
              </a>
              <a
                href="/admin/comments"
                className="flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Moderate Comments
              </a>
              <a
                href="/admin/seo"
                className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Manage SEO
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
