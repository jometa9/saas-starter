'use server';

import { z } from 'zod';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import {
  User,
  user,
  type NewUser,
} from '@/lib/db/schema';
import { comparePasswords, hashPassword, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createCheckoutSession } from '@/lib/payments/stripe';
import { getUser, createPasswordResetToken, validateResetToken } from '@/lib/db/queries';
import {
  validatedAction,
  validatedActionWithUser,
} from '@/lib/auth/middleware';
import { generateApiKey } from '@/lib/utils';
import { sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email';

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  const foundUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (foundUser.length === 0) {
    return {
      error: 'Invalid email or password. Please try again.',
      email,
      password,
    };
  }

  const foundUserData = foundUser[0];

  if (!foundUserData.passwordHash || typeof foundUserData.passwordHash !== 'string') {
    return {
      error: 'This email was registered with Google. Please sign in with Google, or <a href="/forgot-password" class="underline text-primary">reset your password</a> to enable login with password. After resetting, you can log in with both Google and your new password.',
      email,
      password,
    };
  }

  const isPasswordValid = await comparePasswords(
    password,
    foundUserData.passwordHash,
  );

  if (!isPasswordValid) {
    return {
      error: 'Invalid email or password. Please try again.',
      email,
      password,
    };
  }

  await setSession(foundUserData);

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    try {
      const priceId = formData.get('priceId') as string;
      return createCheckoutSession({ user: foundUserData, priceId });
    } catch (error) {
      
      return {
        error: 'Error al conectar con el servicio de pagos. Por favor intenta de nuevo más tarde.',
      };
    }
  }

  // Si hay un redirectTo específico, redirigir allí
  if (redirectTo && redirectTo.startsWith('/')) {
    redirect(redirectTo);
  }

  // De lo contrario, ir al dashboard
  redirect('/dashboard');
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, password } = data;

  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      error: 'Email already in use. Please try a different one.',
      email,
      password,
    };
  }

  const passwordHash = await hashPassword(password);
  const apiKey = generateApiKey();

  // Crear un customer en Stripe primero
  let stripeCustomerId = null;
  try {
    const { stripe } = await import('@/lib/payments/stripe');
    
    const customer = await stripe.customers.create({
      email,
      metadata: {
        source: 'signup_flow'
      }
    });
    
    stripeCustomerId = customer.id;
  } catch (stripeError) {
    
    // No bloqueamos el registro si falla la creación en Stripe
    // Lo intentaremos más tarde cuando se suscriba
  }

  const newUser: NewUser = {
    email,
    passwordHash,
    apiKey,
    role: 'owner',
    stripeCustomerId, // Añadir el ID del cliente de Stripe (puede ser null si falló)
  };

  const [createdUser] = await db.insert(user).values(newUser).returning();

  if (!createdUser) {
    return {
      error: 'Failed to create user. Please try again.',
      email,
      password,
    };
  }

  // Enviar email de bienvenida
  try {
    await sendWelcomeEmail({
      email: createdUser.email,
      name: createdUser.name || createdUser.email.split('@')[0],
      loginUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'http://localhost:3000'
    });
  } catch (error) {
    
  }

  await setSession(createdUser);

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    try {
      const priceId = formData.get('priceId') as string;
      return createCheckoutSession({ user: createdUser, priceId });
    } catch (error) {
      
      redirect('/dashboard?error=payment-setup');
    }
  }

  // Si hay un redirectTo específico, redirigir allí
  if (redirectTo && redirectTo.startsWith('/')) {
    redirect(redirectTo);
  }

  // De lo contrario, ir al dashboard
  redirect('/dashboard');
});

export async function signOut() {
  (await cookies()).delete('session');
  redirect('/sign-in');
}

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8).max(100),
    newPassword: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {
    const { currentPassword, newPassword } = data;

    const isPasswordValid = await comparePasswords(
      currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return { error: 'Current password is incorrect.' };
    }

    if (currentPassword === newPassword) {
      return {
        error: 'New password must be different from the current password.',
      };
    }

    const newPasswordHash = await hashPassword(newPassword);

    await db
      .update(user)
      .set({ passwordHash: newPasswordHash })
      .where(eq(user.id, user.id));

    return { success: 'Password updated successfully.' };
  },
);

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(100),
});

export const deleteAccount = validatedActionWithUser(
  deleteAccountSchema,
  async (data, _, user) => {
    const { password } = data;

    const isPasswordValid = await comparePasswords(password, user.passwordHash);
    if (!isPasswordValid) {
      return { error: 'Incorrect password. Account deletion failed.' };
    }

    // Soft delete
    await db
      .update(user)
      .set({
        deletedAt: sql`CURRENT_TIMESTAMP`,
        email: sql`CONCAT(email, '-', id, '-deleted')`, // Ensure email uniqueness
      })
      .where(eq(user.id, user.id));

    (await cookies()).delete('session');
    redirect('/sign-in');
  },
);

const updateAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
});

export const updateAccount = validatedActionWithUser(
  updateAccountSchema,
  async (data, _, user) => {
    const { name, email } = data;

    await db.update(user).set({ name, email }).where(eq(user.id, user.id));

    return { success: 'Account updated successfully.' };
  },
);

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const forgotPassword = validatedAction(
  forgotPasswordSchema,
  async (data) => {
    const { email } = data;

    // Generamos el token de recuperación de contraseña
    const result = await createPasswordResetToken(email);

    if (!result) {
      // Para evitar enumerar usuarios, siempre devolvemos éxito, incluso si el correo no existe
      return { success: 'If an account exists with that email, a password reset link has been sent.' };
    }

    // Enviar email con el token de recuperación
    try {
      await sendPasswordResetEmail({
        email,
        name: result.user.name || email.split('@')[0],
        token: result.resetToken,
        expiryMinutes: 60, // 1 hora de validez
      });
    } catch (error) {
      
      // Aun en caso de error al enviar el email, seguimos devolviendo success
      // para evitar enumerar usuarios
    }

    return { 
      success: 'If an account exists with that email, a password reset link has been sent.',
      // Solo para desarrollo/debugging, NO incluir en producción:
      ...(process.env.NEXT_PUBLIC_EMAIL_MODE === 'development' && { 
        resetLink: `/reset-password?token=${result.resetToken}`,
        message: "Email enviado a una dirección de prueba (modo desarrollo)"
      })
    };
  }
);

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const resetPasswordAction = validatedAction(
  resetPasswordSchema,
  async (data) => {
    const { token, password } = data;

    // Validar el token
    const dbUser = await validateResetToken(token);

    if (!dbUser) {
      return { error: 'Invalid or expired token. Please request a new password reset.' };
    }

    // Actualizar la contraseña
    const passwordHash = await hashPassword(password);

    await db
      .update(user)
      .set({
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, dbUser.id));

    return { success: 'Password updated successfully. Please sign in with your new password.' };
  }
);
