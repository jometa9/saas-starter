import { NextRequest, NextResponse } from "next/server";
import { testEmailConfiguration, sendEmail } from "@/lib/email/config";
import { isAdminRequest } from "@/lib/auth/utils";

export async function GET(req: NextRequest) {
  try {
    // Check if it's an admin request
    const isAdmin = await isAdminRequest(req);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized, admin access required" },
        { status: 403 }
      );
    }

    // Run email configuration tests
    const configTestResult = await testEmailConfiguration();

    // Return results
    return NextResponse.json({
      success: configTestResult.success,
      message: configTestResult.message,
      emailMode:
        process.env.NEXT_PUBLIC_EMAIL_MODE || process.env.NODE_ENV || "unknown",
      testEmailAddress:
        process.env.RESEND_TEST_EMAIL || "onboarding@resend.dev",
      resendApiKeyConfigured: !!process.env.RESEND_API_KEY,
      smtpConfigured: !!process.env.SMTP_HOST,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error testing email configuration" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if it's an admin request
    const isAdmin = await isAdminRequest(req);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized, admin access required" },
        { status: 403 }
      );
    }

    // Get request data
    const data = await req.json();
    const { to = process.env.ADMIN_EMAIL } = data;

    if (!to) {
      return NextResponse.json(
        { error: "An email address is required to send" },
        { status: 400 }
      );
    }

    // Send a test email
    const emailResult = await sendEmail({
      to,
      subject: "🧪 Test Email - IPTRADE",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Test Email</h1>
          <p>This is a test email sent from your IPTRADE application.</p>
          <p>If you are seeing this, the email configuration is working correctly!</p>
          <hr />
          <p><strong>Technical details:</strong></p>
          <ul>
            <li>Mode: ${process.env.NEXT_PUBLIC_EMAIL_MODE || process.env.NODE_ENV || "unknown"}</li>
            <li>Test email: ${process.env.RESEND_TEST_EMAIL || "Not configured"}</li>
            <li>Resend API: ${process.env.RESEND_API_KEY ? "Configured" : "Not configured"}</li>
            <li>SMTP: ${process.env.SMTP_HOST ? "Configured" : "Not configured"}</li>
            <li>Timestamp: ${new Date().toISOString()}</li>
          </ul>
        </div>
      `,
      text: `Test Email\n\nThis is a test email sent from your IPTRADE application.\nIf you are seeing this, the email configuration is working correctly!\n\nTechnical details:\n- Mode: ${process.env.NEXT_PUBLIC_EMAIL_MODE || process.env.NODE_ENV || "unknown"}\n- Test email: ${process.env.RESEND_TEST_EMAIL || "Not configured"}\n- Resend API: ${process.env.RESEND_API_KEY ? "Configured" : "Not configured"}\n- SMTP: ${process.env.SMTP_HOST ? "Configured" : "Not configured"}\n- Timestamp: ${new Date().toISOString()}`,
    });

    // Return results
    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      result: emailResult,
      emailMode:
        process.env.NEXT_PUBLIC_EMAIL_MODE || process.env.NODE_ENV || "unknown",
      testEmailAddress:
        process.env.RESEND_TEST_EMAIL || "onboarding@resend.dev",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error sending test email",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
