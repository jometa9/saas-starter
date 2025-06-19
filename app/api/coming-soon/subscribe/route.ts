import { sendEmail } from "@/lib/email/config";
import { comingSoonEmailTemplate } from "@/lib/email/templates";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Aquí podrías guardar el email en la base de datos
    // Por ahora solo enviamos el email de agradecimiento

    // Enviar email de agradecimiento
    try {
      const { html, text } = await comingSoonEmailTemplate({
        email: email,
      });

      await sendEmail({
        to: email,
        subject: "Thank you for your interest in IPTRADE!",
        html,
        text,
      });

      // Opcional: También enviar notificación al admin
      if (process.env.ADMIN_EMAIL) {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: "New Coming Soon Subscription - IPTRADE",
          html: `
            <h2>New Subscription</h2>
            <p>Email: <strong>${email}</strong></p>
            <p>Date: ${new Date().toLocaleString()}</p>
          `,
          text: `New Subscription\nEmail: ${email}\nDate: ${new Date().toLocaleString()}`,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Subscription successful",
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Aún devolvemos éxito porque el email se registró
      return NextResponse.json({
        success: true,
        message: "Subscription successful, but email delivery failed",
      });
    }
  } catch (error) {
    console.error("Error in coming-soon subscribe:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
