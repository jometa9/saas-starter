import { checkoutAction } from '@/lib/payments/actions';
import { getUser } from '@/lib/db/queries';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const priceId = formData.get('priceId') as string;
  const changePlan = formData.get('changePlan') === 'true';
  const currentPlan = formData.get('currentPlan') as string;
  
  if (!priceId) {
    return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
  }
  
  const user = await getUser();
  if (!user) {
    // Redirect to login page if user is not authenticated
    const loginUrl = new URL('/login?redirect=/dashboard/pricing', request.url);
    return NextResponse.redirect(loginUrl, { status: 307 });
  }
  
  try {
    const checkoutResult = await checkoutAction(priceId, {
      changePlan,
      currentPlan
    });
    
    if (typeof checkoutResult === 'string') {
      const redirectUrl = new URL(checkoutResult, request.url);
      return NextResponse.redirect(redirectUrl, { status: 307 });
    } else if (checkoutResult.redirect) {
      const redirectUrl = new URL(checkoutResult.redirect, request.url);
      return NextResponse.redirect(redirectUrl, { status: 307 });
    } else if (checkoutResult.error) {
      
      return NextResponse.json({ error: checkoutResult.error }, { status: 400 });
    } else {
      return NextResponse.json({ error: 'Unable to create checkout session' }, { status: 500 });
    }
  } catch (error) {
    
    return NextResponse.json({ 
      error: 'Checkout failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 