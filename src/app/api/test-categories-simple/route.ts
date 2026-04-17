import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('Simple Test: Starting...');
    
    // Test database connection
    await connectToDatabase();
    console.log('Simple Test: Database connected');
    
    // Get database instance
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }
    console.log('Simple Test: Database name:', db.databaseName);
    
    // Test direct collection access
    const collection = db.collection('articleCategories');
    const count = await collection.countDocuments();
    console.log('Simple Test: Direct count:', count);
    
    // Test getting documents
    const docs = await collection.find({}).limit(3).toArray();
    console.log('Simple Test: Sample docs:', docs.length);
    
    return NextResponse.json({
      success: true,
      database: db.databaseName,
      collection: 'articleCategories',
      count: count,
      sampleDocs: docs.map(doc => ({
        id: doc._id,
        name: doc.name,
        slug: doc.slug
      }))
    });
  } catch (error) {
    console.error('Simple Test Error:', error);
    console.error('Simple Test Stack:', error instanceof Error ? error.stack : 'No stack trace available');
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace available'
    }, { status: 500 });
  }
}
