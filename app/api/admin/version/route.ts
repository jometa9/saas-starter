'use server';

import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth/utils';
import { updateAppVersion, getAppVersion } from '@/lib/db/queries';
import { getUser } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { user} from '@/lib/db/schema';
import { isNull } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    // Verificar si la solicitud proviene de un administrador
    const isAdmin = await isAdminRequest(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Obtener la versión actual de la aplicación
    const appVersion = await getAppVersion();

    return NextResponse.json({ version: appVersion });
  } catch (error) {
    
    return NextResponse.json({ error: 'Failed to get app version' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verificar si la solicitud proviene de un administrador
    const isAdmin = await isAdminRequest(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Obtener los datos de la solicitud
    const data = await req.json();
    const { 
      version, 
      releaseNotes = '', 
      downloadUrl = '', 
      isCritical = false 
    } = data;

    if (!version) {
      return NextResponse.json({ error: 'Version is required' }, { status: 400 });
    }

    // Validar el formato de la versión (x.y.z)
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (!versionRegex.test(version)) {
      return NextResponse.json({ error: 'Invalid version format. Use x.y.z format.' }, { status: 400 });
    }

    // Obtener el usuario administrador
    const admin = await getUser();
    if (!admin) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Importante: Obtener la versión actual ANTES de actualizarla
    const currentVersion = await getAppVersion();
    
    // Si la versión nueva es igual a la actual, no tiene sentido enviar notificaciones
    if (currentVersion === version) {
      return NextResponse.json({ 
        success: false, 
        message: 'The new version is the same as the current one',
        version: currentVersion
      }, { status: 400 });
    }

    // Actualizar la versión de la aplicación
    const updatedVersion = await updateAppVersion(version, admin.id);

    // Obtener todos los usuarios para enviar notificación
    const usersList = await db
      .select()
      .from(users)
      .where(isNull(users.deletedAt));

    
    let notificationSent = false;

    if (usersList.length > 0) {
      try {
        // Importar dinámicamente el servicio de email
        const { sendVersionUpdateEmail } = await import('@/lib/email');
        
        // Enviar emails en lotes para no sobrecargar el servidor
        const batchSize = 10;
        for (let i = 0; i < usersList.length; i += batchSize) {
          const batch = usersList.slice(i, i + batchSize);
          
          // Procesar cada lote en paralelo
          const results = await Promise.allSettled(
            batch.map(user => {
              return sendVersionUpdateEmail({
                email: user.email,
                name: user.name || user.email.split('@')[0],
                currentVersion: currentVersion, // Usar la versión anterior
                newVersion: version, // Usar la nueva versión
                releaseNotes: releaseNotes,
                downloadUrl: downloadUrl || null,
                isCritical: isCritical
              });
            })
          );
          
          // Verificar si al menos un email se envió correctamente
          if (results.some(result => result.status === 'fulfilled')) {
            notificationSent = true;
          }
        }
        
        
      } catch (emailError) {
        
        // Continuamos con el proceso aunque fallen los emails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'App version updated successfully and users notified',
      previousVersion: currentVersion,
      newVersion: updatedVersion,
      notificationSent: notificationSent,
      usersCount: usersList.length
    });
  } catch (error) {
    
    return NextResponse.json({ error: 'Failed to update app version' }, { status: 500 });
  }
} 