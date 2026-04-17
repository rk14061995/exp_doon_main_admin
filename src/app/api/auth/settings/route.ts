import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { authenticateAdmin, hashPassword, verifyPassword } from '@/lib/auth';
import Admin from '@/lib/models/Admin';

export async function PUT(request: NextRequest) {
  try {
    const { email, currentPassword, newPassword } = await request.json();

    // Verify authentication first
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get current admin from token
    const { verifyToken } = await import('@/lib/auth');
    const decoded = verifyToken(token);
    
    await connectToDatabase();
    const admin = await Admin.findById(decoded.id);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Update email if provided
    if (email && email !== admin.email) {
      // Check if email is already taken
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
      admin.email = email;
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to change password' },
          { status: 400 }
        );
      }

      // Verify current password
      const isCurrentPasswordValid = await verifyPassword(currentPassword, admin.password);
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Hash and update new password
      admin.password = await hashPassword(newPassword);
    }

    await admin.save();

    return NextResponse.json({
      message: 'Settings updated successfully',
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
