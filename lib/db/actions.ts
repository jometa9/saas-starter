'use server';

import { getUser, updateAppVersion, getAppVersion } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';

export async function updateAppVersionAction(
  data: FormData | { version: string } | string | null | undefined,
  _previousState: any
) {
  console.log("🔄 Iniciando acción de actualización de versión");
  console.log("Estado previo:", _previousState);
  console.log("Datos recibidos tipo:", typeof data);
  console.log("Datos recibidos:", data instanceof FormData 
    ? "FormData" 
    : typeof data === 'object' 
      ? JSON.stringify(data)
      : data);
  
  // Validar permiso de usuario (solo administradores)
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    console.log("❌ Usuario no autorizado:", user?.email);
    return {
      error: 'Unauthorized - only admins can update app version'
    };
  }

  // Obtener versión actual como respaldo
  const currentVersion = await getAppVersion();
  console.log("Versión actual en BD:", currentVersion);

  let version: string = '';
  
  // Extraer versión de los datos recibidos
  if (typeof data === 'string') {
    // Si se pasó un string directamente
    version = data;
    console.log('Versión recibida (string):', version);
  } else if (data instanceof FormData) {
    // Si se pasó un FormData
    const formVersion = data.get('version');
    version = typeof formVersion === 'string' ? formVersion : '';
    console.log('Versión recibida (FormData):', version);
  } else if (data && typeof data === 'object') {
    // Si se pasó un objeto con propiedad version
    if ('version' in data && typeof data.version === 'string') {
      version = data.version;
      console.log('Versión recibida (Object):', version);
    }
  }
  
  // Si no se pudo extraer la versión, verificar el estado previo
  if (!version && _previousState && typeof _previousState === 'object') {
    if ('version' in _previousState && typeof _previousState.version === 'string') {
      version = _previousState.version;
      console.log('Versión extraída del estado previo:', version);
    }
  }
  
  // Si aún no hay versión, usar la actual
  if (!version) {
    version = currentVersion;
    console.log('No se encontró versión, usando versión actual:', version);
  }
  
  // Limpiar la versión de espacios en blanco
  version = version.trim();
  console.log('Versión después de trim:', version);
  
  // Validar formato de versión (x.y.z)
  const versionRegex = /^\d+\.\d+\.\d+$/;
  const isValidFormat = versionRegex.test(version);
  console.log('Es formato válido:', isValidFormat);
  
  if (!isValidFormat) {
    console.log("❌ Formato de versión inválido:", version);
    return {
      error: 'Invalid version format. Use X.Y.Z (e.g., 1.0.0)'
    };
  }

  // Verificar si la versión es diferente a la actual
  if (version === currentVersion) {
    console.log("ℹ️ La versión a actualizar es igual a la actual");
  }

  try {
    console.log("🔄 Actualizando versión a:", version);
    const updatedVersion = await updateAppVersion(version, user.id);
    console.log("✅ Versión actualizada exitosamente a:", updatedVersion);
    
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