import { NextRequest, NextResponse } from "next/server";
import { tradingAccounts } from "../../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "../../../../../lib/db/queries";
import { z } from "zod";
import { db } from "../../../../../lib/db/drizzle";

// Esquema para validar la solicitud
const updateStatusSchema = z.object({
  status: z.enum(["synchronized", "pending", "error", "offline"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
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

    // Convertir params.id a número directamente
    const accountId = parseInt(params.id, 10);

    if (isNaN(accountId)) {
      return NextResponse.json(
        { error: "ID de cuenta inválido" },
        { status: 400 }
      );
    }

    // Actualizar el estado de la cuenta
    await db
      .update(tradingAccounts)
      .set({ status, updatedAt: new Date() })
      .where(eq(tradingAccounts.id, accountId));

    return NextResponse.json(
      { message: "Estado de cuenta actualizado correctamente", status },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar el estado de la cuenta:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
