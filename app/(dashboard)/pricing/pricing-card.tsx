'use client';

import { Check, CreditCard } from 'lucide-react';
import { SubmitButton } from './submit-button';

export function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  priceId,
  annualPriceId,
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
  annualPriceId?: string;
  isLoggedIn: boolean;
  hasSubscription: boolean;
  isRecommended?: boolean;
}) {
  // Crear un ID único para el formulario basado en el nombre del plan
  const formId = `subscription-form-${name.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className={`p-6 border ${isRecommended ? 'border-black border-2' : 'border-gray-200'} rounded-lg shadow-sm hover:shadow-md transition-shadow relative ${isRecommended ? 'recommended' : ''}`}>
      {isRecommended && (
        <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold py-1 px-3 transform translate-x-2 -translate-y-2 rounded">
          RECOMMENDED
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900">{name}</h3>
      
      {/* Precio Mensual */}
      <div className="mt-4 flex items-baseline text-gray-900 billing-monthly">
        <span className="text-4xl font-extrabold tracking-tight">${price}</span>
        <span className="ml-1 text-xl font-semibold">/{interval}</span>
      </div>
      
      {/* Precio Anual (20% de descuento) */}
      <div className="mt-4 flex items-baseline text-gray-900 billing-annual hidden">
        <span className="text-4xl font-extrabold tracking-tight">${Math.floor(price * 0.8 * 12)}</span>
        <span className="ml-1 text-xl font-semibold">/year</span>
        <span className="ml-2 text-sm font-medium text-green-600">Save 20%</span>
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
          <div className="mt-8">
            <button disabled
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
            >
              Currently Subscribed
            </button>
          </div>
        ) : (
          <>
            {/* Formulario para suscripción mensual */}
            <form action="/api/checkout" method="POST" className="mt-8 billing-monthly">
              <input type="hidden" name="priceId" value={priceId} />
              <SubmitButton 
                className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${isRecommended ? 'bg-black hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Subscribe Monthly
              </SubmitButton>
            </form>
            
            {/* Formulario para suscripción anual */}
            <form action="/api/checkout" method="POST" className="mt-8 billing-annual hidden">
              <input type="hidden" name="priceId" value={annualPriceId} />
              <SubmitButton 
                className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${isRecommended ? 'bg-black hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Subscribe Annually
              </SubmitButton>
            </form>
          </>
        )
      ) : (
        <a href="/sign-in?redirect=/pricing" className="block w-full mt-8">
          <button
            className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${isRecommended ? 'bg-black hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Sign in to Subscribe
          </button>
        </a>
      )}
    </div>
  );
} 