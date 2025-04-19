import { NextRequest, NextResponse } from 'next/server';
import { testEmailConfiguration, sendEmail } from '@/lib/email';
import { getUser } from '@/lib/db/queries';
import { sendSubscriptionChangeEmail, sendWelcomeEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    // Check if user is an administrator
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - only admins can use this endpoint' },
        { status: 401 }
      );
    }

    // Test email configuration
    const configResult = await testEmailConfiguration();
    
    return NextResponse.json({ 
      message: 'Email configuration test completed',
      configResult,
    });
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Failed to test email configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is an administrator
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - only admins can use this endpoint' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { type, email } = data;
    
    // Use provided email or current user's email
    const targetEmail = email || user.email;
    
    if (!targetEmail) {
      return NextResponse.json(
        { error: 'No email address provided' },
        { status: 400 }
      );
    }
    
    let result;
    // Send different types of test emails
    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail({
          email: targetEmail,
          name: user.name || targetEmail.split('@')[0],
        });
        break;
      case 'subscription':
        result = await sendSubscriptionChangeEmail({
          email: targetEmail,
          name: user.name || targetEmail.split('@')[0],
          planName: 'Test Plan',
          status: 'active',
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });
        break;
      default:
        // Generic test email
        result = await sendEmail({
          to: targetEmail,
          subject: 'Test Email from IPTRADE',
          html: `
            <h1>Successful Test!</h1>
            <p>If you are seeing this email, the email configuration is working correctly.</p>
            <p>Test date and time: ${new Date().toLocaleString()}</p>
          `,
          text: `Successful Test! If you are seeing this email, the email configuration is working correctly. Test date and time: ${new Date().toLocaleString()}`,
        });
    }
    
    return NextResponse.json({ 
      message: `Test email sent successfully to ${targetEmail}`,
      type: type || 'generic',
      result,
    });
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Failed to send test email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 