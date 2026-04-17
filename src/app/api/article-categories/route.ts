import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ArticleCategory, { IArticleCategory } from '@/lib/models/ArticleCategory';

export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching categories...');
    
    // Test database connection first
    await connectToDatabase();
    console.log('API: Database connected successfully');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    console.log('API: Query params - page:', page, 'limit:', limit);
    
    const skip = (page - 1) * limit;
    
    // Get all categories without any filters since your schema doesn't have isActive
    console.log('API: Querying ArticleCategory collection...');
    const categories = await ArticleCategory.find({})
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);
    
    console.log('API: Categories found:', categories.length);
    console.log('API: Sample category:', categories[0] ? 'Yes' : 'No');
    
    const total = await ArticleCategory.countDocuments();
    console.log('API: Total count:', total);
    
    const response = {
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
    
    console.log('API: Sending response with', categories.length, 'categories');
    return NextResponse.json(response);
  } catch (error) {
    console.error('API: Get categories error:', error);
    console.error('API: Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    const category = new ArticleCategory(body);
    await category.save();
    
    // Populate parent category for response
    await category.populate('parentCategory', 'name slug');
    
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Create category error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
