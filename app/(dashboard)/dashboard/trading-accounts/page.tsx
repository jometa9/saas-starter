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

export default async function UserTradingAccountsPage({
  searchParams,
}: {
  searchParams: { userId?: string };
}) {
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
    // Si el usuario no existe, redirigir a la lista de usuarios gestionados
    return redirect('/dashboard/managed-users');
  }

  // Convertir ID de forma segura
  const userIdNum = Number(userId);
  
  // Imprimir información para depuración (se verá en los logs del servidor)
  console.log(`Buscando cuentas para el usuario ID: ${userId} (${typeof userId})`);
  console.log(`ID de usuario convertido: ${userIdNum} (${typeof userIdNum})`);
  console.log(`ID del targetUser: ${targetUser.id} (${typeof targetUser.id})`);
  
  // Obtener las cuentas de trading usando el ID de targetUser directamente
  const accounts = await db.select()
    .from(tradingAccounts)
    .where(
      and(
        eq(tradingAccounts.userId, targetUser.id),
        isNull(tradingAccounts.deletedAt)
      )
    )
    .orderBy(tradingAccounts.createdAt);
  
  console.log(`Número de cuentas encontradas: ${accounts.length}`);
  
  if (accounts.length > 0) {
    console.log('Primera cuenta:', accounts[0]);
  }

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