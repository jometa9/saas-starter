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

    console.log("🧪 Starting TEMPLATE ONLY test...");

    // Import template functions directly
    const { loadTemplate, replaceTemplateVariables } = await import(
      "@/lib/email/template-loader"
    );
    const { sendEmail } = await import("@/lib/email/config");

    console.log("📄 Loading rich-content template...");
    const template = await loadTemplate("rich-content");
    console.log("✅ Template loaded successfully");

    console.log("🔄 Replacing template variables...");
    const html = replaceTemplateVariables(template, {
      name: currentUser.name || "Admin",
      subject: "Template Only Test",
      richContent:
        "<h2>Simple HTML Content</h2><p>This is <strong>simple HTML</strong> without markdown processing.</p><ul><li>Item 1</li><li>Item 2</li></ul>",
      year: new Date().getFullYear(),
    });
    console.log("✅ Variables replaced successfully");

    console.log(`📧 Sending template email to ${currentUser.email}...`);

    // Send email directly
    const result = await sendEmail({
      to: currentUser.email,
      subject: "Template Only Test",
      html,
      text: "Template Only Test - Simple HTML without markdown processing.",
    });

    console.log("✅ Template email sent successfully:", result);

    return NextResponse.json({
      success: true,
      message: "Template only email sent successfully!",
      sentTo: currentUser.email,
      result,
    });
  } catch (error) {
    console.error("❌ Error in template only test:", error);
    return NextResponse.json(
      {
        error: "Failed to send template only email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
