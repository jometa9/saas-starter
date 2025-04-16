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
    
    // Imprimir los valores para debugging
    console.log('Actualizando usuario:', userId);
    console.log('Valor recibido server_ip:', body.server_ip);
    console.log('Campo en la base de datos: serverIP');

    try {
      // Realizar una sola actualización
      const result = await db.update(users)
        .set({
          serverIP: body.server_ip, // El campo en la base de datos se llama serverIP, pero estamos recibiendo server_ip
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      console.log('Resultado de la actualización:', result);

      // Retornar una respuesta informativa
      return NextResponse.json({ 
        success: true,
        message: 'User serverIP updated successfully',
        updatedValue: body.server_ip
      });
    } catch (updateError) {
      console.error('Error específico al actualizar serverIP:', updateError);
      throw updateError; // Re-lanzar para que lo maneje el catch externo
    }
  } catch (error) {
    console.error('Error updating user serverIP:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
} 