"use server";

import { authOptions } from "@/lib/auth/next-auth";
import { getAdminUsers, getUserById } from "@/lib/db/queries";
import {
  sendBroadcastEmail,
  sendManagedVPSUpdateNotificationToAdmins,
  sendPasswordResetEmail,
  sendRichContentEmail,
  sendSubscriptionChangeEmail,
  sendVersionUpdateEmail,
  sendWelcomeEmail,
} from "@/lib/email/services";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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

    console.log(
      `🧪 Starting comprehensive email template test for ${adminEmail}`
    );

    // 1. Send welcome email
    console.log("📧 Testing Welcome email...");
    await sendWelcomeEmail({
      email: adminEmail,
      name: adminName,
      loginUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    });

    // 2. Send password reset email
    console.log("📧 Testing Password reset email...");
    await sendPasswordResetEmail({
      email: adminEmail,
      name: adminName,
      token: "dummy-token-for-testing",
    });

    // 3. Send subscription change email
    console.log("📧 Testing Subscription change email...");
    await sendSubscriptionChangeEmail({
      email: adminEmail,
      name: adminName,
      planName: "Premium (Test)",
      status: "active",
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });

    // 4. Send version update email
    console.log("📧 Testing Version update email...");
    await sendVersionUpdateEmail({
      email: adminEmail,
      name: adminName,
      currentVersion: "1.0.0",
      newVersion: "1.1.0",
      releaseNotes:
        "This is a test version update with new features and bug fixes.",
      downloadUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      isCritical: false,
    });

    // 5. Send broadcast email
    console.log("📧 Testing Broadcast email...");
    await sendBroadcastEmail({
      email: adminEmail,
      name: adminName,
      subject: "Test Broadcast Message",
      message:
        "This is a test broadcast message to verify the broadcast email template is working correctly.",
      isImportant: true,
    });

    // 6. Send rich content email
    console.log("📧 Testing Rich content email...");
    const testMarkdown = `# Test Rich Content Email

This is a **test email** with *markdown* support.

## Features
- Lists work
- **Bold text**
- *Italic text*
- [Links](https://example.com)

> This is a quote

\`\`\`
Code blocks work too
\`\`\`

---

End of test.`;

    await sendRichContentEmail({
      email: adminEmail,
      name: adminName,
      subject: "Rich Content Test",
      markdownContent: testMarkdown,
    });

    // 7. Send managed VPS notification (to all admins)
    console.log("📧 Testing Managed VPS admin notification...");
    const allAdmins = await getAdminUsers();
    const adminEmails = allAdmins.map((admin) => ({
      email: admin.email,
      name: admin.name || admin.email.split("@")[0],
    }));

    if (adminEmails.length > 0) {
      await sendManagedVPSUpdateNotificationToAdmins({
        userInfo: {
          id: "test-user-id",
          name: "Test User",
          email: "testuser@example.com",
          planName: "IPTRADE Managed VPS",
        },
        updateDetails: {
          accountId: 12345,
          action: "updated",
          accountNumber: "123456789",
          platform: "mt5",
          accountType: "master",
          timestamp: new Date(),
        },
        adminEmails,
      });
    }

    console.log("✅ All email templates tested successfully!");

    return NextResponse.json({
      success: true,
      message: "ALL email templates sent successfully",
      templatesCount: 7,
      templates: [
        "Welcome",
        "Password Reset",
        "Subscription Change",
        "Version Update",
        "Broadcast",
        "Rich Content",
        "Managed VPS Notification",
      ],
      sentTo: adminEmail,
    });
  } catch (error) {
    console.error("Error sending test emails:", error);
    return NextResponse.json(
      {
        error: "Failed to send test emails",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
