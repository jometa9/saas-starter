import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { getUserById } from "@/lib/db/queries";
import { sendTradingAccountNotificationEmail } from "@/lib/email/services";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await getUserById(session.user.id);
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "superadmin")) {
      return NextResponse.json({ error: 'Access denied. Admin privileges required.' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, userName, userEmail, accountsData, serverStatus, serverIP } = body;

    // Validation
    if (!userId || !userEmail || !accountsData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Send email using the existing email service
    console.log('🔔 Sending trading account notification email to:', userEmail);
    
    const emailResult = await sendTradingAccountNotificationEmail({
      email: userEmail,
      name: userName || userEmail.split('@')[0],
      accountsData,
      serverStatus,
      serverIP,
    });

    console.log('✅ Email sent successfully:', emailResult);

    return NextResponse.json({ 
      success: true, 
      message: 'Notification sent successfully',
      recipient: userEmail,
      emailResult
    });

  } catch (error) {
    console.error('Notify user API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 