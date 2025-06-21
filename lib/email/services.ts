import { sendEmail } from "./config";
import {
  broadcastEmailTemplate,
  passwordResetEmailTemplate,
  richContentEmailTemplate,
  subscriptionChangeEmailTemplate,
  versionUpdateEmailTemplate,
  welcomeEmailTemplate,
} from "./templates";

// Utility function for retrying operations
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 500,
  name = "Operation"
): Promise<T> {
  try {
    console.log(`🔄 withRetry: Starting ${name} (retries left: ${retries})`);
    const result = await operation();
    console.log(`✅ withRetry: ${name} completed successfully`);
    return result;
  } catch (error) {
    console.error(`❌ withRetry: ${name} failed:`, error);

    if (retries <= 0) {
      console.error(
        `💥 withRetry: ${name} exhausted all retries, throwing error`
      );
      throw error;
    }

    console.log(
      `⏳ withRetry: ${name} retrying in ${delay}ms (retries left: ${retries - 1})`
    );
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

  // Import the new trading account notification template
  const { tradingAccountNotificationTemplate } = await import("./templates");

  // Generate the email content using the dedicated template
  const emailData = await tradingAccountNotificationTemplate({
    name,
    totalAccounts: accountsData.totalAccounts,
    masterAccounts: accountsData.masterAccounts,
    slaveAccounts: accountsData.slaveAccounts,
    synchronizedAccounts: accountsData.synchronizedAccounts,
    pendingAccounts: accountsData.pendingAccounts,
    errorAccounts: accountsData.errorAccounts,
    serverStatus: statusMessage,
    serverIP,
    accountsStatusText,
  });

  // Send the email
  return await sendEmail({
    to: email,
    subject: "Trading Account Configuration Update",
    html: emailData.html,
    text: emailData.text,
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

// Service to send admin notification when managed VPS user updates accounts
export async function sendManagedVPSUpdateNotificationToAdmins({
  userInfo,
  updateDetails,
  adminEmails,
}: {
  userInfo: {
    id: string;
    name: string;
    email: string;
    planName: string;
  };
  updateDetails: {
    accountId?: number;
    action: "created" | "updated" | "deleted";
    accountNumber?: string;
    platform?: string;
    accountType?: string;
    timestamp: Date;
  };
  adminEmails: { email: string; name: string }[];
}) {
  const actionText = {
    created: "Account Created",
    updated: "Account Updated",
    deleted: "Account Deleted",
  };

  const actionDescriptions = {
    created: "created a new trading account",
    updated: "updated a trading account",
    deleted: "deleted a trading account",
  };

  const subject = `[Managed VPS] ${actionText[updateDetails.action]} - ${userInfo.name || userInfo.email}`;

  // Import the template function
  const { managedVPSAdminNotificationTemplate } = await import(
    "@/lib/email/templates"
  );

  // Send email to all admin users using the custom template
  const emailPromises = adminEmails.map(async (admin) => {
    try {
      const { html, text } = await managedVPSAdminNotificationTemplate({
        name: admin.name || admin.email.split("@")[0],
        action: actionText[updateDetails.action],
        actionText: actionDescriptions[updateDetails.action],
        userName: userInfo.name || "N/A",
        userEmail: userInfo.email,
        userPlan: userInfo.planName,
        userId: userInfo.id,
        accountId: updateDetails.accountId,
        accountNumber: updateDetails.accountNumber,
        platform: updateDetails.platform,
        accountType: updateDetails.accountType,
        timestamp: updateDetails.timestamp.toLocaleString("en-US", {
          timeZone: "UTC",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      });

      return sendEmail({
        to: admin.email,
        subject,
        html,
        text,
      });
    } catch (error) {
      console.error(
        `Failed to send notification to admin ${admin.email}:`,
        error
      );
      return null;
    }
  });

  const results = await Promise.allSettled(emailPromises);
  const successCount = results.filter(
    (result) => result.status === "fulfilled"
  ).length;

  console.log(
    `Sent Managed VPS update notification to ${successCount}/${adminEmails.length} admins`
  );
}

// Service to send rich content email with markdown support
export async function sendRichContentEmail({
  email,
  name,
  subject,
  markdownContent,
}: {
  email: string;
  name: string;
  subject: string;
  markdownContent: string;
}) {
  try {
    console.log(`Preparing rich content email for ${email}...`);

    const { html, text } = await richContentEmailTemplate({
      name,
      subject,
      markdownContent,
    });

    console.log(`Template generated successfully for ${email}, sending...`);

    const result = await withRetry(
      () => {
        console.log(`🔄 Attempting to send email to ${email}...`);
        return sendEmail({
          to: email,
          subject,
          html,
          text,
        });
      },
      3,
      500,
      `Rich content email to ${email}`
    );

    console.log(`✅ Rich content email successfully sent to ${email}:`, result);
    return result;
  } catch (error) {
    console.error(`Error sending rich content email to ${email}:`, error);
    throw error;
  }
}
