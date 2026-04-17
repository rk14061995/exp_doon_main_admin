import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Subscription from '@/lib/models/Subscription';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isActive = searchParams.get('isActive');
    
    const query: any = {};
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    const skip = (page - 1) * limit;
    
    const subscriptions = await Subscription.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Subscription.countDocuments(query);
    
    return NextResponse.json({
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    const subscription = new Subscription(body);
    await subscription.save();
    
    return NextResponse.json(subscription, { status: 201 });
  } catch (error: any) {
    console.error('Create subscription error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
