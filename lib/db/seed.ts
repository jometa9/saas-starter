import { stripe } from '../payments/stripe';
import { db } from './drizzle';
import { users } from './schema';
import { hashPassword } from '../auth/session';
import { generateApiKey } from '../utils';

async function createStripeProducts() {
  // Plan Standard ($20/mes o $192/año)
  const standardProduct = await stripe.products.create({
    name: 'Standard',
    description: 'Standard subscription plan',
  });

  // Precio Mensual Standard
  await stripe.prices.create({
    product: standardProduct.id,
    unit_amount: 2000, // $20 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 14,
    },
  });

  // Precio Anual Standard (con 20% de descuento)
  await stripe.prices.create({
    product: standardProduct.id,
    unit_amount: 19200, // $192 in cents (20% discount from $240)
    currency: 'usd',
    recurring: {
      interval: 'year',
      trial_period_days: 14,
    },
  });

  // Plan Premium ($50/mes o $480/año)
  const premiumProduct = await stripe.products.create({
    name: 'Premium',
    description: 'Premium subscription plan',
  });

  // Precio Mensual Premium
  await stripe.prices.create({
    product: premiumProduct.id,
    unit_amount: 5000, // $50 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 14,
    },
  });

  // Precio Anual Premium (con 20% de descuento)
  await stripe.prices.create({
    product: premiumProduct.id,
    unit_amount: 48000, // $480 in cents (20% discount from $600)
    currency: 'usd',
    recurring: {
      interval: 'year',
      trial_period_days: 14,
    },
  });

  // Plan Managed Service ($999/mes o $9590/año)
  const managedServiceProduct = await stripe.products.create({
    name: 'Managed Service',
    description: 'Managed Service subscription plan with white-glove support',
  });

  // Precio Mensual Managed Service
  await stripe.prices.create({
    product: managedServiceProduct.id,
    unit_amount: 99900, // $999 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 14,
    },
  });

  // Precio Anual Managed Service (con 20% de descuento)
  await stripe.prices.create({
    product: managedServiceProduct.id,
    unit_amount: 959040, // $9590.4 in cents (20% discount from $11,988), redondeado a $9590
    currency: 'usd',
    recurring: {
      interval: 'year',
      trial_period_days: 14,
    },
  });
}

async function main() {
  await db.delete(users);

  const passwordHash = await hashPassword('password');
  const apiKey = generateApiKey();
  const [user] = await db
    .insert(users)
    .values({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash,
      apiKey,
      role: 'owner',
    })
    .returning();
  await createStripeProducts();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
