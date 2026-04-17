import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { authenticateAdmin, generateToken } from '@/lib/auth';

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
    const admin = await authenticateAdmin(email, password);

    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
    });

    const response = NextResponse.json({
      message: 'Login successful',
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });

    // Set the auth token cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed to lax for better compatibility
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/', // Ensure cookie is available for all paths
    });

    console.log('Login successful, token set in cookie');
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
}
