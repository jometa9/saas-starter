import { NextResponse } from "next/server";
import { sendBroadcastEmail } from "@/lib/email/services";
import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = contactSchema.parse(body);

    const targetEmail =
      process.env.NODE_ENV === "development"
        ? process.env.RESEND_TEST_EMAIL || "onboarding@resend.dev"
        : process.env.CONTACT_EMAIL || "your-email@example.com";

    await sendBroadcastEmail({
      email: targetEmail,
      name: "Admin",
      subject: `Contact Form: ${validatedData.subject}`,
      message: `
From: ${validatedData.firstName} ${validatedData.lastName}
Email: ${validatedData.email}

Message:
${validatedData.message}
      `,
      isImportant: true,
    });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
