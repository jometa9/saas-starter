import { and, eq, gt, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import { users } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import { generateResetToken, getResetTokenExpiry } from '@/lib/utils';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getUserByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateUserSubscription(
  userId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(users)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

export async function getUserByApiKey(apiKey: string) {
  const result = await db
    .select()
    .from(users)
    .where(and(eq(users.apiKey, apiKey), isNull(users.deletedAt)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createPasswordResetToken(email: string) {
  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  const resetToken = generateResetToken();
  const resetTokenExpiry = getResetTokenExpiry();

  await db
    .update(users)
    .set({
      resetToken,
      resetTokenExpiry,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user[0].id));

  return {
    user: user[0],
    resetToken,
  };
}

export async function validateResetToken(token: string) {
  const now = new Date();
  
  const result = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.resetToken, token),
        gt(users.resetTokenExpiry!, now),
        isNull(users.deletedAt)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await validateResetToken(token);
  
  if (!user) {
    return null;
  }
  
  // Esta función será implementada en el archivo actions.ts
  // usando la función hashPassword
  
  return user;
}
