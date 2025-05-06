import { Settings } from '../settings';
import { getUser, getAppVersion } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  // Obtener la versión actual desde la base de datos
  const currentVersion = await getAppVersion();
  
  return <Settings user={user} currentVersion={currentVersion} />;
} 