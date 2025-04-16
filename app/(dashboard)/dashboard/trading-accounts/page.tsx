import React from 'react';
import { getUserAuth } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/drizzle';
import { eq, and, isNull } from 'drizzle-orm';
import { users, tradingAccounts } from '@/lib/db/schema';
import { AdminTradingAccountsView } from './admin-trading-accounts-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'User Trading Accounts | Admin Dashboard',
  description: 'View and manage trading accounts for a specific user',
};

interface SearchParams {
  userId?: string;
}

interface PageProps {
  searchParams: SearchParams;
}

export default async function UserTradingAccountsPage({
  searchParams,
}: PageProps) {
  // Verificar autenticación del usuario
  const { session, user } = await getUserAuth();
  
  if (!session || !user) {
    return redirect('/auth/login');
  }

  // Verificar que el usuario es administrador
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    return redirect('/dashboard');
  }

  // Obtener el userId de los parámetros de consulta
  const userId = searchParams.userId;
  
  if (!userId) {
    return redirect('/dashboard/managed-users');
  }

  // Obtener información del usuario
  const targetUser = await db.query.users.findFirst({
    where: and(
      eq(users.id, parseInt(userId)),
      isNull(users.deletedAt)
    ),
  });

  if (!targetUser) {
    return redirect('/dashboard/managed-users');
  }

  const userIdNum = Number(userId);
  
  const accounts = await db.select()
    .from(tradingAccounts)
    .where(
      and(
        eq(tradingAccounts.userId, targetUser.id),
        isNull(tradingAccounts.deletedAt)
      )
    )
    .orderBy(tradingAccounts.createdAt);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Trading Accounts for {targetUser.name || targetUser.email}
        </h1>
        <p className="text-muted-foreground">
          View and manage trading accounts for this user
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Trading Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminTradingAccountsView 
            user={targetUser} 
            initialAccounts={accounts} 
          />
        </CardContent>
      </Card>
    </div>
  );
} 