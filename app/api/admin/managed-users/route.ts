import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
// Making sure we're using the correct imports - users only, no subscriptions
import { user, tradingAccounts } from '@/lib/db/schema';
import { eq, and, or, inArray, isNull } from 'drizzle-orm';
import { getUserAuth } from '@/lib/auth/utils';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Verify admin access
    const { session, user: currentUser } = await getUserAuth();
    if (!session || !currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user has admin permissions
    if (currentUser.role !== 'admin' && currentUser.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all users with managed service subscription (IPTRADE Managed VPS)
    const managedUsers = await db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      plan: user.planName,
      status: user.subscriptionStatus,
    })
    .from(user)
    .where(
      and(
        inArray(user.subscriptionStatus, ['active', 'admin_assigned', 'trialing']),
        eq(user.planName, 'IPTRADE Managed VPS')
      )
    );

    const usersWithAccountCounts = await Promise.all(
      managedUsers.map(async (userObj) => {
        // Consulta directa usando join adecuado
        const accountsQuery = await db
          .select({ count: sql<number>`count(*)` })
          .from(tradingAccounts)
          .where(
            and(
              eq(tradingAccounts.userId, userObj.id),
              isNull(tradingAccounts.deletedAt)
            )
          );
        
        const count = accountsQuery[0]?.count || 0;
        
        return {
          ...userObj,
          tradingAccountsCount: count
        };
      })
    );

    return NextResponse.json({ users: usersWithAccountCounts });
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 