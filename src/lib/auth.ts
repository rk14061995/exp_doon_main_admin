import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '@/lib/models/Admin';

export interface AdminPayload {
  id: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: AdminPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
  };
  
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): AdminPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.verify(token, secret) as AdminPayload;
}

export async function createAdmin(email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  const admin = new Admin({
    email,
    password: hashedPassword,
  });
  
  return admin.save();
}

export async function authenticateAdmin(email: string, password: string) {
  const admin = await Admin.findOne({ email, isActive: true });
  if (!admin) {
    throw new Error('Invalid credentials');
  }
  
  const isValid = await verifyPassword(password, admin.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }
  
  return admin;
}
