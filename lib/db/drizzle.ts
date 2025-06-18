import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

// Configurar un pool de conexiones con límites adecuados
export const client = postgres(process.env.POSTGRES_URL, {
  max: 10, // Número máximo de conexiones en el pool
  idle_timeout: 20, // Cerrar conexiones inactivas después de 20 segundos
  connect_timeout: 10, // Tiempo máximo para establecer una conexión
});

export const db = drizzle(client, { schema });
