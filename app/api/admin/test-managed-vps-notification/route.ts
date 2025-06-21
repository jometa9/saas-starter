import { authOptions } from "@/lib/auth/next-auth";
import { getAdminUsers, getUserById } from "@/lib/db/queries";
import { sendManagedVPSUpdateNotificationToAdmins } from "@/lib/email/services";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await getUserById(session.user.id);
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.role !== "superadmin")
    ) {
      return NextResponse.json(
        { error: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    // Get test data from request body
    const body = await req.json();
    const {
      action = "updated",
      accountNumber = "123456789",
      platform = "mt5",
      accountType = "master",
    } = body;

    // Create mock user info for testing
    const mockUserInfo = {
      id: "test-user-id",
      name: "Test User",
      email: "testuser@example.com",
      planName: "IPTRADE Managed VPS",
    };

    // Create mock update details
    const mockUpdateDetails = {
      accountId: 12345,
      action: action as "created" | "updated" | "deleted",
      accountNumber,
      platform,
      accountType,
      timestamp: new Date(),
    };

    // Get all admin users
    const admins = await getAdminUsers();

    if (admins.length === 0) {
      return NextResponse.json(
        { error: "No admin users found" },
        { status: 404 }
      );
    }

    const adminEmails = admins.map((admin) => ({
      email: admin.email,
      name: admin.name || admin.email.split("@")[0],
    }));

    // Send test notification
    console.log(
      "🧪 Sending test Managed VPS notification to admins:",
      adminEmails.length
    );

    const result = await sendManagedVPSUpdateNotificationToAdmins({
      userInfo: mockUserInfo,
      updateDetails: mockUpdateDetails,
      adminEmails,
    });

    console.log("✅ Test notification sent successfully:", result);

    return NextResponse.json({
      success: true,
      message: "Test notification sent successfully",
      result,
      adminCount: admins.length,
      mockData: {
        userInfo: mockUserInfo,
        updateDetails: mockUpdateDetails,
      },
    });
  } catch (error) {
    console.error("Test Managed VPS notification API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
