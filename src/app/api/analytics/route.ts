import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Analytics from '@/lib/models/Analytics';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const query: any = {};
    
    if (page) query.page = page;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const analytics = await Analytics.find(query)
      .sort({ date: -1 })
      .limit(1000);
    
    // Aggregate data for dashboard
    const aggregatedData = analytics.reduce((acc: any, item) => {
      const pageKey = item.page;
      
      if (!acc[pageKey]) {
        acc[pageKey] = {
          page: pageKey,
          totalViews: 0,
          totalVisitors: 0,
          dailyStats: [],
        };
      }
      
      acc[pageKey].totalViews += item.views;
      acc[pageKey].totalVisitors += item.uniqueVisitors;
      acc[pageKey].dailyStats.push({
        date: item.date,
        views: item.views,
        visitors: item.uniqueVisitors,
      });
      
      return acc;
    }, {});
    
    return NextResponse.json({
      analytics: Object.values(aggregatedData),
      rawData: analytics,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    const analytics = new Analytics(body);
    await analytics.save();
    
    return NextResponse.json(analytics, { status: 201 });
  } catch (error) {
    console.error('Create analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to create analytics record' },
      { status: 500 }
    );
  }
}
