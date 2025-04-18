import { NextRequest } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { getSession } from './session';

/**
 * Gets the current user session and auth status
 * @returns The session object and current user
 */
export async function getUserAuth() {
  const session = await getSession();
  const user = await getUser();

  return {
    session,
    user
  };
}

/**
 * Verifica si una solicitud proviene de un usuario administrador
 * @param req - La solicitud HTTP
 * @returns true si el usuario es administrador, false en caso contrario
 */
export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  try {
    // Obtener la sesión actual
    const session = await getSession();
    
    if (!session) {
      return false;
    }
    
    // Obtener el usuario de la base de datos
    const user = await getUser();
    
    if (!user) {
      return false;
    }
    
    // Verificar si el usuario es administrador
    const isAdmin = user.role === 'admin';
    
    return isAdmin;
  } catch (error) {
    
    return false;
  }
} 