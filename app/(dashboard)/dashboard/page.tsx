import { redirect } from 'next/navigation';
import { Settings } from './settings';
import { getUser, getAppVersion } from '@/lib/db/queries';

// Indicar que la página no debe ser cacheada
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }
  
  // Obtener la versión actual de la aplicación
  const currentVersion = await getAppVersion();
  
  return <Settings user={user} currentVersion={currentVersion} />;
}
