import nodemailer from "nodemailer";
import { Resend } from "resend";

// Resend configuration (modern email service)
export const resend = new Resend(process.env.RESEND_API_KEY);

// Nodemailer configuration as alternative
// In development, uses ethereal.email (test service)
let transporter: nodemailer.Transporter;

// Function to verify if we are in production mode
const isProduction = (): boolean => {
  // First we check our own variable, if it exists
  if (process.env.NEXT_PUBLIC_EMAIL_MODE) {
    return process.env.NEXT_PUBLIC_EMAIL_MODE === "production";
  }
  // As a fallback, we check NODE_ENV (although Next.js might ignore changes in .env.local)
  return process.env.NODE_ENV === "production";
};

// Initialize the Nodemailer transporter
export async function initializeEmailTransporter() {
  // If a transporter already exists, return it
  if (transporter) return transporter;

  // If we're in development, use ethereal.email
  if (!isProduction()) {
    try {
      // Create a test account in ethereal.email
      const testAccount = await nodemailer.createTestAccount();

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (error) {
      throw new Error("Failed to configure email transport");
    }
  } else {
    // In production, use configured SMTP or an external service
    if (!process.env.SMTP_HOST && !process.env.RESEND_API_KEY) {
    }

    if (process.env.SMTP_HOST) {
      try {
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });
      } catch (error) {
        throw new Error("Failed to configure email transport");
      }
    } else {
      // If no SMTP is configured, we create a "dummy" transporter that throws errors
      // This avoids unnecessary errors in the application, but sending will fail

      transporter = nodemailer.createTransport({
        name: "no-reply",
        version: "1.0.0",
        send: (mail, callback) => {
          const error = new Error(
            "No SMTP configuration found, email not sent"
          );
          callback(error);
        },
      } as any);
    }
  }

  return transporter;
}

/**
 * Verifies if an email address is valid for testing with Resend
 * In test mode, Resend only allows sending to verified domains or @resend.dev
 */
const isValidResendTestAddress = (email: string): boolean => {
  // In production, Resend rejects common test domains
  const invalidTestDomains = [
    "@test.com",
    "@example.com",
    "@testing.com",
    "@sample.com",
  ];

  // If it's a known test domain, it's not valid in production
  if (
    invalidTestDomains.some((domain) => email.toLowerCase().endsWith(domain))
  ) {
    return false;
  }

  // Valid domains for testing in Resend
  const validTestDomains = [
    "@resend.dev",
    "@gmail.com",
    "@hotmail.com",
    "@outlook.com",
    "@yahoo.com",
    "@icloud.com",
    "@aol.com",
    "@protonmail.com",
    "@iptradecopier.com",
    // You can add more domains as needed
  ];

  return validTestDomains.some((domain) =>
    email.toLowerCase().endsWith(domain)
  );
};

/**
 * Ensures that the email address is valid for Resend
 * If not, replaces it with a safe address for testing
 */
const getSafeResendEmail = (email: string): string => {
  // In production, always reject common test domains
  const invalidTestDomains = [
    "@test.com",
    "@example.com",
    "@testing.com",
    "@sample.com",
  ];

  const isInvalidTestDomain = invalidTestDomains.some((domain) =>
    email.toLowerCase().endsWith(domain)
  );

  // In production mode, we allow all domains except known test domains
  if (isProduction()) {
    if (isInvalidTestDomain) {
      return process.env.RESEND_TEST_EMAIL || "onboarding@resend.dev";
    }
    return email; // In production, we return the email as is if it's not a test domain
  }

  // In development, only allow verified domains
  if (!isValidResendTestAddress(email)) {
    return process.env.RESEND_TEST_EMAIL || "onboarding@resend.dev";
  }

  return email;
};

// Function to send emails using Resend (preferred) or Nodemailer (fallback)
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = process.env.EMAIL_FROM || "no-reply@saas-starter.com",
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
}) {
  try {
    // Try sending with Resend first
    if (process.env.RESEND_API_KEY) {
      // Ensure the address is valid for Resend in any mode
      let safeRecipient = getSafeResendEmail(to);

      try {
        console.log(`📧 Sending email via Resend:`, {
          from,
          to: safeRecipient,
          subject,
          originalRecipient: to,
        });

        const { data, error } = await resend.emails.send({
          from,
          to: safeRecipient,
          subject,
          html,
          text,
        });

        if (error) {
          console.error("❌ Resend error:", error);
          throw error;
        }

        console.log("✅ Email sent successfully via Resend:", {
          id: data?.id,
          originalRecipient: to,
          actualRecipient: safeRecipient,
        });

        return {
          id: data?.id,
          provider: "resend",
          originalRecipient: to,
          actualRecipient: safeRecipient,
        };
      } catch (resendError) {
        throw resendError; // Throw the error to pass to the fallback
      }
    }

    const transport = await initializeEmailTransporter();
    const info = await transport.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    return { id: info.messageId, provider: "nodemailer" };
  } catch (error) {
    throw error;
  }
}

// Function to verify email configuration
export async function testEmailConfiguration() {
  try {
    let resendConfigured = false;
    let nodemailerConfigured = false;

    // Test if Resend is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const domains = await resend.domains.list();
        resendConfigured = true;
      } catch (error) {
        // We don't throw an error here, we let Nodemailer be the alternative
      }
    }

    // Test Nodemailer only if there's an SMTP configuration or we're in development
    const hasSmtpConfig = !!process.env.SMTP_HOST && !!process.env.SMTP_PORT;

    if (hasSmtpConfig || !isProduction()) {
      try {
        const transport = await initializeEmailTransporter();

        // Verify the connection
        await transport.verify();
        nodemailerConfigured = true;

        // If we're in development, send a test email
        if (!isProduction()) {
          const info = await transport.sendMail({
            from: process.env.EMAIL_FROM || "test@example.com",
            to: "test@example.com",
            subject: "Test Email",
            text: "This is a test email to verify configuration",
            html: "<p>This is a test email to verify configuration</p>",
          });
        }
      } catch (error) {
        // No lanzamos error aquí a menos que Resend también haya fallado
      }
    }

    // Verificar si al menos un método de envío está configurado
    if (!resendConfigured && !nodemailerConfigured) {
      throw new Error(
        "No email service configured. Please configure either Resend or SMTP."
      );
    }

    return {
      success: true,
      message: "Email configuration test passed",
      services: {
        resend: resendConfigured ? "configured" : "not configured",
        nodemailer: nodemailerConfigured ? "configured" : "not configured",
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      error,
    };
  }
}
