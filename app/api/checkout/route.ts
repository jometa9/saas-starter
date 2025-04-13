import { checkoutAction } from '@/lib/payments/actions';
import { getUser } from '@/lib/db/queries';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const priceId = formData.get('priceId') as string;
  
  if (!priceId) {
    return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
  }
  
  const user = await getUser();
  if (!user) {
    // Redirigir a la página de inicio de sesión si no hay usuario
    return NextResponse.redirect(new URL('/sign-in?redirect=/pricing', request.url));
  }
  
  try {
    const checkoutUrl = await checkoutAction(priceId);
    return NextResponse.redirect(checkoutUrl);
  } catch (error) {
    console.error('Error starting checkout:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
} 