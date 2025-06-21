import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "../../../../../lib/db/drizzle";
import { getUser } from "../../../../../lib/db/queries";
import { tradingAccounts } from "../../../../../lib/db/schema";

// Esquema para validar la solicitud
const updateStatusSchema = z.object({
  status: z.enum(["synchronized", "pending", "error", "offline"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación y permisos
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "No estás autenticado" },
        { status: 401 }
      );
    }

    // Verificar si el usuario es administrador
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "No tienes permiso para realizar esta acción" },
        { status: 403 }
      );
    }

    // Obtener y validar los datos
    const data = await req.json();
    const validated = updateStatusSchema.safeParse(data);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { status } = validated.data;

    // Obtener el ID y convertir a número
    const { id } = await params;
    const accountId = parseInt(id, 10);

    if (isNaN(accountId)) {
      return NextResponse.json(
        { error: "Invalid account ID" },
        { status: 400 }
      );
    }

    // Actualizar el estado de la cuenta
    await db
      .update(tradingAccounts)
      .set({ status, updatedAt: new Date() })
      .where(eq(tradingAccounts.id, accountId));

    return NextResponse.json(
      { message: "Account status updated successfully", status },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
