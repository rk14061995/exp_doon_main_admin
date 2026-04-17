import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Article from '@/lib/models/Article';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('API: Getting article with ID:', id);
    
    await connectToDatabase();
    const article = await Article.findById(id).populate('category', 'name slug');
    
    console.log('API: Found article:', article ? 'Yes' : 'No');
    
    if (!article) {
      console.log('API: Article not found');
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    console.log('API: Returning article data');
    return NextResponse.json(article);
  } catch (error) {
    console.error('API: Get article error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    console.log('API: Updating article with ID:', id);
    
    await connectToDatabase();
    
    const article = await Article.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');
    
    if (!article) {
      console.log('API: Article not found for update');
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    console.log('API: Article updated successfully');
    return NextResponse.json(article);
  } catch (error: any) {
    console.error('API: Update article error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Article with this slug already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update article' },
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
    const article = await Article.findByIdAndDelete(params.id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
