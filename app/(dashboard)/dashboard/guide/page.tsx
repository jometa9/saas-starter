import { redirect } from 'next/navigation';
import { Guide } from './guide-component';
import { getUser } from '@/lib/db/queries';

// Indicar que la página no debe ser cacheada
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GuidePage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }
  
  return <Guide user={user} />;
} 