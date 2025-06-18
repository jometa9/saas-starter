import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/payments/stripe";
import { getUser } from "@/lib/db/queries";

export async function GET(req: NextRequest) {
  // Este endpoint solo debe usarse durante el desarrollo
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Este endpoint solo está disponible en modo de desarrollo" },
      { status: 403 }
    );
  }

  try {
    // Obtener usuario actual
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "No hay sesión de usuario" },
        { status: 401 }
      );
    }

    // Comprobar que el usuario tiene permisos de administrador
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // Verificar la configuración de Stripe
    const apiKey = process.env.STRIPE_SECRET_KEY;
    let stripeStatus = "no-key";
    let stripeMessage = "No hay clave API de Stripe configurada";

    if (apiKey) {
      if (apiKey.startsWith("sk_test_")) {
        stripeStatus = "test-mode";
        stripeMessage = "Stripe configurado en modo de prueba";
      } else if (apiKey.startsWith("sk_live_")) {
        stripeStatus = "live-mode";
        stripeMessage = "Stripe configurado en modo de producción";
      } else {
        stripeStatus = "invalid-key";
        stripeMessage = "Formato de clave API de Stripe inválido";
      }
    }

    // Verificar URLs críticas para Stripe
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.BASE_URL ||
      "http://localhost:3000";
    const successUrl = `${baseUrl}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/pricing`;

    // Intentar obtener la lista de precios para verificar que la clave funciona
    let pricesData = null;
    let pricesError = null;

    try {
      // Limitar a 3 precios para no sobrecargar la respuesta
      const prices = await stripe.prices.list({ limit: 3, active: true });
      pricesData = prices.data.map((price) => ({
        id: price.id,
        amount: price.unit_amount,
        currency: price.currency,
        productId:
          typeof price.product === "string" ? price.product : price.product.id,
      }));
    } catch (error) {
      pricesError =
        error instanceof Error ? error.message : "Error desconocido";
    }

    // Intentar probar una creación de sesión dummy para verificar permisos
    let sessionTestResult = null;
    let sessionTestError = null;

    try {
      if (user.stripeCustomerId && pricesData && pricesData.length > 0) {
        // Solo hacer esta prueba si tenemos un customerId y al menos un precio
        const dummyConfig = {
          payment_method_types: ["card"],
          line_items: [{ price: pricesData[0].id, quantity: 1 }],
          mode: "subscription",
          success_url: successUrl,
          cancel_url: cancelUrl,
          customer: user.stripeCustomerId,
          client_reference_id: user.id.toString(),
          subscription_data: { trial_period_days: 14 },
        };

        // Detectar posibles problemas con los permisos de la API key
        await stripe.checkout.sessions.create(dummyConfig);
        sessionTestResult = "Prueba de creación de sesión exitosa";
      } else {
        sessionTestResult =
          "No se pudo probar la creación de sesión (falta customerId o precios)";
      }
    } catch (error) {
      sessionTestError =
        error instanceof Error ? error.message : "Error desconocido";
    }

    // Información general del usuario
    const userInfo = {
      id: user.id,
      email: user.email,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      stripeProductId: user.stripeProductId,
      planName: user.planName,
      subscriptionStatus: user.subscriptionStatus,
    };

    // Verificar cliente en Stripe si existe un ID
    let customerInfo = null;
    let customerError = null;

    if (user.stripeCustomerId) {
      try {
        const customer = await stripe.customers.retrieve(user.stripeCustomerId);
        customerInfo = {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          created: new Date(customer.created * 1000).toISOString(),
          defaultSource: customer.default_source,
        };
      } catch (error) {
        customerError =
          error instanceof Error ? error.message : "Error desconocido";
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      stripe: {
        status: stripeStatus,
        message: stripeMessage,
        webhookConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
        baseUrl,
        successUrl,
        cancelUrl,
      },
      user: userInfo,
      customer: customerInfo,
      customerError,
      prices: pricesData,
      pricesError,
      sessionTest: {
        result: sessionTestResult,
        error: sessionTestError,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al realizar diagnóstico" },
      { status: 500 }
    );
  }
}
