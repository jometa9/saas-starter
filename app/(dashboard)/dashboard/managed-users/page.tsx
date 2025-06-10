import React from 'react';
import { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { getUserById } from "@/lib/db/queries";
import { redirect } from 'next/navigation';
import { ManagedUsersComponent } from './managed-users-component';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Managed Users | Admin Dashboard',
  description: 'View and manage users with managed service subscription',
};

export default async function ManagedUsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return redirect('/sign-in');
  }

  // Get the complete user from the database using the session user id (same as dashboard)
  const user = await getUserById(session.user.id);
  if (!user) {
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