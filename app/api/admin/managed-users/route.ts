import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
// Making sure we're using the correct imports - users only, no subscriptions
import { user, tradingAccounts } from "@/lib/db/schema";
import { eq, and, or, inArray, isNull } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { getUserById } from "@/lib/db/queries";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Verify authentication using the same method as admin pages
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the complete user from the database
    const currentUser = await getUserById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Verify user has admin permissions
    if (currentUser.role !== "admin" && currentUser.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all users with managed service subscription (IPTRADE Managed VPS)
    const managedUsers = await db
      .select({
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
          inArray(user.subscriptionStatus, [
            "active",
            "admin_assigned",
            "trialing",
          ]),
          eq(user.planName, "IPTRADE Managed VPS")
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
          tradingAccountsCount: count,
        };
      })
    );

    return NextResponse.json({ users: usersWithAccountCounts });
  } catch (error) {
    console.error("Error fetching managed users:", error);
    return NextResponse.json(
      { error: "Failed to fetch managed users" },
      { status: 500 }
    );
  }
}
