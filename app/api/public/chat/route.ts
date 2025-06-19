import { sendMessageToAssistant } from "@/lib/openai/assistant";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId } = body;

    const currentSessionId = sessionId || nanoid(21);

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

    try {
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

      console.log(
        `API: About to call sendMessageToAssistant with sessionId: "${currentSessionId}"`
      );

      const response = await sendMessageToAssistant(message.trim());

      console.log(
        `API: Successfully got response for session ${currentSessionId}`
      );

      return NextResponse.json({
        success: true,
        response: response,
        sessionId: currentSessionId,
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
              sessionId: currentSessionId,
            },
            { status: 429 }
          );
        }

        if (assistantError.message.includes("thread")) {
          return NextResponse.json(
            {
              error: "Chat session error. Please start a new conversation.",
              fallback: true,
              sessionId: currentSessionId,
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
              sessionId: currentSessionId,
            },
            { status: 503 }
          );
        }

        if (assistantError.message.includes("API key")) {
          return NextResponse.json(
            {
              error: "Authentication error. Please contact support.",
              fallback: true,
              sessionId: currentSessionId,
            },
            { status: 503 }
          );
        }

        // Return the specific error message for debugging
        return NextResponse.json(
          {
            error: `Assistant error: ${assistantError.message}`,
            fallback: true,
            sessionId: currentSessionId,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error: "Error processing your query. Please try again.",
          fallback: true,
          sessionId: currentSessionId,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Public Chat API error:", error);
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
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      sessionId: sessionId,
    });
  } catch (error) {
    console.error("Get chat info error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
