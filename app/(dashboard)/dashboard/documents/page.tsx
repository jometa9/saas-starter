import { redirect } from 'next/navigation';
import { Documents } from './documents-component';
import { getUser } from '@/lib/db/queries';

// Indicar que la página no debe ser cacheada
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DocumentsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }
  
  return <Documents user={user} />;
} 