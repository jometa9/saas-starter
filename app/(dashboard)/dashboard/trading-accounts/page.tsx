import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { getUserById } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/drizzle";
import { eq, and, isNull } from "drizzle-orm";
import { user, tradingAccounts } from "@/lib/db/schema";
import { AdminTradingAccountsView } from "./admin-trading-accounts-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "User Trading Accounts | Admin Dashboard",
  description: "View and manage trading accounts for a specific user",
};

export default async function UserTradingAccountsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Verify user authentication
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/sign-in");
  }

  // Get the complete user from the database using the session user id (same as dashboard)
  const currentUser = await getUserById(session.user.id);
  if (!currentUser) {
    return redirect("/sign-in");
  }

  // Verify that the user is an administrator
  if (currentUser.role !== "admin" && currentUser.role !== "superadmin") {
    return redirect("/dashboard");
  }

  // Await searchParams before using its properties
  const resolvedSearchParams = await searchParams;

  // Get the userId from query parameters
  const userId = resolvedSearchParams.userId as string;

  if (!userId) {
    return redirect("/dashboard/managed-users");
  }

  // Get target user information
  const targetUser = await db.query.user.findFirst({
    where: and(eq(user.id, userId), isNull(user.deletedAt)),
  });

  if (!targetUser) {
    return redirect("/dashboard/managed-users");
  }

  const accounts = await db
    .select()
    .from(tradingAccounts)
    .where(
      and(
        eq(tradingAccounts.userId, targetUser.id),
        isNull(tradingAccounts.deletedAt)
      )
    )
    .orderBy(tradingAccounts.createdAt);

  return (
    <div className="mx-auto py-6 px-4">
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
