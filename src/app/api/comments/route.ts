import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Comment from '@/lib/models/Comment';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const status = searchParams.get('status');
    const page_num = parseInt(searchParams.get('page_num') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const query: any = {};
    if (page) query.page = page;
    if (status) query.status = status;
    
    const skip = (page_num - 1) * limit;
    
    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Comment.countDocuments(query);
    
    return NextResponse.json({
      comments,
      pagination: {
        page: page_num,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    const comment = new Comment(body);
    await comment.save();
    
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
