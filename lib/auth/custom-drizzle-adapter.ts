import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db/drizzle";
import { user, accounts, sessions, verificationTokens } from "@/lib/db/schema";
import type { Adapter } from "next-auth/adapters";
import { and, eq } from "drizzle-orm";
import { sendWelcomeEmail } from "@/lib/email/services";

export function CustomDrizzleAdapter(): Adapter {
  return {
    ...DrizzleAdapter(db, {
      schema: {
        user,
        account: accounts,
        session: sessions,
        verificationToken: verificationTokens,
      },
    }),
    // Sobrescribir los métodos que necesitan mapeo de columnas
    async getUserByAccount({ provider, providerAccountId }) {
      console.log('🔍 getUserByAccount called with:', { provider, providerAccountId });
      const result = await db
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.provider, provider),
            eq(accounts.providerAccountId, providerAccountId)
          )
        )
        .leftJoin(user, eq(accounts.userId, user.id))
        .limit(1);

      if (!result[0]?.user) {
        console.log('❌ No user found for account');
        return null;
      }

      console.log('✅ User found:', result[0].user.email);
      return result[0].user;
    },
    async createUser(data) {
      console.log('👤 createUser called with data:', { 
        email: data.email,
        name: data.name,
        hasPassword: !!data.passwordHash
      });
      
      const [newUser] = await db.insert(user).values(data).returning();
      console.log('✅ User created in database:', newUser.email);
      
      // Enviar email de bienvenida
      try {
        console.log('📧 Attempting to send welcome email to:', newUser.email);
        const loginUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'http://localhost:3000';
        console.log('🔗 Using login URL:', loginUrl);
        
        await sendWelcomeEmail({
          email: newUser.email,
          name: newUser.name || newUser.email.split('@')[0],
          loginUrl
        });
        console.log('✅ Welcome email sent successfully');
      } catch (error) {
        // No bloqueamos el registro si falla el envío del email
        console.error('❌ Error sending welcome email:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack
          });
        }
      }
      
      return newUser;
    },
    async createAccount(data) {
      console.log('🔑 createAccount called for provider:', data.provider);
      const account = await db.insert(accounts).values(data).returning()[0];
      console.log('✅ Account created for user:', account.userId);
      return account;
    },
    async updateAccount(data) {
      console.log('🔄 updateAccount called for provider:', data.provider);
      const account = await db
        .update(accounts)
        .set(data)
        .where(
          and(
            eq(accounts.provider, data.provider),
            eq(accounts.providerAccountId, data.providerAccountId)
          )
        )
        .returning()[0];
      console.log('✅ Account updated for user:', account.userId);
      return account;
    },
    async linkAccount(account) {
      console.log('🔗 linkAccount called for provider:', account.provider);
      console.log('Account data:', account);
      
      try {
        const [linkedAccount] = await db.insert(accounts).values(account).returning();
        if (!linkedAccount) {
          throw new Error('Failed to create account record');
        }
        console.log('✅ Account linked for user:', linkedAccount.userId);
        return linkedAccount;
      } catch (error) {
        console.error('❌ Error linking account:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack
          });
        }
        throw error;
      }
    },
    async unlinkAccount({ provider, providerAccountId }) {
      console.log('🔓 unlinkAccount called for provider:', provider);
      const unlinkedAccount = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.provider, provider),
            eq(accounts.providerAccountId, providerAccountId)
          )
        )
        .returning()[0];
      console.log('✅ Account unlinked for user:', unlinkedAccount.userId);
      return unlinkedAccount;
    },
    async deleteAccount({ provider, providerAccountId }) {
      console.log('🗑️ deleteAccount called for provider:', provider);
      const deletedAccount = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.provider, provider),
            eq(accounts.providerAccountId, providerAccountId)
          )
        )
        .returning()[0];
      console.log('✅ Account deleted for user:', deletedAccount.userId);
      return deletedAccount;
    },
  };
} 