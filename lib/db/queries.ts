import { and, eq, gt, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import { user, appSettings, tradingAccounts } from './schema';
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
    typeof sessionData.user.id !== 'string'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const userResult = await db
    .select()
    .from(user)
    .where(and(eq(user.id, sessionData.user.id), isNull(user.deletedAt)))
    .limit(1);

  if (userResult.length === 0) {
    return null;
  }

  return userResult[0];
}

export async function getUserByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateUserSubscription(
  userId: string,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(user)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId));
}

export async function getUserByApiKey(apiKey: string) {
  const result = await db
    .select()
    .from(user)
    .where(and(eq(user.apiKey, apiKey), isNull(user.deletedAt)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createPasswordResetToken(email: string) {
  const userResult = await db
    .select()
    .from(user)
    .where(and(eq(user.email, email), isNull(user.deletedAt)))
    .limit(1);

  if (userResult.length === 0) {
    return null;
  }

  const resetToken = generateResetToken();
  const resetTokenExpiry = getResetTokenExpiry();

  await db
    .update(user)
    .set({
      resetToken,
      resetTokenExpiry,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userResult[0].id));

  return {
    user: userResult[0],
    resetToken,
  };
}

export async function validateResetToken(token: string) {
  const now = new Date();
  
  const result = await db
    .select()
    .from(user)
    .where(
      and(
        eq(user.resetToken, token),
        gt(user.resetTokenExpiry!, now),
        isNull(user.deletedAt)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function resetPassword(token: string, newPassword: string) {
  const currentUser = await validateResetToken(token);
  
  if (!currentUser) {
    return null;
  }
  
  // Esta función será implementada en el archivo actions.ts
  // usando la función hashPassword
  
  return currentUser;
}

// Funciones para la gestión de versión de la aplicación
export async function getAppVersion() {
  const settings = await db
    .select()
    .from(appSettings)
    .orderBy(appSettings.id)
    .limit(1);

  // Si no hay configuración, crea una por defecto
  if (settings.length === 0) {
    const defaultSettings = await db
      .insert(appSettings)
      .values({
        appVersion: '1.0.0',
        updatedAt: new Date(),
      })
      .returning();
    
    return defaultSettings[0].appVersion;
  }

  return settings[0].appVersion;
}

export async function updateAppVersion(version: string, userId: string) {
  const settings = await db
    .select()
    .from(appSettings)
    .orderBy(appSettings.id)
    .limit(1);

  try {
    if (settings.length === 0) {
      // Si no existe, crear nuevo registro
      const result = await db
        .insert(appSettings)
        .values({
          appVersion: version,
          updatedAt: new Date(),
          updatedBy: userId,
        })
        .returning();
      
      return result[0].appVersion;
    } else {
      // Si existe, actualizar
      const result = await db
        .update(appSettings)
        .set({
          appVersion: version,
          updatedAt: new Date(),
          updatedBy: userId,
        })
        .where(eq(appSettings.id, settings[0].id))
        .returning();
      
      if (result.length > 0) {
        return result[0].appVersion;
      } else {
        // Si no se actualizó nada (quizás porque la versión es la misma), devolver la versión actual
        const currentSettings = await db
          .select()
          .from(appSettings)
          .where(eq(appSettings.id, settings[0].id))
          .limit(1);
          
        return currentSettings[0].appVersion;
      }
    }
  } catch (error) {
    throw error;
  }
}

// Nueva función para actualizar datos de usuario por ID
export async function updateUserById(
  userId: string,
  userData: Partial<{
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string | null;
    name: string | null;
    email: string | null;
    role: string | null;
    apiKey: string | null;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
  }>
) {
  try {
    // Convert null values to undefined since drizzle doesn't accept null for existing fields
    const processedData = Object.fromEntries(
      Object.entries(userData).map(([key, value]) => [key, value === null ? undefined : value])
    );

    const dataToUpdate = {
      ...processedData,
      updatedAt: new Date(),
    };
    
    const result = await db
      .update(user)
      .set(dataToUpdate)
      .where(eq(user.id, userId))
      .returning();
    
    if (result.length === 0) {
      throw new Error(`Usuario con ID ${userId} no encontrado`);
    }
    
    return result[0];
  } catch (error) {
    throw error;
  }
}

// Trading Accounts Management
export async function getUserTradingAccounts(userId: string) {
  const result = await db
    .select()
    .from(tradingAccounts)
    .where(
      and(
        eq(tradingAccounts.userId, userId),
        isNull(tradingAccounts.deletedAt)
      )
    )
    .orderBy(tradingAccounts.createdAt);

  return result;
}

export async function getTradingAccountById(id: number) {
  const result = await db
    .select()
    .from(tradingAccounts)
    .where(
      and(
        eq(tradingAccounts.id, id),
        isNull(tradingAccounts.deletedAt)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getUserById(userId: string) {
  const result = await db
    .select()
    .from(user)
    .where(and(eq(user.id, userId), isNull(user.deletedAt)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}
