import { checkoutAction } from "@/lib/payments/actions";
import { getUser } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("🛒 Checkout API called");

  const formData = await request.formData();
  const priceId = formData.get("priceId") as string;
  const changePlan = formData.get("changePlan") === "true";
  const currentPlan = formData.get("currentPlan") as string;

  console.log("📦 Request data:", { priceId, changePlan, currentPlan });

  if (!priceId) {
    console.log("❌ No priceId provided");
    return NextResponse.json(
      { error: "Price ID is required" },
      { status: 400 }
    );
  }

  const user = await getUser();
  if (!user) {
    console.log("❌ No user found");
    // Return JSON response with redirect URL instead of doing server redirect
    return NextResponse.json(
      {
        error: "Authentication required",
        redirect: "/sign-in?redirect=/dashboard/pricing",
      },
      { status: 401 }
    );
  }

  console.log("✅ User authenticated:", user.email);
  console.log("👤 User stripeCustomerId:", user.stripeCustomerId);

  try {
    console.log("🔄 Calling checkoutAction...");

    const checkoutResult = await checkoutAction(priceId, {
      changePlan,
      currentPlan,
    });

    console.log("📊 Checkout result type:", typeof checkoutResult);
    console.log("📊 Checkout result:", checkoutResult);

    if (typeof checkoutResult === "string") {
      console.log("✅ String redirect:", checkoutResult);
      return NextResponse.json({ redirect: checkoutResult }, { status: 200 });
    } else if (checkoutResult.redirect) {
      console.log("✅ Object redirect:", checkoutResult.redirect);
      return NextResponse.json(
        { redirect: checkoutResult.redirect },
        { status: 200 }
      );
    } else if (checkoutResult.error) {
      console.log("❌ Checkout error:", checkoutResult.error);
      return NextResponse.json(
        { error: checkoutResult.error },
        { status: 400 }
      );
    } else {
      console.log("❌ Unknown checkout result");
      return NextResponse.json(
        { error: "Unable to create checkout session" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("💥 Checkout exception:", error);
    return NextResponse.json(
      {
        error: "Checkout failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
