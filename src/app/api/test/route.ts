import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';

export async function GET() {
  try {
    // Test database connection
    await connectToDatabase();
    
    // Check if admin user exists
    const adminCount = await Admin.countDocuments();
    const adminUsers = await Admin.find({}, { email: 1, isActive: 1, createdAt: 1 });
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      adminCount,
      adminUsers: adminUsers.map(admin => ({
        email: admin.email,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
      })),
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
