import { sql } from "drizzle-orm";
import { db } from "../drizzle";

export async function migrateAppSettings() {
  try {
    // Verificar si la tabla app_settings ya existe
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'app_settings'
      );
    `);
    
    const exists = tableExists.rows[0].exists;
    
    if (!exists) {
      // Crear la tabla app_settings
      await db.execute(sql`
        CREATE TABLE app_settings (
          id SERIAL PRIMARY KEY,
          app_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_by INTEGER REFERENCES users(id)
        );
      `);
      
      // Insertar valor por defecto
      await db.execute(sql`
        INSERT INTO app_settings (app_version, updated_at)
        VALUES ('1.0.0', CURRENT_TIMESTAMP);
      `);
      
    }
    
    return { success: true };
  } catch (error) {
    
    return { success: false, error };
  }
} 