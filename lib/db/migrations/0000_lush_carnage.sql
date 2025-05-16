CREATE TABLE "account" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
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
--> statement-breakpoint
CREATE TABLE "appSettings" (
	"id" serial PRIMARY KEY NOT NULL,
	"appVersion" varchar(20) DEFAULT '1.0.0' NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"updatedBy" integer
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionToken" varchar(255) NOT NULL,
	"userId" integer NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "session_sessionToken_unique" UNIQUE("sessionToken")
);
--> statement-breakpoint
CREATE TABLE "tradingAccounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"accountNumber" varchar(50) NOT NULL,
	"platform" varchar(20) NOT NULL,
	"server" varchar(100) NOT NULL,
	"password" text NOT NULL,
	"accountType" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"lotCoefficient" numeric DEFAULT '1',
	"forceLot" numeric DEFAULT '0',
	"reverseTrade" boolean DEFAULT false,
	"connectedToMaster" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"passwordHash" text NOT NULL,
	"role" varchar(20) DEFAULT 'member' NOT NULL,
	"apiKey" text,
	"resetToken" text,
	"resetTokenExpiry" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	"stripeCustomerId" text,
	"stripeSubscriptionId" text,
	"stripeProductId" text,
	"planName" varchar(50),
	"subscriptionStatus" varchar(20),
	"subscriptionExpiryDate" timestamp,
	"serverIP" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_apiKey_unique" UNIQUE("apiKey"),
	CONSTRAINT "user_stripeCustomerId_unique" UNIQUE("stripeCustomerId"),
	CONSTRAINT "user_stripeSubscriptionId_unique" UNIQUE("stripeSubscriptionId")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appSettings" ADD CONSTRAINT "appSettings_updatedBy_user_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tradingAccounts" ADD CONSTRAINT "tradingAccounts_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;