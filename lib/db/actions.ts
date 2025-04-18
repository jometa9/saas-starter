'use server';

import { getUser, updateAppVersion, getAppVersion } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';
import { sendVersionUpdateEmail, sendBroadcastEmail } from '@/lib/email';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { ne, isNull } from 'drizzle-orm';
import { NewTradingAccount, tradingAccounts } from './schema';
import { eq } from 'drizzle-orm';

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
      
      // Enviar email a cada usuario de forma asíncrona
      // Limitar el número de emails simultáneos
      const batchSize = 5;
      let successCount = 0;
      let failureCount = 0;
      
      // Procesar en lotes para no sobrecargar el servicio de email
      for (let i = 0; i < activeUsers.length; i += batchSize) {
        const batch = activeUsers.slice(i, i + batchSize);
        
        const emailPromises = batch.map(recipient => 
          sendVersionUpdateEmail({
            email: recipient.email,
            name: recipient.name || recipient.email.split('@')[0],
            currentVersion: currentVersion,
            newVersion: updatedVersion,
            releaseNotes: data instanceof FormData 
              ? data.get('releaseNotes')?.toString() 
              : '',
            downloadUrl: data instanceof FormData 
              ? data.get('downloadUrl')?.toString() 
              : process.env.NEXT_PUBLIC_APP_URL,
            isCritical: data instanceof FormData 
              ? data.get('isCritical') === 'true'
              : false
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
      
      // Si estamos en modo desarrollo, mostrar un mensaje especial
      if (process.env.NEXT_PUBLIC_EMAIL_MODE !== 'production') {
      }
    } catch (error) {
      console.error("❌ Error sending version update emails:", error);
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

export async function sendBroadcastEmailAction(
  data: FormData | null | undefined,
  _previousState: any
) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    return {
      error: 'Unauthorized - only admins can send broadcast emails'
    };
  }

  if (!data || !(data instanceof FormData)) {
    return {
      error: 'No data provided'
    };
  }

  // Extraer datos del formulario
  const subject = data.get('subject')?.toString();
  const message = data.get('message')?.toString();
  const ctaLabel = data.get('ctaLabel')?.toString();
  const ctaUrl = data.get('ctaUrl')?.toString();
  const isImportant = data.get('isImportant') === 'true';

  // Validar datos
  if (!subject || subject.trim() === '') {
    return {
      error: 'El asunto es obligatorio'
    };
  }

  if (!message || message.trim() === '') {
    return {
      error: 'El mensaje es obligatorio'
    };
  }

  // Si se proporciona etiqueta CTA, la URL es obligatoria
  if (ctaLabel && (!ctaUrl || !ctaUrl.startsWith('http'))) {
    return {
      error: 'Si se proporciona una etiqueta CTA, la URL debe ser válida'
    };
  }

  try {
    // Obtener todos los usuarios activos con email
    const activeUsers = await db
      .select()
      .from(users)
      .where(ne(users.email, ''))
      .where(isNull(users.deletedAt));
    
    if (activeUsers.length === 0) {
      return {
        error: 'No se encontraron usuarios activos para enviar el mensaje'
      };
    }
    
    // Enviar email a cada usuario de forma asíncrona
    // Limitar el número de emails simultáneos
    const batchSize = 5;
    let successCount = 0;
    let failureCount = 0;
    
    // Procesar en lotes para no sobrecargar el servicio de email
    for (let i = 0; i < activeUsers.length; i += batchSize) {
      const batch = activeUsers.slice(i, i + batchSize);
      
      const emailPromises = batch.map(recipient => 
        sendBroadcastEmail({
          email: recipient.email,
          name: recipient.name || recipient.email.split('@')[0],
          subject: subject,
          message: message,
          ctaLabel: ctaLabel || undefined,
          ctaUrl: ctaUrl || undefined,
          isImportant: isImportant
        }).then(() => {
          successCount++;
          return true;
        }).catch(error => {
          console.error(`❌ Failed to send broadcast email to ${recipient.email}:`, error);
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
    
    return {
      success: `Email enviado con éxito a ${successCount} usuarios (${failureCount} fallidos)`
    };
  } catch (error) {
    console.error("❌ Error sending broadcast emails:", error);
    return {
      error: 'Ocurrió un error al enviar los emails'
    };
  }
}

// Trading Accounts Actions
export async function createTradingAccount(data: NewTradingAccount) {
  try {
    const result = await db
      .insert(tradingAccounts)
      .values({
        ...data,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return { success: true, account: result[0] };
  } catch (error) {
    console.error('Error creating trading account:', error);
    return { success: false, error: 'Failed to create trading account' };
  }
}

export async function updateTradingAccount(
  id: number,
  data: Partial<NewTradingAccount>
) {
  try {
    const result = await db
      .update(tradingAccounts)
      .set({
        ...data,
        status: "pending",
        updatedAt: new Date(),
      })
      .where(eq(tradingAccounts.id, id))
      .returning();

    return { success: true, account: result[0] };
  } catch (error) {
    console.error('Error updating trading account:', error);
    return { success: false, error: 'Failed to update trading account' };
  }
}

export async function deleteTradingAccount(id: number) {
  try {
    // Soft delete by setting deletedAt
    const result = await db
      .update(tradingAccounts)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(tradingAccounts.id, id))
      .returning();

    return { success: true, account: result[0] };
  } catch (error) {
    console.error('Error deleting trading account:', error);
    return { success: false, error: 'Failed to delete trading account' };
  }
}