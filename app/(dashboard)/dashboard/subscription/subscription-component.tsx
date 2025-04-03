'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';
import { customerPortalAction } from '@/lib/payments/actions';
import { toast } from '@/components/ui/use-toast';
import { CalendarDays, CreditCard, CheckCircle, XCircle, Clock, AlertCircle, Info, TrendingUp, Award, Shield, Zap } from 'lucide-react';

export function Subscription({ user, currentVersion }: { user: User; currentVersion: string }) {
  const router = useRouter();

  // Función para acceder al portal de cliente de Stripe
  const handleCustomerPortal = async () => {
    try {
      // Mostrar mensaje de espera mientras se procesa
      toast({
        title: "Processing...",
        description: "Preparing the management portal...",
      });
      
      // Intentar acceder al portal de cliente
      const result = await customerPortalAction();
      
      if (result?.error) {
        // Si hay un error, mostrar el mensaje adecuado
        console.error('Error accessing portal:', result.error);
        let errorMessage = "Could not access the management portal.";
        
        // Mapear códigos de error a mensajes más descriptivos
        switch (result.error) {
          case 'no-customer-id':
            errorMessage = "You don't have a customer profile set up. Contact support.";
            break;
          case 'no-active-subscription':
            errorMessage = "You don't have an active subscription or trial period. You need to subscribe first.";
            break;
          case 'no-product-id':
            errorMessage = "Your subscription doesn't have an assigned product. Contact support.";
            break;
          case 'stripe-api-key':
            errorMessage = "Stripe configuration error. Contact the administrator.";
            break;
          case 'portal-config':
            errorMessage = "Portal configuration error. Contact support.";
            break;
          case 'invalid-customer':
            errorMessage = "Your customer profile is invalid. Contact support.";
            break;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        
        return;
      }
      
      if (result?.redirect) {
        // Si se obtiene una URL de redirección, navegar a ella
        window.location.href = result.redirect;
      } else {
        // Si no hay redirección pero tampoco error, usar modo de simulación
        toast({
          title: "Simulation",
          description: "Redirecting to simulated mode due to environment limitations.",
        });
        setTimeout(() => {
          window.location.href = "/dashboard?success=portal-simulated";
        }, 1500);
      }
    } catch (error) {
      console.error('Error accessing portal:', error);
      // Mostrar mensaje de error más descriptivo
      toast({
        title: "Could not access portal",
        description: "An error occurred when attempting to access the management portal. Your subscription is still active.",
        variant: "destructive"
      });
    }
  };

  // Función para ir a la página de precios para cambiar de plan
  const goToPricing = () => {
    router.push('/pricing');
  };

  // Obtener el estado de la suscripción en formato legible
  const getSubscriptionStatusText = () => {
    switch (user.subscriptionStatus) {
      case 'active':
        return 'Active subscription';
      case 'trialing':
        return 'Trial period';
      case 'canceled':
        return 'Subscription canceled';
      case 'past_due':
        return 'Payment pending';
      case 'unpaid':
        return 'Subscription unpaid';
      case 'incomplete':
        return 'Subscription incomplete';
      default:
        return 'No active subscription';
    }
  };

  // Obtener color del estado de la suscripción
  const getSubscriptionStatusColor = () => {
    switch (user.subscriptionStatus) {
      case 'active':
        return 'text-green-600';
      case 'trialing':
        return 'text-blue-600';
      case 'canceled':
        return 'text-red-600';
      case 'past_due':
        return 'text-amber-600';
      case 'unpaid':
        return 'text-red-600';
      case 'incomplete':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  // Obtener el icono del estado de la suscripción
  const getSubscriptionStatusIcon = () => {
    switch (user.subscriptionStatus) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'trialing':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'canceled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'past_due':
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      case 'unpaid':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'incomplete':
        return <Info className="h-5 w-5 text-amber-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">Subscription & Billing</h1>
      
      {/* Resumen de suscripción */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium mb-2">{user.planName || 'Free Plan'}</h3>
              <div className="flex items-center space-x-2 mb-4">
                {getSubscriptionStatusIcon()}
                <span className={`font-medium ${getSubscriptionStatusColor()}`}>
                  {getSubscriptionStatusText()}
                </span>
              </div>
              
              {user.stripeSubscriptionId && (
                <div className="space-y-2 text-sm mb-6">
                  <div className="flex items-start">
                    <CreditCard className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Subscription ID:</p>
                      <p className="font-mono text-xs">{user.stripeSubscriptionId}</p>
                    </div>
                  </div>
                  {user.currentPeriodEnd && (
                    <div className="flex items-start">
                      <CalendarDays className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Next billing date:</p>
                        <p>{new Date(user.currentPeriodEnd).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Botones de acción para la suscripción */}
              <div className="space-y-3 mt-6">
                {user.stripeSubscriptionId ? (
                  <Button 
                    onClick={handleCustomerPortal}
                    className="w-full"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Subscription
                  </Button>
                ) : (
                  <Button 
                    onClick={goToPricing} 
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Subscribe Now
                  </Button>
                )}
                
                {user.stripeSubscriptionId && (
                  <Button 
                    variant="outline" 
                    onClick={goToPricing}
                    className="w-full"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Change Plan
                  </Button>
                )}
              </div>
            </div>
            
            <div className="border-t md:border-l md:border-t-0 pt-6 md:pt-0 md:pl-8 border-gray-200">
              <h3 className="text-lg font-medium mb-4">Plan Features</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <Zap className="h-5 w-5 mr-3 text-black flex-shrink-0" />
                  <div>
                    <p className="font-medium">Performance</p>
                    <p className="text-sm text-muted-foreground">
                      {user.planName === 'Premium' 
                        ? 'Advanced processing capabilities with unlimited usage'
                        : 'Standard processing with usage limits'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Shield className="h-5 w-5 mr-3 text-black flex-shrink-0" />
                  <div>
                    <p className="font-medium">Security</p>
                    <p className="text-sm text-muted-foreground">
                      {user.planName === 'Premium' 
                        ? 'Enhanced security features and priority support'
                        : 'Standard security features'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Award className="h-5 w-5 mr-3 text-black flex-shrink-0" />
                  <div>
                    <p className="font-medium">Support</p>
                    <p className="text-sm text-muted-foreground">
                      {user.planName === 'Premium' 
                        ? 'Priority support with 24/7 assistance'
                        : 'Email support with standard response time'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="ghost" size="sm" onClick={goToPricing} className="text-black hover:text-gray-700 hover:bg-gray-50">
                  View all plan features
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Historial de pagos */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {user.stripeSubscriptionId ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                View your complete payment history and download invoices from the Stripe customer portal.
              </p>
              <Button 
                variant="outline" 
                onClick={handleCustomerPortal}
              >
                View Payment History
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              You don't have any payment history yet. Subscribe to a plan to see your payment history.
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Opciones de facturación */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Options</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Manage your billing information and payment methods from the Stripe customer portal.
          </p>
          
          {user.stripeSubscriptionId ? (
            <Button 
              variant="outline" 
              onClick={handleCustomerPortal}
            >
              Manage Billing Info
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              You'll be able to manage your billing information after subscribing to a plan.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
} 