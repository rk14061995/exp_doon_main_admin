import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SEO from '@/lib/models/SEO';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const seo = await SEO.findById(params.id);
    
    if (!seo) {
      return NextResponse.json(
        { error: 'SEO data not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(seo);
  } catch (error) {
    console.error('Get SEO error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO data' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    const seo = await SEO.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!seo) {
      return NextResponse.json(
        { error: 'SEO data not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(seo);
  } catch (error: any) {
    console.error('Update SEO error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'SEO data for this page already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update SEO data' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const seo = await SEO.findByIdAndDelete(params.id);
    
    if (!seo) {
      return NextResponse.json(
        { error: 'SEO data not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'SEO data deleted successfully' });
  } catch (error) {
    console.error('Delete SEO error:', error);
    return NextResponse.json(
      { error: 'Failed to delete SEO data' },
      { status: 500 }
    );
  }
}
