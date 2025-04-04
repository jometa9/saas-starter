'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';
import { customerPortalAction } from '@/lib/payments/actions';
import { toast } from '@/components/ui/use-toast';
import { CalendarDays, CreditCard, CheckCircle, XCircle, Clock, AlertCircle, Info, TrendingUp, Award, Shield, Zap, ArrowUpRight, Download, BookOpen, LifeBuoy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { CircleCheckIcon } from '@/components/icons/circle-check';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export function Subscription({ user, currentVersion }: { user: User; currentVersion: string }) {
  const router = useRouter();
  const [showLicense, setShowLicense] = useState(false);
  const licenseKey = user?.stripeSubscriptionId 
    ? `IP-${user.stripeCustomerId ? String(user.stripeCustomerId).substring(0, 8) : 'NOID'}-${user.id ? String(user.id).substring(0, 6) : 'NOID'}` 
    : 'No active license';
  const isLatestVersion = true; // Simulating this is the latest version

  const toggleLicenseVisibility = () => {
    setShowLicense(prev => !prev);
  };

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
    if (!user.subscriptionStatus) return 'Inactive';
    
    switch (user.subscriptionStatus) {
      case 'active': return 'Active';
      case 'trialing': return 'Trial';
      case 'canceled': return 'Canceled';
      case 'past_due': return 'Past Due';
      case 'unpaid': return 'Unpaid';
      default: return user.subscriptionStatus;
    }
  };

  // Obtener color del estado de la suscripción
  const getSubscriptionStatusColor = () => {
    if (!user.subscriptionStatus) return 'bg-gray-100 text-gray-800';
    
    switch (user.subscriptionStatus) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      case 'unpaid': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener el icono del estado de la suscripción
  const getSubscriptionStatusIcon = () => {
    if (!user.subscriptionStatus) return <AlertCircle className="h-5 w-5 text-gray-500" />;
    
    switch (user.subscriptionStatus) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'trialing': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'canceled': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'past_due': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'unpaid': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
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
                        <p>{new Date(user.currentPeriodEnd as any).toLocaleDateString()}</p>
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

      <div className="grid gap-6">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold leading-none tracking-tight">
                  IPTRADE License
                </h2>
                <p className="text-sm text-muted-foreground">
                  Copy trades between MetaTrader platforms with the same IP address
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSubscriptionStatusColor()}`}>
                  {getSubscriptionStatusText()}
                </div>
                {getSubscriptionStatusIcon()}
              </div>
            </div>
            <div className="flex flex-col w-full gap-2">
              <Label>Your License Key</Label>
              <div className="flex h-10">
                <Input
                  className="rounded-r-none font-mono text-xs h-10 bg-muted"
                  value={licenseKey}
                  readOnly
                  type={showLicense ? 'text' : 'password'}
                />
                <Button
                  variant="outline"
                  className="rounded-l-none border-l-0 h-10 flex items-center"
                  onClick={toggleLicenseVisibility}
                >
                  {showLicense ? 'Hide' : 'Show'}
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {user.subscriptionStatus === 'active' ? (
                  <div>
                    <p>This license key allows you to activate the IPTRADE software on your computer.</p>
                    <p className="mt-1">Current Plan: <span className="font-semibold">{user.planName || 'Basic'}</span></p>
                  </div>
                ) : (
                  <p>Subscribe to get your license key and access premium features.</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-black" />
                    <CardTitle className="text-base font-medium">Account Limits</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Master Accounts:</span>
                      <span className="font-medium">
                        {user.planName === 'Professional' ? 'Unlimited' : user.planName === 'Trader' ? '3' : '1'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Slave Accounts:</span>
                      <span className="font-medium">
                        {user.planName === 'Professional' ? 'Unlimited' : user.planName === 'Trader' ? '5' : '2'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Cross-platform Support:</span>
                      <span className="font-medium">
                        {user.subscriptionStatus === 'active' ? 'Yes' : 'Limited'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-black" />
                    <CardTitle className="text-base font-medium">Performance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Latency Mode:</span>
                      <span className="font-medium">
                        {user.planName === 'Professional' ? 'Ultra-low (<10ms)' : 'Standard (<50ms)'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Symbol Mapping:</span>
                      <span className="font-medium">
                        {user.planName === 'Basic' ? 'Basic' : 'Advanced'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Trade Volume Control:</span>
                      <span className="font-medium">
                        {user.planName === 'Basic' ? 'Limited' : 'Full Control'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {user.subscriptionStatus === 'active' ? (
                <Button
                  className="bg-black hover:bg-gray-800 text-white"
                  onClick={handleCustomerPortal}
                >
                  Manage Subscription
                </Button>
              ) : (
                <Button className="bg-black hover:bg-gray-800 text-white" onClick={goToPricing}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscribe Now
                </Button>
              )}
              {user.planName !== 'Professional' && user.subscriptionStatus === 'active' && (
                <Button
                  variant="outline"
                  className="border-black text-black hover:bg-gray-100"
                  onClick={goToPricing}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold leading-none tracking-tight">
                  Software Version
                </h2>
                <p className="text-sm text-muted-foreground">
                  Current installed version and available updates
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 border rounded-lg p-4">
              <div className="rounded-full bg-green-50 p-2">
                <CircleCheckIcon className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">IPTRADE v{currentVersion}</div>
                <div className="text-xs text-muted-foreground">
                  {isLatestVersion
                    ? 'You have the latest version installed'
                    : 'Update available. Please download the latest version.'}
                </div>
              </div>
              <div>
                <Link href="/#download">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 border-black text-black hover:bg-gray-100"
                  >
                    <Download className="mr-1 h-3 w-3" />
                    {isLatestVersion ? 'Download' : 'Update Now'}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-medium">Why Update Regularly?</h3>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <Zap className="mr-2 h-4 w-4 text-black flex-shrink-0 mt-0.5" />
                  <span>Performance improvements for faster trade copying</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="mr-2 h-4 w-4 text-black flex-shrink-0 mt-0.5" />
                  <span>Enhanced compatibility with the latest MetaTrader updates</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="mr-2 h-4 w-4 text-black flex-shrink-0 mt-0.5" />
                  <span>New features and improvements to the user interface</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium">Need Help?</h3>
            <p className="text-sm text-muted-foreground mt-2">
              If you need assistance with your IPTRADE software, our support team is ready to help.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card className="border">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-start gap-2">
                    <BookOpen className="h-5 w-5 text-black" />
                    <h4 className="font-medium">Read Documentation</h4>
                    <p className="text-sm text-muted-foreground">
                      Get detailed instructions on how to configure and use the IPTRADE software.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-black" asChild>
                      <Link href="/docs">View Documentation</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="border">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-start gap-2">
                    <LifeBuoy className="h-5 w-5 text-black" />
                    <h4 className="font-medium">Technical Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Contact our support team for personalized assistance with any issues.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-black" asChild>
                      <Link href="mailto:support@iptrade.com">Contact Support</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 