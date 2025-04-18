import { db } from "../lib/db/drizzle";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";

const email = process.argv[2];

if (!email) {
  
  process.exit(1);
}

async function makeAdmin() {
  try {
    

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      
      process.exit(1);
    }

    

    // Update the user role to admin
    await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.id, user[0].id));

    

    process.exit(0);
  } catch (error) {
    
    process.exit(1);
  }
}

makeAdmin();
