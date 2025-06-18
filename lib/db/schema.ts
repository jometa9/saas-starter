import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  numeric,
  primaryKey,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified"),
  image: text("image"),
  passwordHash: text("passwordHash"),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  apiKey: text("apiKey").unique(),
  resetToken: text("resetToken"),
  resetTokenExpiry: timestamp("resetTokenExpiry"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  deletedAt: timestamp("deletedAt"),
  stripeCustomerId: text("stripeCustomerId").unique(),
  stripeSubscriptionId: text("stripeSubscriptionId").unique(),
  stripeProductId: text("stripeProductId"),
  planName: varchar("planName", { length: 50 }),
  subscriptionStatus: varchar("subscriptionStatus", { length: 20 }),
  subscriptionExpiryDate: timestamp("subscriptionExpiryDate"),
  serverIP: text("serverIP"),
});

export const tradingAccounts = pgTable("tradingAccounts", {
  id: serial("id").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  accountNumber: varchar("accountNumber", { length: 50 }).notNull(),
  platform: varchar("platform", { length: 20 }).notNull(),
  server: varchar("server", { length: 100 }).notNull(),
  password: text("password").notNull(),
  accountType: varchar("accountType", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  lotCoefficient: numeric("lotCoefficient").default("1"),
  forceLot: numeric("forceLot").default("0"),
  reverseTrade: boolean("reverseTrade").default(false),
  connectedToMaster: varchar("connectedToMaster", { length: 50 }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  deletedAt: timestamp("deletedAt"),
});

export const appSettings = pgTable("appSettings", {
  id: serial("id").primaryKey(),
  appVersion: varchar("appVersion", { length: 20 }).notNull().default("1.0.0"),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  updatedBy: uuid("updatedBy").references(() => user.id),
});

export const accounts = pgTable("account", {
  id: serial("id").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
  refreshToken: text("refreshToken"),
  accessToken: text("accessToken"),
  expiresAt: integer("expiresAt"),
  tokenType: varchar("tokenType", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  idToken: text("idToken"),
  sessionState: varchar("sessionState", { length: 255 }),
});

export const sessions = pgTable("session", {
  id: serial("id").primaryKey(),
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().unique(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Define relations
export const userRelations = relations(user, ({ many }) => ({
  tradingAccounts: many(tradingAccounts),
}));

export const tradingAccountsRelations = relations(
  tradingAccounts,
  ({ one }) => ({
    user: one(user, {
      fields: [tradingAccounts.userId],
      references: [user.id],
    }),
  })
);

// Type definitions
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type AppSettings = typeof appSettings.$inferSelect;
export type NewAppSettings = typeof appSettings.$inferInsert;
export type TradingAccount = typeof tradingAccounts.$inferSelect;
export type NewTradingAccount = typeof tradingAccounts.$inferInsert;
