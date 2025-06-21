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

    console.log("Starting rich email test...");

    // Test markdown content
    const testMarkdown = `# Test Email

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

    const { sendRichContentEmail } = await import("@/lib/email/services");

    console.log("Sending test rich email to admin...");

    // Send test email to the current admin user
    await sendRichContentEmail({
      email: currentUser.email,
      name: currentUser.name || "Admin",
      subject: "Rich Email Test",
      markdownContent: testMarkdown,
    });

    console.log("Test rich email sent successfully!");

    return NextResponse.json({
      success: true,
      message: "Test rich email sent successfully!",
      sentTo: currentUser.email,
    });
  } catch (error) {
    console.error("Error in test rich email:", error);
    return NextResponse.json(
      {
        error: "Failed to send test rich email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
