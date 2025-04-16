import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
// Making sure we're using the correct imports - users only, no subscriptions
import { users, tradingAccounts } from '@/lib/db/schema';
import { eq, and, or, inArray, isNull } from 'drizzle-orm';
import { getUserAuth } from '@/lib/auth/utils';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Verify admin access
    const { session, user } = await getUserAuth();
    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user has admin permissions
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all users with managed service subscription (IPTRADE Managed VPS)
    const managedUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      plan: users.planName,
      status: users.subscriptionStatus,
    })
    .from(users)
    .where(
      and(
        inArray(users.subscriptionStatus, ['active', 'admin_assigned', 'trialing']),
        eq(users.planName, 'IPTRADE Managed VPS')
      )
    );

    // Logging para depuración
    console.log(`Encontrados ${managedUsers.length} usuarios con plan Managed VPS`);

    // For each user, count their trading accounts more directamente
    const usersWithAccountCounts = await Promise.all(
      managedUsers.map(async (user) => {
        // Consulta directa usando join adecuado
        const accountsQuery = await db
          .select({ count: sql<number>`count(*)` })
          .from(tradingAccounts)
          .where(
            and(
              eq(tradingAccounts.userId, user.id),
              isNull(tradingAccounts.deletedAt)
            )
          );
        
        const count = accountsQuery[0]?.count || 0;
        
        // Logging para depuración
        console.log(`Usuario ID ${user.id}: ${count} cuentas de trading`);
        
        return {
          ...user,
          tradingAccountsCount: count
        };
      })
    );

    return NextResponse.json({ users: usersWithAccountCounts });
  } catch (error) {
    console.error('Error fetching managed users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 