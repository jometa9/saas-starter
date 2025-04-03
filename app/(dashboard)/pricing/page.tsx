import { checkoutAction } from '@/lib/payments/actions';
import { Check, CreditCard, AlertTriangle } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { SubmitButton } from './submit-button';
import { redirect } from 'next/navigation';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const basePlan = products.find((product) => product.name === 'Base');
  const plusPlan = products.find((product) => product.name === 'Plus');

  const basePrice = prices.find((price) => price.productId === basePlan?.id);
  const plusPrice = prices.find((price) => price.productId === plusPlan?.id);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Select the subscription plan that best fits your needs. A subscription gives you full access to all features and the ability to manage your subscription through our customer portal.
        </p>
        
        {/* Alerta para usuarios redirigidos */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-lg mx-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                Subscription Required
              </h3>
              <div className="mt-2 text-sm text-orange-700">
                <p>
                  To access the Manage Subscription portal, you need an active subscription. 
                  Choose a plan below to get started.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
        <PricingCard
          name={basePlan?.name || 'Base'}
          price={basePrice?.unitAmount || 800}
          interval={basePrice?.interval || 'month'}
          trialDays={basePrice?.trialPeriodDays || 7}
          features={[
            'Unlimited Usage',
            'Unlimited Workspace Members',
            'Email Support',
          ]}
          priceId={basePrice?.id}
        />
        <PricingCard
          name={plusPlan?.name || 'Plus'}
          price={plusPrice?.unitAmount || 1200}
          interval={plusPrice?.interval || 'month'}
          trialDays={plusPrice?.trialPeriodDays || 7}
          features={[
            'Everything in Base, and:',
            'Early Access to New Features',
            '24/7 Support + Slack Access',
          ]}
          priceId={plusPrice?.id}
        />
      </div>
    </main>
  );
}

// Acción asíncrona para manejar el checkout directamente
async function handleSubscription(formData: FormData) {
  'use server';
  
  const priceId = formData.get('priceId') as string;
  if (!priceId) return { error: 'No price ID provided' };
  
  try {
    const result = await checkoutAction(priceId);
    
    // Si tenemos una URL de redirección, devolverla para que el cliente redirija
    if (result.redirect) {
      return { redirect: result.redirect };
    }
    
    // Si tenemos un error, devolverlo para manejo en el cliente
    if (result.error) {
      return { error: result.error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error en checkout:', error);
    return { error: 'error-inesperado' };
  }
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  priceId,
}: {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
  priceId?: string;
}) {
  return (
    <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-2xl font-medium text-gray-900 mb-2">{name}</h2>
      <p className="text-sm text-gray-600 mb-4">
        with {trialDays} day free trial
      </p>
      <p className="text-4xl font-medium text-gray-900 mb-6">
        ${price / 100}{' '}
        <span className="text-xl font-normal text-gray-600">
          per user / {interval}
        </span>
      </p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <form id="subscription-form">
        <input type="hidden" name="priceId" value={priceId} />
        <SubmitButton 
          className="w-full flex items-center justify-center"
          formAction={handleSubscription}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Subscribe Now
        </SubmitButton>
      </form>
    </div>
  );
}
