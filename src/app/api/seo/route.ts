import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SEO from '@/lib/models/SEO';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    
    let query = {};
    if (page) {
      query = { page };
    }
    
    const seoData = await SEO.find(query).sort({ page: 1 });
    
    return NextResponse.json({ seo: seoData });
  } catch (error) {
    console.error('Get SEO error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    const seo = new SEO(body);
    await seo.save();
    
    return NextResponse.json(seo, { status: 201 });
  } catch (error: any) {
    console.error('Create SEO error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'SEO data for this page already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create SEO data' },
      { status: 500 }
    );
  }
}
