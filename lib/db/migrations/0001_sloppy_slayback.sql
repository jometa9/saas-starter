ALTER TABLE "account" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "appSettings" ALTER COLUMN "updatedBy" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "tradingAccounts" ALTER COLUMN "userId" SET DATA TYPE uuid;