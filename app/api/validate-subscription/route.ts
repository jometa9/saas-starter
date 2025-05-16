import { NextRequest, NextResponse } from "next/server";
import { getUserByApiKey, updateUserSubscription } from "@/lib/db/queries";
import { stripe } from "@/lib/payments/stripe";
import { db } from "@/lib/db/drizzle";
import { user} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const apiKey = searchParams.get("apiKey");
  const clientType = searchParams.get("clientType");
  const isElectronClient = clientType === "electron";

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is required as a URL parameter (apiKey=your_key)" },
      { status: 401 }
    );
  }

  if (!isElectronClient) {
    const origin = request.headers.get("origin");

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
    const isValidOrigin = !origin || allowedOrigins.includes(origin);

    if (!isValidOrigin && allowedOrigins.length > 0) {
      return NextResponse.json(
        { error: "Unauthorized request origin" },
        { status: 403 }
      );
    }
  }

  try {
    const user = await getUserByApiKey(apiKey);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid License Key" },
        { status: 401 }
      );
    }

    let statusChanged = false;
    let statusReason = "";
    const now = new Date();

    if (user.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          user.stripeSubscriptionId
        );

        // Si el estado en Stripe es diferente al de la base de datos, actualizar
        if (subscription.status !== user.subscriptionStatus) {
          const plan = subscription.items.data[0]?.plan;

          await updateUserSubscription(user.id, {
            stripeSubscriptionId: subscription.id,
            stripeProductId: plan?.product as string,
            planName: user.planName,
            subscriptionStatus: subscription.status,
          });

          statusChanged = true;
          statusReason = "Stripe subscription status updated";
          user.subscriptionStatus = subscription.status;
        }
      } catch (stripeError) {
        
        if (
          user.subscriptionExpiryDate &&
          user.subscriptionExpiryDate < now &&
          (user.subscriptionStatus === "active" ||
            user.subscriptionStatus === "trialing")
        ) {
          await db
            .update(users)
            .set({
              subscriptionStatus: "past_due",
              updatedAt: now,
            })
            .where(eq(users.id, user.id));

          statusChanged = true;
          statusReason = "Payment appears to be overdue";
          user.subscriptionStatus = "past_due";
        }
      }
    } else if (
      !user.stripeSubscriptionId &&
      user.subscriptionStatus === "active" &&
      user.subscriptionExpiryDate
    ) {
      if (user.subscriptionExpiryDate < now) {
        await db
          .update(users)
          .set({
            subscriptionStatus: "expired",
            updatedAt: now,
          })
          .where(eq(users.id, user.id));

        statusChanged = true;
        statusReason = "Free subscription has expired";
        user.subscriptionStatus = "expired";
      }
    } else if (
      user.subscriptionStatus === "active" &&
      !user.subscriptionExpiryDate &&
      !user.stripeSubscriptionId
    ) {
      
    }

    const isSubscriptionActive =
      user.subscriptionStatus === "active" ||
      user.subscriptionStatus === "trialing" ||
      user.subscriptionStatus === "admin_assigned";

    const timeRemaining = user.subscriptionExpiryDate
      ? Math.max(
          0,
          Math.floor(
            (user.subscriptionExpiryDate.getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : undefined;

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      name: user.name,
      subscriptionStatus: user.subscriptionStatus,
      planName: user.planName,
      isActive: isSubscriptionActive,
      expiryDate: user.subscriptionExpiryDate
        ? user.subscriptionExpiryDate.toISOString()
        : undefined,
      daysRemaining: timeRemaining,
      statusChanged,
      statusReason: statusChanged ? statusReason : undefined,
      subscriptionType: user.stripeSubscriptionId
        ? "paid"
        : user.subscriptionStatus === "admin_assigned"
          ? "admin_assigned"
          : user.subscriptionStatus === "active"
            ? "free"
            : "none",
    });
  } catch (error) {
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
