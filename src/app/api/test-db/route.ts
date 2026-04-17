import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('Direct DB Test: Starting...');
    await connectToDatabase();
    
    // Get database instance
    const db = mongoose.connection.db;
    console.log('Direct DB Test: Database name:', db.databaseName);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Direct DB Test: Collections found:', collections.map(c => c.name));
    
    // Check explore_dehradun collection
    const exploreCollection = db.collection('explore_dehradun');
    const totalDocs = await exploreCollection.countDocuments();
    console.log('Direct DB Test: Total documents in explore_dehradun:', totalDocs);
    
    // Get sample documents to see structure
    const sampleDocs = await exploreCollection.find({}).limit(5).toArray();
    console.log('Direct DB Test: Sample document structure:', sampleDocs[0] ? Object.keys(sampleDocs[0]) : 'No documents');
    
    // Try to identify categories vs articles
    const categories = sampleDocs.filter(doc => doc.name && doc.slug && !doc.title);
    const articles = sampleDocs.filter(doc => doc.title && doc.slug);
    
    console.log('Direct DB Test: Identified categories:', categories.length, 'articles:', articles.length);
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      database: db.databaseName,
      collections: collections.map(c => c.name),
      totalDocuments: totalDocs,
      identifiedCategories: categories.length,
      identifiedArticles: articles.length,
      sampleCategories: categories.map(cat => ({
        id: cat._id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description
      })),
      sampleArticles: articles.map(article => ({
        id: article._id,
        title: article.title,
        slug: article.slug,
        category: article.category
      }))
    });
  } catch (error) {
    console.error('Direct DB Test Error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
