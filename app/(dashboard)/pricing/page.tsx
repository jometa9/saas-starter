import { checkoutAction } from '@/lib/payments/actions';
import { Check, CreditCard, AlertTriangle, X } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { SubmitButton } from './submit-button';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/db/queries';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products, user] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
    getUser(),
  ]);

  const basePlan = products.find((product) => product.name === 'Base');
  const plusPlan = products.find((product) => product.name === 'Plus');

  const basePrice = prices.find((price) => price.productId === basePlan?.id);
  const plusPrice = prices.find((price) => price.productId === plusPlan?.id);

  const isLoggedIn = !!user;
  const hasSubscription = !!(user?.stripeSubscriptionId && 
    (user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trialing'));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Select the subscription plan that best fits your needs. All plans include a 14-day free trial.
        </p>
        
        {/* Alertas condicionales */}
        {!isLoggedIn && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Sign Up Required
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    You need to create an account or sign in before subscribing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
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
                    You already have an active subscription. You can manage your subscription from your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <PricingCard
          name="Basic"
          price={0}
          interval="mo"
          trialDays={0}
          features={[
            "1 Master Account",
            "2 Slave Accounts",
            "Cross-platform support (MT4/MT5)",
            "Standard execution speed",
            "Basic symbol mapping",
            "Fixed lot sizing",
            "Community support"
          ]}
          isLoggedIn={!!user}
          hasSubscription={hasSubscription}
        />
        <PricingCard
          name="Trader"
          price={29}
          interval="mo"
          trialDays={14}
          features={[
            "3 Master Accounts",
            "5 Slave Accounts",
            "Full cross-platform support",
            "Standard execution speed",
            "Advanced symbol mapping",
            "Percentage-based lot sizing",
            "Email support",
            "Trade notifications",
            "Automated retries"
          ]}
          priceId="price_trader"
          isLoggedIn={!!user}
          hasSubscription={hasSubscription}
          isRecommended={true}
        />
        <PricingCard
          name="Professional"
          price={79}
          interval="mo"
          trialDays={14}
          features={[
            "Unlimited Master Accounts",
            "Unlimited Slave Accounts",
            "Full cross-platform support",
            "Ultra-low latency execution",
            "Advanced symbol mapping",
            "Custom formula lot sizing",
            "Priority 24/7 support",
            "Custom order type filtering",
            "Trading hours filter"
          ]}
          priceId="price_professional"
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
                  Basic
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Trader
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">
                  Professional
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <FeatureRow 
                feature="Master Accounts" 
                free="1" 
                base="3" 
                plus="Unlimited" 
              />
              <FeatureRow 
                feature="Slave Accounts" 
                free="2" 
                base="5" 
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
                base="Standard (<50ms)" 
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
                feature="Order Type Filtering" 
                free="Basic" 
                base="Advanced" 
                plus="Custom Rules" 
              />
              <FeatureRow 
                feature="Trading Hours Filter" 
                free={<X className="mx-auto h-5 w-5 text-red-500" />} 
                base={<Check className="mx-auto h-5 w-5 text-green-500" />} 
                plus={<Check className="mx-auto h-5 w-5 text-green-500" />} 
              />
              <FeatureRow 
                feature="Technical Support" 
                free="Community" 
                base="Email" 
                plus="Priority 24/7" 
              />
            </tbody>
          </table>
        </div>
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
  isLoggedIn,
  hasSubscription,
  isRecommended = false,
}: {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
  priceId?: string;
  isLoggedIn: boolean;
  hasSubscription: boolean;
  isRecommended?: boolean;
}) {
  return (
    <div className={`p-6 border ${isRecommended ? 'border-black border-2' : 'border-gray-200'} rounded-lg shadow-sm hover:shadow-md transition-shadow relative`}>
      {isRecommended && (
        <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold py-1 px-3 transform translate-x-2 -translate-y-2 rounded">
          RECOMMENDED
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900">{name}</h3>
      <div className="mt-4 flex items-baseline text-gray-900">
        <span className="text-4xl font-extrabold tracking-tight">${price}</span>
        <span className="ml-1 text-xl font-semibold">/{interval}</span>
      </div>
      {trialDays > 0 && (
        <p className="mt-2 text-sm text-gray-500">
          {trialDays}-day free trial of IPTRADE {name}
        </p>
      )}
      <ul className="mt-6 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-black mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      {isLoggedIn ? (
        hasSubscription ? (
          <form id="subscription-form" className="mt-8">
            <input type="hidden" name="priceId" value={priceId} />
            <SubmitButton 
              className={`w-full flex items-center justify-center ${isRecommended ? 'bg-black hover:bg-gray-800' : ''}`}
              formAction={handleSubscription}
            >
              Currently Subscribed
            </SubmitButton>
          </form>
        ) : (
          <form id="subscription-form" className="mt-8">
            <input type="hidden" name="priceId" value={priceId} />
            <SubmitButton 
              className={`w-full flex items-center justify-center ${isRecommended ? 'bg-black hover:bg-gray-800' : ''}`}
              formAction={handleSubscription}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Subscribe Now
            </SubmitButton>
          </form>
        )
      ) : (
        <a href="/sign-in?redirect=/pricing" className="block w-full">
          <button
            className={`w-full flex items-center justify-center bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md ${isRecommended ? 'bg-black hover:bg-gray-800' : ''}`}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Sign in to Subscribe
          </button>
        </a>
      )}
    </div>
  );
}

function FeatureRow({ feature, free, base, plus }: { 
  feature: string; 
  free: string | React.ReactNode; 
  base: string | React.ReactNode; 
  plus: string | React.ReactNode; 
}) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {feature}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
        {free}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center bg-gray-50">
        {base}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center bg-gray-100">
        {plus}
      </td>
    </tr>
  );
}
