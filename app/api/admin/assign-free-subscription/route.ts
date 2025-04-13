import { NextResponse } from "next/server";
import { getUser } from "@/lib/db/queries";
import { updateUserById } from "@/lib/db/queries";
import { users } from "@/lib/db/schema";
import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email/services";
import { generateApiKey } from "@/lib/utils";

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user?.email || user?.role !== "admin") {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await request.json();
    const { email, plan, duration, force = false } = body;

    if (!email || !plan || !duration) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    let targetUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let isNewUser = false;
    let userId: number;
    let randomPassword = "";
    let hadActivePaidSubscription = false;
    let previousSubscriptionInfo = null;

    if (targetUser.length === 0) {
      isNewUser = true;

      randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await hashPassword(randomPassword);

      const userName = email.split("@")[0];

      const apiKey = generateApiKey();

      let stripeCustomerId = null;
      try {
        const { getStripe } = await import("@/lib/payments/stripe");
        const stripe = getStripe();

        const customer = await stripe.customers.create({
          email,
          metadata: {
            source: "admin_created",
          },
        });

        stripeCustomerId = customer.id;
      } catch (stripeError) {
        console.error(
          "Error creating Stripe customer for admin-created user:",
          stripeError
        );
      }

      const newUser = await db
        .insert(users)
        .values({
          email: email,
          name: userName,
          passwordHash: hashedPassword,
          role: "member",
          apiKey: apiKey,
          stripeCustomerId: stripeCustomerId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      userId = newUser[0].id;

      try {
        await sendWelcomeEmail({
          email,
          name: userName,
          loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login`,
        });

        const { sendBroadcastEmail } = await import("@/lib/email/services");
        await sendBroadcastEmail({
          email,
          name: userName,
          subject: "Your IPTRADE Account Information",
          message: `Your account has been created with a free ${plan} subscription valid for ${duration} months.\n\nYour temporary password is: ${randomPassword}\n\nPlease login and change your password as soon as possible.\n\nYour account has been fully set up with API access keys and all features.`,
          ctaLabel: "Login Now",
          ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login`,
          isImportant: true,
        });
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Continue with the process even if email fails
      }
    } else {
      userId = targetUser[0].id;
      
      const existingUser = targetUser[0];
      
      previousSubscriptionInfo = {
        planName: existingUser.planName,
        subscriptionStatus: existingUser.subscriptionStatus,
        stripeSubscriptionId: existingUser.stripeSubscriptionId,
        stripeProductId: existingUser.stripeProductId,
        subscriptionExpiryDate: existingUser.subscriptionExpiryDate,
      };
      
      if (
        existingUser.subscriptionStatus === "active" || 
        existingUser.subscriptionStatus === "trialing"
      ) {
        if (existingUser.stripeSubscriptionId) {
          hadActivePaidSubscription = true;
          
          if (!force) {
            return NextResponse.json({
              warning: true,
              message: "User already has an active paid subscription. Set force=true to override.",
              existingSubscription: {
                planName: existingUser.planName,
                status: existingUser.subscriptionStatus,
                isPaid: !!existingUser.stripeSubscriptionId,
              },
            }, { status: 409 });
          }
          
          console.warn(`Admin is overriding active paid subscription for user ${userId}`);
        } else if (existingUser.subscriptionExpiryDate && existingUser.subscriptionExpiryDate > new Date()) {
          console.log(`User ${userId} already has an active free subscription. Extending/upgrading to ${plan}`);
        }
      }
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + parseInt(duration.toString()));

    await updateUserById(userId, {
      planName: plan,
      subscriptionStatus: "active",
      subscriptionExpiryDate: expiryDate,
      stripeSubscriptionId: null,
      stripeProductId: null,
    });

    if (!isNewUser) {
      try {
        const { sendSubscriptionChangeEmail } = await import(
          "@/lib/email/services"
        );
        const targetUserName = targetUser[0].name || email.split("@")[0];
        
        let customMessage = "";
        if (hadActivePaidSubscription) {
          customMessage = "Note: Your previous paid subscription has been replaced with this free subscription.";
        } else if (previousSubscriptionInfo?.subscriptionStatus === "active" && previousSubscriptionInfo?.subscriptionExpiryDate) {
          customMessage = "Your previous free subscription has been replaced with this new subscription.";
        }
        
        await sendSubscriptionChangeEmail({
          email,
          name: targetUserName,
          planName: plan,
          status: "active",
          expiryDate: expiryDate.toISOString(),
        });
        
        if (customMessage) {
          const { sendBroadcastEmail } = await import("@/lib/email/services");
          await sendBroadcastEmail({
            email,
            name: targetUserName,
            subject: "Your IPTRADE Subscription Update",
            message: `Your subscription has been updated by an administrator to the ${plan} plan, valid until ${expiryDate.toLocaleDateString()}.\n\n${customMessage}\n\nIf you have any questions, please contact our support team.`,
            ctaLabel: "View Dashboard",
            ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
            isImportant: true,
          });
        }
      } catch (emailError) {
        console.error("Error sending subscription email:", emailError);
        // Continue with the process even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: isNewUser 
        ? "User created and free subscription assigned successfully. Welcome emails sent." 
        : hadActivePaidSubscription
          ? "Warning: User's paid subscription has been replaced with a free subscription."
          : "Free subscription assigned successfully. Notification email sent.",
      user: {
        email,
        plan,
        duration,
        expiryDate: expiryDate.toISOString(),
        isNewUser,
        previousSubscription: hadActivePaidSubscription ? previousSubscriptionInfo : undefined,
      },
    });
  } catch (error) {
    console.error("Error assigning free subscription:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to assign free subscription",
      },
      { status: 500 }
    );
  }
}
