'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { getUser } from '@/lib/db/queries';

export const checkoutAction = async (formData: FormData) => {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }
  
  try {
    const priceId = formData.get('priceId') as string;
    await createCheckoutSession({ user, priceId });
  } catch (error) {
    console.error('Error en checkoutAction:', error);
    redirect('/dashboard?error=payment-error');
  }
};

export const customerPortalAction = async () => {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }
  
  try {
    const session = await createCustomerPortalSession(user);
    redirect(session.url);
  } catch (error) {
    console.error('Error en customerPortalAction:', error);
    redirect('/dashboard?error=portal-access');
  }
};
