import React from 'react';
import { Metadata } from 'next';
import { getUserAuth } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';
import { ManagedUsersComponent } from './managed-users-component';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Managed Users | Admin Dashboard',
  description: 'View and manage users with managed service subscription',
};

export default async function ManagedUsersPage() {
  const { session, user } = await getUserAuth();
  
  if (!session || !user) {
    return redirect('/sign-in');
  }

  if (user.role !== 'admin' && user.role !== 'superadmin') {
    return redirect('/dashboard');
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Managed Users</CardTitle>
        </CardHeader>
        <CardContent>
          <ManagedUsersComponent />
        </CardContent>
      </Card>
    </div>
  );
} 