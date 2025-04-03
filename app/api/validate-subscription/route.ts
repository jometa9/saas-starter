import { NextRequest, NextResponse } from 'next/server';
import { getUserByApiKey } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  // Obtener apiKey del parámetro en la URL
  const searchParams = request.nextUrl.searchParams;
  const apiKey = searchParams.get('apiKey');
  
  // Si no hay apiKey en los parámetros
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is required as a URL parameter (apiKey=your_key)' },
      { status: 401 }
    );
  }
  
  try {
    // Buscar el usuario por su APIKey
    const user = await getUserByApiKey(apiKey);
    
    // Si no se encuentra el usuario con esa APIKey
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Comprobar el estado de la suscripción
    const isSubscriptionActive = user.subscriptionStatus === 'active' || 
                               user.subscriptionStatus === 'trialing';
    
    return NextResponse.json({
      userId: user.id,
      email: user.email,
      name: user.name,
      subscriptionStatus: user.subscriptionStatus,
      planName: user.planName,
      isActive: isSubscriptionActive,
    });
  } catch (error) {
    console.error('Error validating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 