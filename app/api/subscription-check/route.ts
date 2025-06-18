import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { user } from "@/lib/db/schema";
import { eq, isNotNull, lt, isNull, and } from "drizzle-orm";
import { isAdminRequest } from "@/lib/auth/utils";
import { sendSubscriptionChangeEmail } from "@/lib/email/services";
import { stripe } from "@/lib/payments/stripe";

/**
 * Endpoint para verificar y actualizar todas las suscripciones:
 * - Suscripciones gratuitas que hayan expirado
 * - Suscripciones de Stripe con problemas o cambios de estado
 * - Inconsistencias en la base de datos
 */
export async function POST(request: Request) {
  try {
    const isAdmin = await isAdminRequest(request);

    const requestData = await request.json().catch(() => ({}));
    const apiSecret = requestData.apiSecret;
    const isValidApiSecret =
      apiSecret === process.env.SUBSCRIPTION_CHECK_SECRET;

    if (!isAdmin && !isValidApiSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const results = {
      freeExpired: 0,
      stripeCanceled: 0,
      stripeUpdated: 0,
      inconsistencies: 0,
      errors: 0,
      notifications: 0,
    };

    const expiredFreeUsers = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.subscriptionStatus, "active"),
          isNotNull(users.subscriptionExpiryDate),
          lt(users.subscriptionExpiryDate, now),
          isNull(users.stripeSubscriptionId)
        )
      );

    for (const user of expiredFreeUsers) {
      try {
        await db
          .update(users)
          .set({
            subscriptionStatus: "expired",
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));

        results.freeExpired++;

        try {
          await sendSubscriptionChangeEmail({
            email: user.email,
            name: user.name || user.email.split("@")[0],
            planName: user.planName || "Free Plan",
            status: "expired",
            dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
          });
          results.notifications++;
        } catch (emailError) {}
      } catch (error) {
        results.errors++;
      }
    }

    try {
      const stripeUsers = await db
        .select()
        .from(users)
        .where(
          and(
            isNotNull(users.stripeSubscriptionId),
            eq(users.subscriptionStatus, "active")
          )
        );

      for (const user of stripeUsers) {
        try {
          const subscription = await stripe.subscriptions.retrieve(
            user.stripeSubscriptionId!
          );

          if (subscription.status !== user.subscriptionStatus) {
            const oldStatus = user.subscriptionStatus;

            await db
              .update(users)
              .set({
                subscriptionStatus: subscription.status,
                updatedAt: new Date(),
              })
              .where(eq(users.id, user.id));

            results.stripeUpdated++;

            if (
              subscription.status === "canceled" ||
              subscription.status === "unpaid" ||
              subscription.status === "past_due"
            ) {
              results.stripeCanceled++;

              try {
                await sendSubscriptionChangeEmail({
                  email: user.email,
                  name: user.name || user.email.split("@")[0],
                  planName: user.planName || "Premium Plan",
                  status: subscription.status,
                  dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
                });
                results.notifications++;
              } catch (emailError) {}
            }
          }
        } catch (stripeError) {
          if (
            stripeError.message?.includes("No such subscription") ||
            stripeError.message?.includes("resource_missing")
          ) {
            await db
              .update(users)
              .set({
                subscriptionStatus: "canceled",
                updatedAt: new Date(),
              })
              .where(eq(users.id, user.id));

            results.stripeCanceled++;

            try {
              await sendSubscriptionChangeEmail({
                email: user.email,
                name: user.name || user.email.split("@")[0],
                planName: user.planName || "Premium Plan",
                status: "canceled",
                dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
              });
              results.notifications++;
            } catch (emailError) {}
          }

          results.errors++;
        }
      }
    } catch (error) {
      results.errors++;
    }

    const inconsistentUsers = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.subscriptionStatus, "active"),
          isNull(users.subscriptionExpiryDate),
          isNull(users.stripeSubscriptionId)
        )
      );

    results.inconsistencies = inconsistentUsers.length;

    return NextResponse.json({
      success: true,
      message: `Verificación de suscripciones completada`,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing subscription check", details: error.message },
      { status: 500 }
    );
  }
}
