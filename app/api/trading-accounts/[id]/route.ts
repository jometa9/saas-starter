import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/db/queries";
import { getTradingAccountById } from "@/lib/db/queries";
import { updateTradingAccount, deleteTradingAccount } from "@/lib/db/actions";
import { z } from "zod";

// Schema for validating the request body for update
const tradingAccountUpdateSchema = z.object({
  accountNumber: z.string().min(1, "Account number is required").optional(),
  platform: z.string().min(1, "Platform is required").optional(),
  server: z.string().min(1, "Server is required").optional(),
  password: z.string().min(1, "Password is required").optional(),
  accountType: z.string().min(1, "Account type is required").optional(),
  status: z.string().optional(),
  lotCoefficient: z.number().optional(),
  forceLot: z.number().optional(),
  reverseTrade: z.boolean().optional(),
  connectedToMaster: z.string().optional(),
});

// Helper function to check if user can access the trading account
async function canUserAccessAccount(userId: number, accountId: number) {
  const account = await getTradingAccountById(accountId);
  
  if (!account) {
    return { allowed: false, error: "Trading account not found", status: 404 };
  }
  
  if (account.userId !== userId) {
    return { allowed: false, error: "Unauthorized access to trading account", status: 403 };
  }
  
  return { allowed: true, account };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = parseInt(params.id);
    if (isNaN(accountId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const accessCheck = await canUserAccessAccount(user.id, accountId);
    if (!accessCheck.allowed) {
      return NextResponse.json(
        { error: accessCheck.error },
        { status: accessCheck.status }
      );
    }

    return NextResponse.json({ account: accessCheck.account });
  } catch (error) {
    
    return NextResponse.json(
      { error: "Failed to get trading account" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = parseInt(params.id);
    if (isNaN(accountId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const accessCheck = await canUserAccessAccount(user.id, accountId);
    if (!accessCheck.allowed) {
      return NextResponse.json(
        { error: accessCheck.error },
        { status: accessCheck.status }
      );
    }

    const body = await req.json();
    
    // Validate request body
    const validation = tradingAccountUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const result = await updateTradingAccount(accountId, validation.data);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ account: result.account });
  } catch (error) {
    
    return NextResponse.json(
      { error: "Failed to update trading account" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = parseInt(params.id);
    if (isNaN(accountId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const accessCheck = await canUserAccessAccount(user.id, accountId);
    if (!accessCheck.allowed) {
      return NextResponse.json(
        { error: accessCheck.error },
        { status: accessCheck.status }
      );
    }

    const result = await deleteTradingAccount(accountId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Trading account deleted successfully" }
    );
  } catch (error) {
    
    return NextResponse.json(
      { error: "Failed to delete trading account" },
      { status: 500 }
    );
  }
} 