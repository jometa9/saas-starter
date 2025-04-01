import crypto from 'crypto';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export function generateApiKey(): string {
  return `sk_${crypto.randomBytes(32).toString('hex')}`;
}

export async function createUserApiKey(userId: number): Promise<string> {
  const apiKey = generateApiKey();
  
  await db
    .update(users)
    .set({ apiKey })
    .where(eq(users.id, userId));
    
  return apiKey;
}

export async function removeUserApiKey(userId: number): Promise<void> {
  await db
    .update(users)
    .set({ apiKey: null })
    .where(eq(users.id, userId));
}