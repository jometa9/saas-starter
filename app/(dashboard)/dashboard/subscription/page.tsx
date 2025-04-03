import { redirect } from 'next/navigation';
import { Subscription } from './subscription-component';
import { getUser, getAppVersion } from '@/lib/db/queries';

// Indicar que la página no debe ser cacheada
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SubscriptionPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }
  
  // Obtener la versión actual de la aplicación
  const currentVersion = await getAppVersion();
  
  return <Subscription user={user} currentVersion={currentVersion} />;
} 