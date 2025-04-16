import { checkoutAction } from '@/lib/payments/actions';
import { getUser } from '@/lib/db/queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extraer los parámetros de la URL
  const searchParams = request.nextUrl.searchParams;
  const priceId = searchParams.get('priceId');
  const changePlan = searchParams.get('changePlan') === 'true';
  const currentPlan = searchParams.get('currentPlan') || '';
  
  if (!priceId) {
    return NextResponse.redirect(new URL('/dashboard/pricing?error=missing-price-id', request.url));
  }
  
  const user = await getUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login?redirect=/dashboard/pricing', request.url));
  }
  
  try {
    const checkoutResult = await checkoutAction(priceId, {
      changePlan,
      currentPlan
    });
    
    if (typeof checkoutResult === 'string') {
      return NextResponse.redirect(checkoutResult);
    } else if (checkoutResult.redirect) {
      return NextResponse.redirect(checkoutResult.redirect);
    } else if (checkoutResult.error) {
      console.error(`Error de checkout: ${checkoutResult.error}`);
      return NextResponse.redirect(new URL(`/dashboard/pricing?error=${checkoutResult.error}`, request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard/pricing?error=checkout-failed', request.url));
    }
  } catch (error) {
    console.error('Error iniciando checkout:', error);
    const errorMessage = error instanceof Error ? encodeURIComponent(error.message) : 'unknown-error';
    return NextResponse.redirect(new URL(`/dashboard/pricing?error=${errorMessage}`, request.url));
  }
} 