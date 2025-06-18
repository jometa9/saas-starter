"use server";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { getUserById } from "@/lib/db/queries";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendSubscriptionChangeEmail,
} from "@/lib/email";

export async function POST(req: NextRequest) {
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

    // Verify admin permissions
    if (currentUser.role !== "admin" && currentUser.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Send test emails to the admin user
    const adminEmail = currentUser.email;
    const adminName = currentUser.name || adminEmail.split("@")[0];

    // Send welcome email
    await sendWelcomeEmail({
      email: adminEmail,
      name: adminName,
      loginUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    });

    // Send password reset email
    await sendPasswordResetEmail({
      email: adminEmail,
      name: adminName,
      resetToken: "dummy-token-for-testing",
      resetUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=dummy-token-for-testing`,
    });

    // Send subscription change email
    await sendSubscriptionChangeEmail({
      email: adminEmail,
      name: adminName,
      planName: "Premium (Test)",
      status: "active",
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });

    return NextResponse.json({
      success: true,
      message: "Test emails sent successfully",
    });
  } catch (error) {
    console.error("Error sending test emails:", error);
    return NextResponse.json(
      { error: "Failed to send test emails" },
      { status: 500 }
    );
  }
}
