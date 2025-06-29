import { authOptions } from "@/lib/auth/next-auth";
import { getUserById } from "@/lib/db/queries";
import { sendMessageToAssistant } from "@/lib/openai/assistant";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
    const { message } = body;

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
      console.log(`API: Processing message for user ${currentUser.id}`);

      // Check if OpenAI is configured
      if (!process.env.OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY is not configured");
        return NextResponse.json(
          {
            error: "OpenAI service is not configured. Please contact support.",
            fallback: true,
          },
          { status: 503 }
        );
      }

      if (!process.env.OPENAI_ASSISTANT_ID) {
        console.error("OPENAI_ASSISTANT_ID is not configured");
        return NextResponse.json(
          {
            error: "Assistant is not configured. Please contact support.",
            fallback: true,
          },
          { status: 503 }
        );
      }

      console.log(`API: About to call sendMessageToAssistant`);
      const response = await sendMessageToAssistant(message.trim());

      console.log(`API: Successfully got response`);

      return NextResponse.json({
        success: true,
        response: response,
      });
    } catch (assistantError) {
      console.error("Assistant error:", assistantError);

      // If it's a specific OpenAI error, give a more useful response
      if (assistantError instanceof Error) {
        console.error(`Assistant error details: ${assistantError.message}`);

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

        if (assistantError.message.includes("thread")) {
          return NextResponse.json(
            {
              error: "Chat session error. Please start a new conversation.",
              fallback: true,
            },
            { status: 500 }
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

        if (assistantError.message.includes("API key")) {
          return NextResponse.json(
            {
              error: "Authentication error. Please contact support.",
              fallback: true,
            },
            { status: 503 }
          );
        }

        // Return the specific error message for debugging
        return NextResponse.json(
          {
            error: `Assistant error: ${assistantError.message}`,
            fallback: true,
          },
          { status: 500 }
        );
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

    // Since we don't maintain threads anymore, always return no active thread
    return NextResponse.json({
      hasActiveThread: false,
      threadInfo: null,
    });
  } catch (error) {
    console.error("Get thread info error:", error);
    return NextResponse.json(
      { error: "Error getting thread info" },
      { status: 500 }
    );
  }
}
