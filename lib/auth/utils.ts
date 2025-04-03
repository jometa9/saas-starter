import { NextRequest } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { getSession } from './session';

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
      console.log('❌ No session found in isAdminRequest');
      return false;
    }
    
    // Obtener el usuario de la base de datos
    const user = await getUser();
    
    if (!user) {
      console.log('❌ No user found in isAdminRequest');
      return false;
    }
    
    // Verificar si el usuario es administrador
    const isAdmin = user.role === 'admin';
    
    if (!isAdmin) {
      console.log(`❌ User ${user.id} (${user.email}) is not an admin`);
    } else {
      console.log(`✅ User ${user.id} (${user.email}) is an admin`);
    }
    
    return isAdmin;
  } catch (error) {
    console.error('❌ Error in isAdminRequest:', error);
    return false;
  }
} 