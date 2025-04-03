import { NextRequest, NextResponse } from "next/server";
import { getUserByApiKey } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const apiKey = searchParams.get("apiKey");

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is required as a URL parameter (apiKey=your_key)" },
      { status: 401 }
    );
  }

  try {
    const user = await getUserByApiKey(apiKey);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid License Key" },
        { status: 401 }
      );
    }
    const isSubscriptionActive =
      user.subscriptionStatus === "active" ||
      user.subscriptionStatus === "trialing";

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      name: user.name,
      subscriptionStatus: user.subscriptionStatus,
      planName: user.planName,
      isActive: isSubscriptionActive,
    });
  } catch (error) {
    console.error("Error validating subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
