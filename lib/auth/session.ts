import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NewUser } from '@/lib/db/schema';
import { JWTPayload } from 'jose';

const key = new TextEncoder().encode(process.env.AUTH_SECRET || '');
const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(password: string, hash: string) {
  return compare(password, hash);
}

export interface SessionData {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role?: string;
  };
  expires: string;
  [key: string]: any; // Add index signature for JWTPayload compatibility
}

export async function setSession(userData: { 
  id: string; 
  email: string; 
  name?: string | null; 
  role?: string;
}) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const session: SessionData = {
    user: {
      id: userData.id,
      email: userData.email,
      name: userData.name || null,
      role: userData.role || 'member',
    },
    expires: expires.toISOString(),
  };
  
  const token = await new SignJWT(session as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expires.toISOString())
    .sign(key);
  
  (await cookies()).set('session', token, {
    expires,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  
  return session;
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  
  // Check if payload has the expected shape
  if (typeof payload === 'object' && payload && 'user' in payload && 'expires' in payload) {
    return payload as SessionData;
  }
  
  throw new Error('Invalid token payload');
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;
  return await verifyToken(session);
}
