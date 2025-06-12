import { sendEmail } from "./config";
import {
  welcomeEmailTemplate,
  subscriptionChangeEmailTemplate,
  passwordResetEmailTemplate,
  versionUpdateEmailTemplate,
  broadcastEmailTemplate,
} from "./templates";

// Utility function for retrying operations
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 500,
  name = "Operation"
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(operation, retries - 1, delay * 1.5, name);
  }
}

// Service to send welcome email
export async function sendWelcomeEmail({
  email,
  name,
  loginUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
}: {
  email: string;
  name: string;
  loginUrl?: string;
}) {
  const { html, text } = await welcomeEmailTemplate({
    name,
    loginUrl,
  });

  return withRetry(
    () =>
      sendEmail({
        to: email,
        subject: "Welcome to IPTRADE!",
        html,
        text,
      }),
    3,
    500,
    `Welcome email to ${email}`
  );
}

// Service to send subscription change email
export async function sendSubscriptionChangeEmail({
  email,
  name,
  planName,
  status,
  expiryDate,
  dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
}: {
  email: string;
  name: string;
  planName: string;
  status: string;
  expiryDate?: string;
  dashboardUrl?: string;
}) {
  try {
    if (!email) {
      throw new Error("Email address is missing");
    }

    const { html, text } = await subscriptionChangeEmailTemplate({
      name,
      plan: planName,
      status,
      renewalDate: expiryDate,
    });

    // Determine email subject based on status
    let subject = "Your IPTRADE subscription has been updated";
    if (status === "active") {
      subject = "Your IPTRADE subscription is active";
    } else if (status === "trialing") {
      subject = "Your IPTRADE trial has started";
    } else if (status === "canceled") {
      subject = "Your IPTRADE subscription has been canceled";
    } else if (status === "unpaid") {
      subject = "There was a payment issue with your IPTRADE subscription";
    }

    // Retry sending up to 3 times
    return await withRetry(
      () =>
        sendEmail({
          to: email,
          subject,
          html,
          text,
        }),
      3,
      500,
      `Subscription email to ${email}`
    );
  } catch (error) {
    
    throw error;
  }
}

// Service to send password reset email
export async function sendPasswordResetEmail({
  email,
  name,
  token,
  expiryMinutes = 60,
}: {
  email: string;
  name: string;
  token: string;
  expiryMinutes?: number;
}) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  const { html, text } = await passwordResetEmailTemplate({
    name,
    resetUrl,
    expiryMinutes,
  });

  return sendEmail({
    to: email,
    subject: "Reset password for your IPTRADE account",
    html,
    text,
  });
}

// Service to send version update email
export async function sendVersionUpdateEmail({
  email,
  name,
  currentVersion,
  newVersion,
  releaseNotes,
  downloadUrl,
  isCritical = false,
}: {
  email: string;
  name: string;
  currentVersion: string;
  newVersion: string;
  releaseNotes?: string;
  downloadUrl?: string;
  isCritical?: boolean;
}) {
  const { html, text } = await versionUpdateEmailTemplate({
    name,
    currentVersion,
    newVersion,
    releaseNotes,
    downloadUrl,
    isCritical,
  });

  const subject = isCritical
    ? `[CRITICAL UPDATE] New version ${newVersion} available`
    : `New version ${newVersion} available for IPTRADE`;

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

// Service to send broadcast or announcement email
export async function sendBroadcastEmail({
  email,
  name,
  subject,
  message,
  isImportant = false,
}: {
  email: string;
  name: string;
  subject: string;
  message: string;
  isImportant?: boolean;
}) {
  const { html, text } = await broadcastEmailTemplate({
    name,
    subject,
    message,
    isImportant,
  });

  return sendEmail({
    to: email,
    subject: isImportant ? `[IMPORTANT] ${subject}` : subject,
    html,
    text,
  });
}

// Service to send trading account configuration notification email
export async function sendTradingAccountNotificationEmail({
  email,
  name,
  accountsData,
  serverStatus,
  serverIP,
}: {
  email: string;
  name: string;
  accountsData: {
    totalAccounts: number;
    masterAccounts: number;
    slaveAccounts: number;
    synchronizedAccounts: number;
    pendingAccounts: number;
    errorAccounts: number;
  };
  serverStatus?: string;
  serverIP?: string;
}) {
  const statusMessage = getStatusMessage(serverStatus);
  const accountsStatusText = getAccountsStatusText(accountsData);

  // Create the message content for the broadcast template
  const message = `Your administrator has finished configuring your trading accounts in the IPTRADE Managed VPS service. Here's a summary of your current configuration:

ACCOUNT SUMMARY:
- Total Accounts: ${accountsData.totalAccounts}
- Master Accounts: ${accountsData.masterAccounts}
- Slave Accounts: ${accountsData.slaveAccounts}
- Synchronized: ${accountsData.synchronizedAccounts}
- Pending: ${accountsData.pendingAccounts}
- Issues/Offline: ${accountsData.errorAccounts}

SERVER STATUS: ${statusMessage}
${serverIP ? `Server IP: ${serverIP}` : ''}

${accountsStatusText}

You can view and manage your trading accounts by logging into your IPTRADE dashboard.

If you have any questions or need assistance, please don't hesitate to contact our support team.`;

  // Use the existing broadcast email template
  return sendBroadcastEmail({
    email,
    name,
    subject: "Trading Account Configuration Update",
    message,
    isImportant: true
  });
}

// Helper functions for trading account notifications
function getStatusMessage(serverStatus?: string): string {
  switch (serverStatus) {
    case "optimal":
      return "All Synchronized - Your setup is working perfectly!";
    case "warning": 
      return "Mostly Synchronized - Most accounts are working correctly";
    case "pending":
      return "Mostly Pending - Accounts are being configured";
    case "error":
      return "Issues Detected - Some accounts need attention";
    default:
      return "Configuration Complete";
  }
}

function getStatusColor(serverStatus?: string): string {
  switch (serverStatus) {
    case "optimal":
      return "#dcfce7"; // green-100
    case "warning":
      return "#fef3c7"; // yellow-100  
    case "pending":
      return "#dbeafe"; // blue-100
    case "error":
      return "#fee2e2"; // red-100
    default:
      return "#f8fafc"; // gray-50
  }
}

function getAccountsStatusText(accountsData: any): string {
  if (accountsData.synchronizedAccounts === accountsData.totalAccounts) {
    return "All your accounts are synchronized and ready for trading!";
  } else if (accountsData.pendingAccounts > 0) {
    return "Some accounts are still being configured. They will be ready shortly.";
  } else if (accountsData.errorAccounts > 0) {
    return "Some accounts may require your attention. Please check your dashboard for more details.";
  } else {
    return "Your trading account configuration has been updated.";
  }
}
