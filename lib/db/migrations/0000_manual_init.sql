-- Habilitar extensión para UUIDs si no está habilitada
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla user
CREATE TABLE "user" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(100),
  "email" varchar(255) NOT NULL UNIQUE,
  "emailVerified" timestamp,
  "image" text,
  "passwordHash" text NOT NULL,
  "role" varchar(20) NOT NULL DEFAULT 'member',
  "apiKey" text UNIQUE,
  "resetToken" text,
  "resetTokenExpiry" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "deletedAt" timestamp,
  "stripeCustomerId" text UNIQUE,
  "stripeSubscriptionId" text UNIQUE,
  "stripeProductId" text,
  "planName" varchar(50),
  "subscriptionStatus" varchar(20),
  "subscriptionExpiryDate" timestamp,
  "serverIP" text
);

-- Tabla tradingAccounts
CREATE TABLE "tradingAccounts" (
  "id" serial PRIMARY KEY,
  "userId" uuid NOT NULL REFERENCES "user"("id"),
  "accountNumber" varchar(50) NOT NULL,
  "platform" varchar(20) NOT NULL,
  "server" varchar(100) NOT NULL,
  "password" text NOT NULL,
  "accountType" varchar(20) NOT NULL,
  "status" varchar(20) NOT NULL DEFAULT 'pending',
  "lotCoefficient" numeric DEFAULT 1,
  "forceLot" numeric DEFAULT 0,
  "reverseTrade" boolean DEFAULT false,
  "connectedToMaster" varchar(50),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "deletedAt" timestamp
);

-- Tabla appSettings
CREATE TABLE "appSettings" (
  "id" serial PRIMARY KEY,
  "appVersion" varchar(20) NOT NULL DEFAULT '1.0.0',
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "updatedBy" uuid REFERENCES "user"("id")
);

-- Tabla account
CREATE TABLE "account" (
  "id" serial PRIMARY KEY,
  "userId" uuid NOT NULL REFERENCES "user"("id"),
  "type" varchar(255) NOT NULL,
  "provider" varchar(255) NOT NULL,
  "providerAccountId" varchar(255) NOT NULL,
  "refreshToken" text,
  "accessToken" text,
  "expiresAt" integer,
  "tokenType" varchar(255),
  "scope" varchar(255),
  "idToken" text,
  "sessionState" varchar(255)
);

-- Tabla session
CREATE TABLE "session" (
  "id" serial PRIMARY KEY,
  "sessionToken" varchar(255) NOT NULL UNIQUE,
  "userId" uuid NOT NULL REFERENCES "user"("id"),
  "expires" timestamp NOT NULL
);

-- Tabla verificationToken
CREATE TABLE "verificationToken" (
  "identifier" varchar(255) NOT NULL,
  "token" varchar(255) NOT NULL,
  "expires" timestamp NOT NULL,
  PRIMARY KEY ("identifier", "token")
); 