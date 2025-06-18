import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  // Enable camelCase <-> snake_case mapping if needed in the future
  // NOTE: Since we've migrated to camelCase in the actual database, this isn't needed
  // but keeping it commented as a reference in case we need it later
  /*
  columnTypeDefaults: {
    migrationMappings: {
      // Map camelCase field names to camelCase DB columns
      default: {
        field: 'camel',
        column: 'camel',
      },
    },
  },
  */
} satisfies Config;
