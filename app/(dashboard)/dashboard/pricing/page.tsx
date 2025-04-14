"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check, Zap } from "lucide-react";
import { PricingToggle } from "@/components/pricing-toggle";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";
import { User } from "@/lib/db/schema";
import { PlansComparisonTable } from "@/components/plans-comparison-table";

export default function PricingPage() {
  const router = useRouter();
  const { userPromise } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userPromise && typeof userPromise === 'object') {
          const userData = await userPromise;
          setUser(userData);
          
          // Establecer el plan actual y estado de suscripción
          if (userData?.planName) {
            setCurrentPlan(userData.planName);
          }
          
          // Verificar si tiene suscripción activa
          if (userData?.subscriptionStatus === 'active' || 
              userData?.subscriptionStatus === 'trialing') {
            setHasActiveSubscription(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userPromise]);

  // Handle billing period and redirects
  useEffect(() => {
    // Only run this effect when loading is complete
    if (!isLoading) {
      // Redirect to login if user is not authenticated
      if (!user) {
        router.push(`/login?callbackUrl=${encodeURIComponent("/dashboard/pricing")}`);
        return;
      }

      // Check if billing period is stored in body data attribute
      const billingPeriod = document.body.getAttribute("data-billing-period");
      setIsAnnual(billingPeriod === "annual");

      // Initialize billing period if not set
      if (!billingPeriod) {
        document.body.setAttribute("data-billing-period", "monthly");
      }
    }
  }, [user, isLoading, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <p>Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  // If user is redirecting, show minimal content
  if (!user) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Función para obtener el texto del botón según el plan
  const getButtonText = (planName: string) => {
    // Para el plan Free, siempre mostrar "Start Now"
    if (planName === "Free") {
      return "Start Now";
    }
    
    // Si ya tiene este plan exacto, mostrar "Current Plan"
    if (currentPlan && currentPlan.includes(planName)) {
      return "Current";
    }
    
    // Para los demás planes de pago
    return "Change Plan";
  };

  // Función para verificar si un botón debe estar deshabilitado
  const isButtonDisabled = (planName: string) => {
    // Si está procesando, solo deshabilitar el plan seleccionado
    if (isCheckoutLoading) {
      return selectedPlan === planName.toLowerCase();
    }
    
    // Para el plan Free
    if (planName === "Free") {
      // Deshabilitar si tiene una suscripción de pago (plan diferente a Free)
      return currentPlan !== null && currentPlan !== "Free";
    }
    
    // Si ya tiene este plan, deshabilitar el botón
    if (currentPlan && currentPlan.includes(planName)) {
      return true;
    }
    
    return false;
  };

  const handleCheckout = async (plan: string, priceId: string | undefined) => {
    try {
      setIsCheckoutLoading(true);
      setSelectedPlan(plan.toLowerCase());
      
      if (!priceId) {
        toast({
          title: "Configuration Error",
          description: "The selected plan is not available. Please contact support.",
          variant: "destructive",
        });
        setIsCheckoutLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("priceId", priceId);
      
      // Si ya tiene una suscripción activa, indicar que es un cambio de plan
      if (hasActiveSubscription) {
        formData.append("changePlan", "true");
        formData.append("currentPlan", currentPlan || "");
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to start checkout process");
      }

      // If response is ok and it's a redirect, follow it
      const responseUrl = response.url;
      if (responseUrl) {
        window.location.href = responseUrl;
      } else {
        throw new Error("No redirect URL received from checkout");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      setIsCheckoutLoading(false);
    }
  };

  // Precios y IDs de Stripe
  const PREMIUM_MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID;
  const PREMIUM_ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID;
  const UNLIMITED_MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_UNLIMITED_MONTHLY_PRICE_ID;
  const UNLIMITED_ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_UNLIMITED_ANNUAL_PRICE_ID;
  const MANAGED_VPS_MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MANAGED_VPS_MONTHLY_PRICE_ID;
  const MANAGED_VPS_ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MANAGED_VPS_ANNUAL_PRICE_ID;

  return (
    <div className="py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold" id="prices">Subscription Plans</h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
          Choose the plan that fits your trading needs
        </p>
        
        {/* Billing Toggle */}
        <div className="flex justify-center items-center my-4">
          <PricingToggle />
        </div>
      </div>

      {currentPlan && currentPlan !== "Free" && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-800">
            You currently have the <strong>{currentPlan}</strong> plan. 
            Changing your plan will cancel your current subscription at the end of the billing period 
            and create a new subscription.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" >
        {/* Free Plan */}
        <div className="lg:col-span-3 border border-gray-200 rounded-2xl shadow-lg bg-white p-8">
          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Free</h3>
              <p className="mt-4 text-gray-600">
                Perfect for getting started with trade copying
              </p>
              <div className="mt-6 billing-monthly">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-xl text-gray-500">/month</span>
              </div>
              <div className="mt-6 billing-annual hidden">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-xl text-gray-500">/year</span>
              </div>
            </div>

            <div className="mt-6 flex-grow">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Single master account
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Unlimited accounts
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Fixed lot size (0.01)
                  </p>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Button
                variant="outline"
                className="w-full py-6 text-lg border-black text-black hover:bg-black/5 cursor-pointer"
                disabled={isButtonDisabled("Free")}
              >
                {getButtonText("Free")}
              </Button>
            </div>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="lg:col-span-3 border-2 border-green-700 rounded-2xl shadow-xl bg-white p-8 relative">
          <div className="absolute top-0 right-6 -translate-y-1/2">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">
              MOST POPULAR
            </span>
          </div>

          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Premium</h3>
              <p className="mt-4 text-gray-600">
                Advanced features for serious traders
              </p>
              <p className="mt-2 text-center text-xs font-medium text-green-600 billing-annual">
                Save $48
              </p>
              <div className="billing-monthly mt-6">
                <span className="text-4xl font-bold text-gray-900">
                  $20
                </span>
                <span className="text-xl text-gray-500">/month</span>
              </div>

              <div className="billing-annual hidden">
                <span className="text-4xl font-bold text-gray-900">
                  $192
                </span>
                <span className="text-xl text-gray-500">/year</span>
              </div>
            </div>

            <div className="mt-6 flex-grow">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Customizable lot sizes
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Up to 10 total accounts (master and slave)
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Single IP for all accounts
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Priority support
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Advanced risk management
                  </p>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Button
                className={`w-full py-6 text-lg ${
                  currentPlan && currentPlan.includes("Premium") 
                    ? "bg-gray-500 hover:bg-gray-600" 
                    : "bg-green-700 hover:bg-green-800"
                } text-white cursor-pointer`}
                onClick={() => handleCheckout("Premium", isAnnual ? PREMIUM_ANNUAL_PRICE_ID : PREMIUM_MONTHLY_PRICE_ID)}
                disabled={isButtonDisabled("Premium")}
              >
                {isCheckoutLoading && selectedPlan === "premium" ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Processing...
                  </>
                ) : (
                  getButtonText("Premium")
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Unlimited Plan */}
        <div className="lg:col-span-3 border-2 border-blue-500 rounded-2xl shadow-xl bg-white p-8 relative">
          <div className="absolute top-0 right-6 -translate-y-1/2">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
              UNLIMITED ACCOUNTS
            </span>
          </div>

          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Unlimited
              </h3>
              <p className="mt-4 text-gray-600">
                No limits on connected accounts
              </p>
              <p className="mt-2 text-center text-xs font-medium text-blue-600 billing-annual">
                Save $120
              </p>
              <div className="mt-6 billing-monthly">
                <span className="text-4xl font-bold text-gray-900">
                  $50
                </span>
                <span className="text-xl text-gray-500">/month</span>
              </div>

              <div className="billing-annual hidden">
                <span className="text-4xl font-bold text-gray-900">
                  $480
                </span>
                <span className="text-xl text-gray-500">/year</span>
              </div>
            </div>

            <div className="mt-6 flex-grow">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    All Premium features
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Unlimited slave accounts
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Multiple master accounts
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Single IP for all accounts
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    24/7 Priority support
                  </p>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Button
                className={`w-full py-6 text-lg ${
                  currentPlan && currentPlan.includes("Unlimited") 
                    ? "bg-gray-500 hover:bg-gray-600" 
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white cursor-pointer`}
                onClick={() => handleCheckout("Unlimited", isAnnual ? UNLIMITED_ANNUAL_PRICE_ID : UNLIMITED_MONTHLY_PRICE_ID)}
                disabled={isButtonDisabled("Unlimited")}
              >
                {isCheckoutLoading && selectedPlan === "unlimited" ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Processing...
                  </>
                ) : (
                  getButtonText("Unlimited")
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Managed VPS Plan */}
        <div className="lg:col-span-3 border-2 border-purple-500 rounded-2xl shadow-xl bg-white p-8 relative">
          <div className="absolute top-0 right-6 -translate-y-1/2">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100">
              MANAGED SERVICE
            </span>
          </div>

          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Managed VPS
              </h3>
              <p className="mt-4 text-gray-600">
                Fully managed trade copying service
              </p>

              <p className="mt-2 text-center text-xs font-medium text-purple-600 billing-annual">
                Save $2,398
              </p>
              <div className="mt-6 billing-monthly">
                <span className="text-4xl font-bold text-gray-900">
                  $999
                </span>
                <span className="text-xl text-gray-500">/month</span>
              </div>

              <div className="billing-annual hidden">
                <span className="text-4xl font-bold text-gray-900">
                  $9,590
                </span>
                <span className="text-xl text-gray-500">/year</span>
              </div>
            </div>

            <div className="mt-6 flex-grow">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    All Premium features
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Dedicated VPS server
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Single IP for all accounts
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Up to 50 slave accounts
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    24/7 server monitoring
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="ml-3 text-base text-gray-700 text-sm">
                    Full setup & configuration
                  </p>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Button
                className={`w-full py-6 text-lg ${
                  currentPlan && currentPlan.includes("Managed VPS") 
                    ? "bg-gray-500 hover:bg-gray-600" 
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white cursor-pointer`}
                onClick={() => handleCheckout("Managed VPS", isAnnual ? MANAGED_VPS_ANNUAL_PRICE_ID : MANAGED_VPS_MONTHLY_PRICE_ID)}
                disabled={isButtonDisabled("Managed VPS")}
              >
                {isCheckoutLoading && selectedPlan === "managed vps" ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Processing...
                  </>
                ) : (
                  getButtonText("Managed VPS")
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="text-sm text-gray-500">
          Questions? Contact our support team at support@iptrade.com
        </p>
      </div>

      {/* Tabla comparativa detallada */}
      <div className="mt-10 pt-8 border-t border-gray-200 mx-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Detailed Plan Comparison</h2>
          <p className="mt-3 max-w-2xl mx-auto text-gray-600">
            Compare all features available in each plan
          </p>
        </div>
        
      </div>
        <PlansComparisonTable />

        <section className="pt-24 py-12">
        <div className="px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Ready to <span className="text-black">revolutionize</span> your
              trading?
            </h2>
            <p className="mt-6 text-xl text-gray-600 ">
              Join thousands of traders who trust IPTRADE for lightning-fast
              trade copying between platforms. Perfect for prop firm traders who
              need to maintain compliance while maximizing efficiency.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a href="/sign-in">
                <Button className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border border-blue-600 rounded-full text-lg px-8 py-6 inline-flex items-center justify-center shadow-xl transition-all duration-300 hover:shadow-xl cursor-pointer border-2">
                  Start now
                  <Zap className="ml-3 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 