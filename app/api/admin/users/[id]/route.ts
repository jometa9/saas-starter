import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { getUserById } from "@/lib/db/queries";
import { db } from "@/lib/db/drizzle";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication using the same method as admin pages
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the complete user from the database
    const currentUser = await getUserById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Verify that the user is an administrator
    if (currentUser.role !== "admin" && currentUser.role !== "superadmin") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get the user ID to update
    const userId = params.id;

    // Validate that the ID is provided
    if (!userId) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Get the data to update from the request body
    const body = await request.json();

    console.log("Updating user:", userId);
    console.log("Update data:", body);

    try {
      // Perform the update
      const result = await db
        .update(user)
        .set({
          serverIP: body.serverIP,
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId));

      console.log("Update result:", result);

      // Return an informative response
      return NextResponse.json({
        success: true,
        message: "User serverIP updated successfully",
        updatedValue: body.serverIP,
      });
    } catch (updateError) {
      console.error("Update error:", updateError);
      throw updateError; // Re-throw to be handled by the outer catch
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
