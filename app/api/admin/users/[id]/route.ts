import { NextRequest, NextResponse } from 'next/server';
import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación del usuario
    const { session, user } = await getUserAuth();
    
    if (!session || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verificar que el usuario es administrador
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Obtener el ID del usuario a actualizar
    const userId = parseInt(params.id);
    
    // Validar que el ID sea un número
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Obtener los datos a actualizar del cuerpo de la solicitud
    const body = await request.json();
    
    // Actualizar el usuario en la base de datos
    await db.update(users)
      .set({
        serverIP: body.server_ip,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user serverIP:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
} 