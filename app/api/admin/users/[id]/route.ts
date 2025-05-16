import { NextRequest, NextResponse } from 'next/server';
import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';
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
    
    // Imprimir los valores para debugging
    
    
    

    try {
      // Realizar una sola actualización
      const result = await db.update(user)
        .set({
          serverIP: body.serverIP, // Corregido para usar el mismo nombre de propiedad que envía el cliente
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId));

      

      // Retornar una respuesta informativa
      return NextResponse.json({ 
        success: true,
        message: 'User serverIP updated successfully',
        updatedValue: body.serverIP
      });
    } catch (updateError) {
      
      throw updateError; // Re-lanzar para que lo maneje el catch externo
    }
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
} 