import { NextResponse } from "next/server";
import { getUser } from "@/lib/db/queries";
import {
  sendWelcomeEmail,
  sendVersionUpdateEmail,
  sendBroadcastEmail,
  sendPasswordResetEmail,
  sendSubscriptionChangeEmail,
} from "@/lib/email/services";

export async function POST() {
  try {
    // Verify that the user is an admin
    const user = await getUser();
    if (!user?.email || user?.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const adminEmail = user.email;
    const adminName = user.name || "Admin";

    // Send all types of test emails
    await Promise.all([
      // Welcome email
      sendWelcomeEmail({
        email: adminEmail,
        name: adminName,
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      }),

      // Version update email
      sendVersionUpdateEmail({
        email: adminEmail,
        name: adminName,
        currentVersion: "1.0.0",
        newVersion: "1.1.0",
        releaseNotes:
          "- New user interface\n- Performance improvements\n- Bug fixes",
        downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        isCritical: true,
      }),

      // Broadcast email
      sendBroadcastEmail({
        email: adminEmail,
        name: adminName,
        subject: "Important Announcement",
        message: "This is a test message for the broadcast email.",
        ctaLabel: "View Dashboard",
        ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        isImportant: true,
      }),

      // Password reset email
      sendPasswordResetEmail({
        email: adminEmail,
        name: adminName,
        token: "test-token-123",
        expiryMinutes: 60,
      }),

      // Subscription change email
      sendSubscriptionChangeEmail({
        email: adminEmail,
        name: adminName,
        planName: "Pro Plan",
        status: "active",
        expiryDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Test emails sent successfully",
    });
  } catch (error) {
    console.error("Error sending test emails:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test emails",
      },
      { status: 500 }
    );
  }
}
