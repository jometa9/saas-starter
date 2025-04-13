import { db } from "../lib/db/drizzle";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";

const email = process.argv[2];

if (!email) {
  console.error(
    "Please provide an email address: npm run make-admin your@email.com"
  );
  process.exit(1);
}

async function makeAdmin() {
  try {
    console.log(`Looking for user with email: ${email}`);

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`Found user: ${user[0].name || user[0].email}`);

    // Update the user role to admin
    await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.id, user[0].id));

    console.log(`Successfully updated user ${email} to admin role!`);

    process.exit(0);
  } catch (error) {
    console.error("Error updating user:", error);
    process.exit(1);
  }
}

makeAdmin();
