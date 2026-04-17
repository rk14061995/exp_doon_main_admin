import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { createAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    await createAdmin(email, password);

    return NextResponse.json({
      message: 'Admin user created successfully',
      email,
    });
  } catch (error: any) {
    console.error('Admin creation error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Admin user with this email already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}
