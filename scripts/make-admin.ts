import { db } from "../lib/db/drizzle";
import { user } from "../lib/db/schema";
import { eq } from "drizzle-orm";

const email = process.argv[2];

if (!email) {
  console.error("❌ Please provide an email address");
  console.log("Usage: npm run make-admin <email>");
  process.exit(1);
}

async function makeAdmin() {
  try {
    console.log(`🔍 Looking for user with email: ${email}`);

    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (userResult.length === 0) {
      console.error(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`👤 Found user: ${userResult[0].name || userResult[0].email}`);
    console.log(`📋 Current role: ${userResult[0].role}`);

    // Update the user role to admin
    await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.id, userResult[0].id));

    console.log(`✅ Successfully updated ${email} to admin role`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating user role:", error);
    process.exit(1);
  }
}

makeAdmin();
