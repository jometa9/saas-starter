import { NextRequest, NextResponse } from "next/server";
import { getAppVersion } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  try {
    const version = await getAppVersion();
    
    return NextResponse.json({
      version: version,
      success: true
    });
  } catch (error) {
    
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
} 