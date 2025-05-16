import { db } from "@/lib/db/drizzle";
import { user } from "@/lib/db/schema";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { CustomDrizzleAdapter } from "./custom-drizzle-adapter";

export const authOptions: NextAuthOptions = {
  adapter: CustomDrizzleAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log('AUTHORIZE CALLED', credentials);
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const userResult = await db
          .select()
          .from(user)
          .where(eq(user.email, credentials.email))
          .limit(1);

        console.log('AUTHORIZE USER RESULT', userResult);

        if (!userResult[0]) {
          return null;
        }

        const passwordMatch = await compare(
          credentials.password,
          userResult[0].passwordHash || ""
        );

        console.log('AUTHORIZE PASSWORD MATCH', passwordMatch);

        if (!passwordMatch) {
          return null;
        }

        const userObj = {
          id: userResult[0].id.toString(),
          email: userResult[0].email,
          name: userResult[0].name,
          role: userResult[0].role,
        };
        console.log('AUTHORIZE RETURNING USER', userObj);
        return userObj;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
    newUser: "/sign-up",
  },
  session: {
    strategy: "jwt",
  },
}; 