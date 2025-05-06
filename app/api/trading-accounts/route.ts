import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/db/queries";
import { getUserTradingAccounts } from "@/lib/db/queries";
import { createTradingAccount, updateTradingAccount, deleteTradingAccount } from "@/lib/db/actions";
import { z } from "zod";
import { NewTradingAccount } from "@/lib/db/schema";

// Schema for validating the request body
const tradingAccountSchema = z.object({
  accountNumber: z.string().min(1, "Account number is required"),
  platform: z.string().min(1, "Platform is required"),
  server: z.string().min(1, "Server is required"),
  password: z.string().min(1, "Password is required"),
  accountType: z.string().min(1, "Account type is required"),
  status: z.string().optional(),
  lotCoefficient: z.number().optional(),
  forceLot: z.number().optional(),
  reverseTrade: z.boolean().optional(),
  connectedToMaster: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has a managed VPS or unlimited plan
    if (
      !(
        (user.planName === "IPTRADE Unlimited" || 
        user.planName === "IPTRADE Managed VPS") &&
        (user.subscriptionStatus === "active" ||
          user.subscriptionStatus === "trialing" ||
          user.subscriptionStatus === "admin_assigned")
      )
    ) {
      return NextResponse.json(
        { error: "Subscription required" },
        { status: 403 }
      );
    }

    const accounts = await getUserTradingAccounts(user.id);
    return NextResponse.json({ accounts });
  } catch (error) {
    
    return NextResponse.json(
      { error: "Failed to get trading accounts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has a managed VPS or unlimited plan
    if (
      !(
        (user.planName === "IPTRADE Unlimited" || 
        user.planName === "IPTRADE Managed VPS") &&
        (user.subscriptionStatus === "active" ||
          user.subscriptionStatus === "trialing" ||
          user.subscriptionStatus === "admin_assigned")
      )
    ) {
      return NextResponse.json(
        { error: "Subscription required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Validate request body
    const validation = tradingAccountSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    // Create trading account
    const accountData: NewTradingAccount = {
      ...validation.data,
      userId: user.id,
    };

    const result = await createTradingAccount(accountData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { account: result.account },
      { status: 201 }
    );
  } catch (error) {
    
    return NextResponse.json(
      { error: "Failed to create trading account" },
      { status: 500 }
    );
  }
} 