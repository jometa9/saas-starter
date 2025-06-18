import { exec } from "node:child_process";
import { promises as fs } from "node:fs";
import { promisify } from "node:util";
import readline from "node:readline";
import crypto from "node:crypto";
import path from "node:path";
import os from "node:os";

const execAsync = promisify(exec);

function question(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

async function checkStripeCLI() {
  try {
    await execAsync("stripe --version");

    // Check if Stripe CLI is authenticated
    try {
      await execAsync("stripe config --list");
    } catch (error) {
      const answer = await question(
        "Have you completed the authentication? (y/n): "
      );
      if (answer.toLowerCase() !== "y") {
        process.exit(1);
      }

      // Verify authentication after user confirms login
      try {
        await execAsync("stripe config --list");
      } catch (error) {
        process.exit(1);
      }
    }
  } catch (error) {
    process.exit(1);
  }
}

async function getPostgresURL(): Promise<string> {
  const dbChoice = await question(
    "Do you want to use a local Postgres instance with Docker (L) or a remote Postgres instance (R)? (L/R): "
  );

  if (dbChoice.toLowerCase() === "l") {
    await setupLocalPostgres();
    return "postgres://postgres:postgres@localhost:54322/postgres";
  } else {
    return await question("Enter your POSTGRES_URL: ");
  }
}

async function setupLocalPostgres() {
  try {
    await execAsync("docker --version");
  } catch (error) {
    process.exit(1);
  }

  const dockerComposeContent = `
services:
  postgres:
    image: postgres:16.4-alpine
    container_name: next_saas_starter_postgres
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "54322:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
`;

  await fs.writeFile(
    path.join(process.cwd(), "docker-compose.yml"),
    dockerComposeContent
  );

  try {
    await execAsync("docker compose up -d");
  } catch (error) {
    process.exit(1);
  }
}

async function getStripeSecretKey(): Promise<string> {
  return await question("Enter your Stripe Secret Key: ");
}

async function createStripeWebhook(): Promise<string> {
  try {
    const { stdout } = await execAsync("stripe listen --print-secret");
    const match = stdout.match(/whsec_[a-zA-Z0-9]+/);
    if (!match) {
      throw new Error("Failed to extract Stripe webhook secret");
    }

    return match[0];
  } catch (error) {
    if (os.platform() === "win32") {
    }
    throw error;
  }
}

function generateAuthSecret(): string {
  return crypto.randomBytes(32).toString("hex");
}

async function writeEnvFile(envVars: Record<string, string>) {
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  await fs.writeFile(path.join(process.cwd(), ".env"), envContent);
}

async function main() {
  await checkStripeCLI();

  const POSTGRES_URL = await getPostgresURL();
  const STRIPE_SECRET_KEY = await getStripeSecretKey();
  const STRIPE_WEBHOOK_SECRET = await createStripeWebhook();
  const AUTH_SECRET = generateAuthSecret();
  const BASE_URL = "http://localhost:3000";

  await writeEnvFile({
    POSTGRES_URL,
    STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET,
    BASE_URL,
    AUTH_SECRET,
  });

  // Importar y ejecutar la migración de app_settings
  try {
    const { migrateAppSettings } = await import(
      "./migrations/add_app_settings_table"
    );
    await migrateAppSettings();
  } catch (error) {}
}

main().catch(console.error);
