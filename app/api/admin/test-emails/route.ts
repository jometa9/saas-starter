import { NextResponse } from "next/server";
import { getUser } from "@/lib/db/queries";
import {
  sendWelcomeEmail,
  sendVersionUpdateEmail,
  sendBroadcastEmail,
  sendPasswordResetEmail,
  sendSubscriptionChangeEmail,
} from "@/lib/email/services";

export async function POST() {
  try {
    // Verificar que el usuario es admin
    const user = await getUser();
    if (!user?.email || user?.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const adminEmail = user.email;
    const adminName = user.name || "Admin";

    // Enviar todos los tipos de emails de prueba
    await Promise.all([
      // Welcome email
      sendWelcomeEmail({
        email: adminEmail,
        name: adminName,
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      }),

      // Version update email
      sendVersionUpdateEmail({
        email: adminEmail,
        name: adminName,
        currentVersion: "1.0.0",
        newVersion: "1.1.0",
        releaseNotes:
          "- Nueva interfaz de usuario\n- Mejoras de rendimiento\n- Corrección de errores",
        downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        isCritical: true,
      }),

      // Broadcast email
      sendBroadcastEmail({
        email: adminEmail,
        name: adminName,
        subject: "Anuncio Importante",
        message: "Este es un mensaje de prueba para el email de broadcast.",
        ctaLabel: "Ver Dashboard",
        ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        isImportant: true,
      }),

      // Password reset email
      sendPasswordResetEmail({
        email: adminEmail,
        name: adminName,
        token: "test-token-123",
        expiryMinutes: 60,
      }),

      // Subscription change email
      sendSubscriptionChangeEmail({
        email: adminEmail,
        name: adminName,
        planName: "Pro Plan",
        status: "active",
        expiryDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Test emails sent successfully",
    });
  } catch (error) {
    console.error("Error sending test emails:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test emails",
      },
      { status: 500 }
    );
  }
}
