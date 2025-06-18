"use server";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { getUserById } from "@/lib/db/queries";
import { db } from "@/lib/db/drizzle";
import { user } from "@/lib/db/schema";
import { isNull } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    // Verify authentication using the same method as admin pages
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the complete user from the database
    const currentUser = await getUserById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Verify admin permissions
    if (currentUser.role !== "admin" && currentUser.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Obtener los datos de la solicitud
    const data = await req.json();
    const { subject, message, isImportant = false } = data;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    // Consulta simple para obtener todos los usuarios activos
    const usersList = await db
      .select()
      .from(user)
      .where(isNull(user.deletedAt));

    if (usersList.length === 0) {
      return NextResponse.json(
        {
          warning: true,
          message: "No users found in the database",
        },
        { status: 200 }
      );
    }

    const { sendBroadcastEmail } = await import("@/lib/email");

    // Preparar para envío en lotes de 10 emails a la vez para no sobrecargar el servidor
    const batchSize = 10;
    let successCount = 0;
    let failedEmails: string[] = [];

    for (let i = 0; i < usersList.length; i += batchSize) {
      const batch = usersList.slice(i, i + batchSize);

      // Procesar cada lote en paralelo
      const results = await Promise.allSettled(
        batch.map((user) => {
          return sendBroadcastEmail({
            email: user.email,
            name: user.name || user.email.split("@")[0],
            subject,
            message,
            isImportant,
          });
        })
      );

      // Contar éxitos y fallos
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          successCount++;
        } else {
          failedEmails.push(batch[index].email);
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Emails sent successfully to ${successCount} out of ${usersList.length} users`,
      stats: {
        total: usersList.length,
        success: successCount,
        failed: failedEmails.length,
        failedEmails: failedEmails.length > 0 ? failedEmails : undefined,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send mass email" },
      { status: 500 }
    );
  }
}
