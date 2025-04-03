import { NextRequest, NextResponse } from "next/server";
import { getUserByApiKey, updateUserSubscription } from "@/lib/db/queries";
import { stripe } from "@/lib/payments/stripe";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const apiKey = searchParams.get("apiKey");
  const clientType = searchParams.get("clientType");
  const isElectronClient = clientType === "electron";

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is required as a URL parameter (apiKey=your_key)" },
      { status: 401 }
    );
  }

  // Verificar el origen de la solicitud solo si NO es un cliente Electron
  if (!isElectronClient) {
    const origin = request.headers.get("origin");
    
    // Obtener los dominios permitidos del .env o usar un valor predeterminado
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
    const isValidOrigin = !origin || allowedOrigins.includes(origin);
    
    if (!isValidOrigin && allowedOrigins.length > 0) {
      return NextResponse.json(
        { error: "Unauthorized request origin" },
        { status: 403 }
      );
    }
  }

  try {
    const user = await getUserByApiKey(apiKey);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid License Key" },
        { status: 401 }
      );
    }
    
    // Verificar con Stripe si hay cambios en la suscripción
    if (user.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        // Si el estado en Stripe es diferente al de la base de datos, actualizar
        if (subscription.status !== user.subscriptionStatus) {
          const plan = subscription.items.data[0]?.plan;
          
          await updateUserSubscription(user.id, {
            stripeSubscriptionId: subscription.id,
            stripeProductId: plan?.product as string,
            planName: user.planName, // Mantener el nombre del plan actual
            subscriptionStatus: subscription.status
          });
          
          // Actualizar el objeto user para reflejar los cambios
          user.subscriptionStatus = subscription.status;
        }
      } catch (stripeError) {
        // Si hay un error al consultar Stripe, continuar con los datos de la base de datos
        console.error("Error retrieving subscription from Stripe:", stripeError);
      }
    }
    
    const isSubscriptionActive =
      user.subscriptionStatus === "active" ||
      user.subscriptionStatus === "trialing";

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      name: user.name,
      subscriptionStatus: user.subscriptionStatus,
      planName: user.planName,
      isActive: isSubscriptionActive,
    });
  } catch (error) {
    console.error("Error validating subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
