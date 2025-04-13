import { checkoutAction } from '@/lib/payments/actions';
import { Check, X } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/db/queries';
import { Button } from '@/components/ui/button';
import { PricingToggle } from './pricing-toggle';
import { PricingCard } from './pricing-card';
import { NextResponse } from 'next/server';

// Prices are fresh for one hour max
export const revalidate = 3600;

// API route para checkout
export async function POST(request: Request) {
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
    if (typeof checkoutUrl === 'string') {
      return NextResponse.redirect(new URL(checkoutUrl));
    } else if (checkoutUrl.redirect) {
      return NextResponse.redirect(new URL(checkoutUrl.redirect));
    } else {
      return NextResponse.json({ error: checkoutUrl.error || 'Unable to create checkout session' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error starting checkout:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}

export default async function PricingPage() {
  const [prices, products, user] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
    getUser(),
  ]);

  // IDs de los precios de los productos
  // Como respaldo, en caso de que no se encuentren los precios reales, usamos IDs de ejemplo
  const fallbackStandardPriceId = 'price_standard_monthly';
  const fallbackPremiumPriceId = 'price_premium_monthly';
  const fallbackManagedServicePriceId = 'price_managed_monthly';
  
  const fallbackStandardAnnualPriceId = 'price_standard_annual';
  const fallbackPremiumAnnualPriceId = 'price_premium_annual';
  const fallbackManagedServiceAnnualPriceId = 'price_managed_annual';

  // Buscar los productos y precios reales
  const standardProduct = products.find(p => p.name === 'Standard');
  const premiumProduct = products.find(p => p.name === 'Premium');
  const managedServiceProduct = products.find(p => p.name === 'Managed Service');

  // Encontrar los precios mensuales y anuales para cada producto
  const findPriceId = (productId: string | undefined, interval: 'month' | 'year') => {
    if (!productId) return undefined;
    return prices.find(p => 
      p.productId === productId && 
      p.interval === interval
    )?.id;
  };

  // Precios mensuales
  const standardMonthlyPriceId = findPriceId(standardProduct?.id, 'month');
  const premiumMonthlyPriceId = findPriceId(premiumProduct?.id, 'month');
  const managedServiceMonthlyPriceId = findPriceId(managedServiceProduct?.id, 'month');

  // Precios anuales
  const standardAnnualPriceId = findPriceId(standardProduct?.id, 'year');
  const premiumAnnualPriceId = findPriceId(premiumProduct?.id, 'year');
  const managedServiceAnnualPriceId = findPriceId(managedServiceProduct?.id, 'year');

  // Verificar si el usuario ya tiene una suscripción
  const hasSubscription = !!user?.stripeSubscriptionId &&
    (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing');

  return (
    <main className="container py-8 px-4 mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that fits your trading needs. All plans include 14-day free trial.
        </p>
        
        {hasSubscription && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 max-w-lg mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  You're Already Subscribed
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    You already have an active subscription. You can manage your subscription, change billing cycle (monthly/annual), or cancel it from your dashboard.
                  </p>
                  <Button
                    onClick={() => window.location.href = '/dashboard'}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Billing Toggle */}
      <div className="flex justify-center items-center my-8">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Monthly</span>
          <PricingToggle />
          <span className="text-sm font-medium">Annual <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Save 20%</span></span>
        </div>
      </div>
      
      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PricingCard
          name="Standard"
          price={20}
          interval="mo"
          trialDays={14}
          features={[
            "1 Master Account",
            "3 Slave Accounts",
            "Cross-platform support (MT4/MT5)",
            "Standard execution speed",
            "Symbol mapping",
            "Fixed lot sizing",
            "Community support"
          ]}
          priceId={standardMonthlyPriceId || fallbackStandardPriceId}
          annualPriceId={standardAnnualPriceId || fallbackStandardAnnualPriceId}
          isLoggedIn={!!user}
          hasSubscription={hasSubscription}
        />
        <PricingCard
          name="Premium"
          price={50}
          interval="mo"
          trialDays={14}
          features={[
            "5 Master Accounts",
            "10 Slave Accounts",
            "Full cross-platform support",
            "Ultra-low latency execution",
            "Advanced symbol mapping",
            "Percentage-based lot sizing",
            "Priority email support",
            "Trade notifications",
            "Automated retries"
          ]}
          priceId={premiumMonthlyPriceId || fallbackPremiumPriceId}
          annualPriceId={premiumAnnualPriceId || fallbackPremiumAnnualPriceId}
          isLoggedIn={!!user}
          hasSubscription={hasSubscription}
          isRecommended={true}
        />
        <PricingCard
          name="Managed Service"
          price={999}
          interval="mo"
          trialDays={14}
          features={[
            "Unlimited Master Accounts",
            "Unlimited Slave Accounts",
            "Full cross-platform support",
            "Ultra-low latency execution",
            "Advanced symbol mapping",
            "Custom formula lot sizing",
            "White-glove setup and config",
            "24/7 priority support",
            "Custom implementation",
            "Custom server architecture"
          ]}
          priceId={managedServiceMonthlyPriceId || fallbackManagedServicePriceId}
          annualPriceId={managedServiceAnnualPriceId || fallbackManagedServiceAnnualPriceId}
          isLoggedIn={!!user}
          hasSubscription={hasSubscription}
        />
      </div>
      
      {/* Full Feature Comparison Table */}
      <div className="mt-16">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Standard
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premium
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">
                  Managed Service
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <FeatureRow 
                feature="Master Accounts" 
                free="1" 
                base="5" 
                plus="Unlimited" 
              />
              <FeatureRow 
                feature="Slave Accounts" 
                free="3" 
                base="10" 
                plus="Unlimited" 
              />
              <FeatureRow 
                feature="Cross-Platform Support" 
                free={<Check className="mx-auto h-5 w-5 text-green-500" />} 
                base={<Check className="mx-auto h-5 w-5 text-green-500" />} 
                plus={<Check className="mx-auto h-5 w-5 text-green-500" />} 
              />
              <FeatureRow 
                feature="Execution Speed" 
                free="Standard (<50ms)" 
                base="Ultra-low (<10ms)" 
                plus="Ultra-low (<10ms)" 
              />
              <FeatureRow 
                feature="Symbol Mapping" 
                free="Basic" 
                base="Advanced" 
                plus="Advanced" 
              />
              <FeatureRow 
                feature="Lot Size Control" 
                free="Fixed" 
                base="Percentage" 
                plus="Custom Formula" 
              />
              <FeatureRow 
                feature="Trade Notifications" 
                free={<X className="mx-auto h-5 w-5 text-red-500" />} 
                base={<Check className="mx-auto h-5 w-5 text-green-500" />} 
                plus={<Check className="mx-auto h-5 w-5 text-green-500" />} 
              />
              <FeatureRow 
                feature="Automated Retries" 
                free={<X className="mx-auto h-5 w-5 text-red-500" />} 
                base={<Check className="mx-auto h-5 w-5 text-green-500" />} 
                plus={<Check className="mx-auto h-5 w-5 text-green-500" />} 
              />
              <FeatureRow 
                feature="Technical Support" 
                free="Community" 
                base="Priority Email" 
                plus="24/7 Dedicated" 
              />
              <FeatureRow 
                feature="Custom Implementation" 
                free={<X className="mx-auto h-5 w-5 text-red-500" />} 
                base={<X className="mx-auto h-5 w-5 text-red-500" />} 
                plus={<Check className="mx-auto h-5 w-5 text-green-500" />} 
              />
              <FeatureRow 
                feature="White-glove Setup" 
                free={<X className="mx-auto h-5 w-5 text-red-500" />} 
                base={<X className="mx-auto h-5 w-5 text-red-500" />} 
                plus={<Check className="mx-auto h-5 w-5 text-green-500" />} 
              />
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function FeatureRow({ 
  feature, 
  free, 
  base, 
  plus 
}: { 
  feature: string; 
  free: React.ReactNode; 
  base: React.ReactNode; 
  plus: React.ReactNode; 
}) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
        {feature}
      </td>
      <td className="px-6 py-4 whitespace-normal text-sm text-center text-gray-500">
        {free}
      </td>
      <td className="px-6 py-4 whitespace-normal text-sm text-center text-gray-500">
        {base}
      </td>
      <td className="px-6 py-4 whitespace-normal text-sm text-center text-gray-500 bg-gray-50">
        {plus}
      </td>
    </tr>
  );
}
