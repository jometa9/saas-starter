import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { getUserById } from "@/lib/db/queries";
import {
  sendMessageToAssistant,
  getUserThreadInfo,
  clearUserThread,
} from "@/lib/openai/assistant";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await getUserById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const body = await req.json();
    const { message, action } = body;

    if (action === "clear") {
      clearUserThread(currentUser.id);
      return NextResponse.json({ success: true, message: "Thread cleared" });
    }

    if (action === "info") {
      const threadInfo = getUserThreadInfo(currentUser.id);
      return NextResponse.json({ threadInfo });
    }

    // Validate message
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (message.length > 4000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    // Send message to assistant
    try {
      const response = await sendMessageToAssistant(
        currentUser.id,
        message.trim()
      );

      return NextResponse.json({
        success: true,
        response: response,
        threadId: getUserThreadInfo(currentUser.id)?.threadId,
      });
    } catch (assistantError) {
      console.error("Assistant error:", assistantError);

      // If it's a specific OpenAI error, give a more useful response
      if (assistantError instanceof Error) {
        if (assistantError.message.includes("rate limit")) {
          return NextResponse.json(
            {
              error:
                "Service temporarily busy. Please try again in a few moments.",
              fallback: true,
            },
            { status: 429 }
          );
        }

        if (assistantError.message.includes("assistant")) {
          return NextResponse.json(
            {
              error:
                "The assistant is not available at this time. Please contact support.",
              fallback: true,
            },
            { status: 503 }
          );
        }
      }

      return NextResponse.json(
        {
          error: "Error processing your query. Please try again.",
          fallback: true,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        fallback: true,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await getUserById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Get current thread information
    const threadInfo = getUserThreadInfo(currentUser.id);

    return NextResponse.json({
      hasActiveThread: !!threadInfo,
      threadInfo: threadInfo
        ? {
            threadId: threadInfo.threadId,
            createdAt: threadInfo.createdAt,
            lastActivity: threadInfo.lastActivity,
          }
        : null,
    });
  } catch (error) {
    console.error("Get thread info error:", error);
    return NextResponse.json(
      { error: "Error getting thread info" },
      { status: 500 }
    );
  }
}
