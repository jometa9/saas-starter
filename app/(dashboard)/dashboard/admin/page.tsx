import { redirect } from 'next/navigation';
import { getUser, getAppVersion } from '@/lib/db/queries';
import AdminLayout from './admin-layout';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const user = await getUser();

  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }
  
  const currentVersion = await getAppVersion();
  
  return <AdminLayout user={user} currentVersion={currentVersion} />;
} 