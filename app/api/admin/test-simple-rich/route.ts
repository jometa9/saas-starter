"use server";

import { authOptions } from "@/lib/auth/next-auth";
import { getUserById } from "@/lib/db/queries";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
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

    console.log("🧪 Starting SIMPLE rich email test...");

    // Import sendEmail directly
    const { sendEmail } = await import("@/lib/email/config");

    const simpleHtml = `
      <h1>Simple Rich Email Test</h1>
      <p>Hello ${currentUser.name || "Admin"},</p>
      <p>This is a <strong>simple test</strong> of the email system.</p>
      <ul>
        <li>Feature 1</li>
        <li>Feature 2</li>
      </ul>
      <p>If you receive this, the email system is working!</p>
    `;

    console.log(`📧 Sending simple email to ${currentUser.email}...`);

    // Send email directly without withRetry
    const result = await sendEmail({
      to: currentUser.email,
      subject: "Simple Rich Email Test",
      html: simpleHtml,
      text: "Simple Rich Email Test - If you receive this, the email system is working!",
    });

    console.log("✅ Simple email sent successfully:", result);

    return NextResponse.json({
      success: true,
      message: "Simple rich email sent successfully!",
      sentTo: currentUser.email,
      result,
    });
  } catch (error) {
    console.error("❌ Error in simple rich email test:", error);
    return NextResponse.json(
      {
        error: "Failed to send simple rich email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
