import { stripe } from '../payments/stripe';
import { db } from './drizzle';
import { users } from './schema';
import { hashPassword } from '../auth/session';
import { generateApiKey } from '../utils';

async function createStripeProducts() {
  const baseProduct = await stripe.products.create({
    name: 'Base',
    description: 'Base subscription plan',
  });

  await stripe.prices.create({
    product: baseProduct.id,
    unit_amount: 800, // $8 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  const plusProduct = await stripe.products.create({
    name: 'Plus',
    description: 'Plus subscription plan',
  });

  await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 1200, // $12 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
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
