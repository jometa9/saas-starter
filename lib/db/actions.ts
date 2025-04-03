'use server';

import { getUser, updateAppVersion, getAppVersion } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';
import { sendVersionUpdateEmail } from '@/lib/email';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { ne, isNull } from 'drizzle-orm';

export async function updateAppVersionAction(
  data: FormData | { version: string } | string | null | undefined,
  _previousState: any
) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    return {
      error: 'Unauthorized - only admins can update app version'
    };
  }

  // Obtener versión actual como respaldo
  const currentVersion = await getAppVersion();

  let version: string = '';
  
  // Extraer versión de los datos recibidos
  if (typeof data === 'string') {
    // Si se pasó un string directamente
    version = data;
  } else if (data instanceof FormData) {
    // Si se pasó un FormData
    const formVersion = data.get('version');
    version = typeof formVersion === 'string' ? formVersion : '';
  } else if (data && typeof data === 'object') {
    // Si se pasó un objeto con propiedad version
    if ('version' in data && typeof data.version === 'string') {
      version = data.version;
    }
  }
  
  // Si no se pudo extraer la versión, verificar el estado previo
  if (!version && _previousState && typeof _previousState === 'object') {
    if ('version' in _previousState && typeof _previousState.version === 'string') {
      version = _previousState.version;
    }
  }
  
  // Si aún no hay versión, usar la actual
  if (!version) {
    version = currentVersion;
  }
  
  // Limpiar la versión de espacios en blanco
  version = version.trim();
  
  // Validar formato de versión (x.y.z)
  const versionRegex = /^\d+\.\d+\.\d+$/;
  const isValidFormat = versionRegex.test(version);
  
  if (!isValidFormat) {
    return {
      error: 'Invalid version format. Use X.Y.Z (e.g., 1.0.0)'
    };
  }

  // Verificar si la versión es diferente a la actual
  if (version === currentVersion) {
    return {
      info: `App version is already ${version}`
    };
  }

  try {
    const updatedVersion = await updateAppVersion(version, user.id);
    
    // Enviar email a todos los usuarios activos sobre la actualización
    try {
      // Obtener todos los usuarios activos con email
      const activeUsers = await db
        .select()
        .from(users)
        .where(ne(users.email, ''))
        .where(isNull(users.deletedAt));
      
      console.log(`📧 Se enviarán notificaciones de versión a ${activeUsers.length} usuarios`);
      
      // Información opcional para el email
      const releaseNotes = data instanceof FormData 
        ? data.get('releaseNotes')?.toString() 
        : '';
        
      const downloadUrl = data instanceof FormData 
        ? data.get('downloadUrl')?.toString() 
        : process.env.NEXT_PUBLIC_APP_URL;
        
      const isCritical = data instanceof FormData 
        ? data.get('isCritical') === 'true'
        : false;
      
      // Enviar email a cada usuario de forma asíncrona
      // Limitar el número de emails simultáneos
      const batchSize = 5;
      let successCount = 0;
      let failureCount = 0;
      
      // Procesar en lotes para no sobrecargar el servicio de email
      for (let i = 0; i < activeUsers.length; i += batchSize) {
        const batch = activeUsers.slice(i, i + batchSize);
        
        console.log(`📧 Procesando lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(activeUsers.length/batchSize)} (${batch.length} usuarios)`);
        
        const emailPromises = batch.map(recipient => 
          sendVersionUpdateEmail({
            email: recipient.email,
            name: recipient.name || recipient.email.split('@')[0],
            currentVersion: currentVersion,
            newVersion: updatedVersion,
            releaseNotes: releaseNotes,
            downloadUrl: downloadUrl,
            isCritical: isCritical
          }).then(() => {
            successCount++;
            return true;
          }).catch(error => {
            console.error(`❌ Failed to send version update email to ${recipient.email}:`, error);
            failureCount++;
            // No bloqueamos el proceso si falla algún email individual
            return false;
          })
        );
        
        // Esperamos a que termine este lote antes de continuar
        await Promise.all(emailPromises);
        
        // Pequeña pausa entre lotes para no sobrecargar
        if (i + batchSize < activeUsers.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      console.log(`✅ Notificaciones de versión enviadas. Éxitos: ${successCount}, Fallos: ${failureCount}`);
      
      // Enviar email cuando hay notas de la actualización
      if (currentVersion && releaseNotes) {
        try {
          console.log('📧 Enviando emails de actualización a usuarios');
          
          // Solo en desarrollo, imprime mensaje de advertencia
          if (process.env.NEXT_PUBLIC_EMAIL_MODE !== 'production') {
            console.log('⚠️ MODO DESARROLLO: Los emails serán enviados a direcciones de prueba');
          }
          
          // Obtener todos los usuarios activos con email
          const activeUsers = await db
            .select()
            .from(users)
            .where(ne(users.email, ''))
            .where(isNull(users.deletedAt));
          
          console.log(`📧 Se enviarán notificaciones de versión a ${activeUsers.length} usuarios`);
          
          // Enviar email a cada usuario de forma asíncrona
          // Limitar el número de emails simultáneos
          const batchSize = 5;
          let successCount = 0;
          let failureCount = 0;
          
          // Procesar en lotes para no sobrecargar el servicio de email
          for (let i = 0; i < activeUsers.length; i += batchSize) {
            const batch = activeUsers.slice(i, i + batchSize);
            
            console.log(`📧 Procesando lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(activeUsers.length/batchSize)} (${batch.length} usuarios)`);
            
            const emailPromises = batch.map(recipient => 
              sendVersionUpdateEmail({
                email: recipient.email,
                name: recipient.name || recipient.email.split('@')[0],
                currentVersion: currentVersion,
                newVersion: updatedVersion,
                releaseNotes: releaseNotes,
                downloadUrl: downloadUrl,
                isCritical: isCritical
              }).then(() => {
                successCount++;
                return true;
              }).catch(error => {
                console.error(`❌ Failed to send version update email to ${recipient.email}:`, error);
                failureCount++;
                // No bloqueamos el proceso si falla algún email individual
                return false;
              })
            );
            
            // Esperamos a que termine este lote antes de continuar
            await Promise.all(emailPromises);
            
            // Pequeña pausa entre lotes para no sobrecargar
            if (i + batchSize < activeUsers.length) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
          
          console.log(`✅ Notificaciones de versión enviadas. Éxitos: ${successCount}, Fallos: ${failureCount}`);
          
          // Si estamos en modo desarrollo, mostrar un mensaje especial
          if (process.env.NEXT_PUBLIC_EMAIL_MODE !== 'production') {
            console.log(`
              ⚠️ MODO DESARROLLO: Los emails de actualización de versión 
              ⚠️ fueron redirigidos a direcciones de prueba seguras.
              ⚠️ Versión actual: ${currentVersion}
              ⚠️ Nueva versión: ${updatedVersion}
              ⚠️ URL de descarga: ${downloadUrl || 'No especificada'}
              ⚠️ Consulta los logs para más detalles
            `);
          }
        } catch (error) {
          console.error("❌ Error sending version update emails:", error);
          // No bloqueamos la actualización de versión si falla el envío de emails
        }
      }
    } catch (error) {
      console.error("❌ Error sending version update emails:", error);
      // No bloqueamos la actualización de versión si falla el envío de emails
    }
    
    // Forzar la revalidación del path
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/settings');
    revalidatePath('/(dashboard)/dashboard');
    revalidatePath('/(dashboard)/dashboard/settings');
    
    return {
      success: `App version updated to ${updatedVersion}`
    };
  } catch (error) {
    console.error("❌ Error updating app version:", error);
    return {
      error: 'Failed to update app version'
    };
  }
}