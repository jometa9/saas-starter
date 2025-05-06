-- Añadir la columna server_ip a la tabla users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "server_ip" text;

-- Actualizar la columna con valores nulos por defecto para registros existentes
UPDATE "users" SET "server_ip" = NULL; 