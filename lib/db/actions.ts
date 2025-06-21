"use server";

import { db } from "@/lib/db/drizzle";
import {
  getAdminUsers,
  getAppVersion,
  getUser,
  updateAppVersion,
} from "@/lib/db/queries";
import { user } from "@/lib/db/schema";
import { sendBroadcastEmail, sendVersionUpdateEmail } from "@/lib/email";
import { and, eq, isNull, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NewTradingAccount, tradingAccounts } from "./schema";

export async function updateAppVersionAction(
  data: FormData | { version: string } | string | null | undefined,
  _previousState: any
) {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    return {
      error: "Unauthorized - only admins can update app version",
    };
  }

  // Obtener versión actual como respaldo
  const currentVersion = await getAppVersion();

  let version: string = "";

  // Extraer versión de los datos recibidos
  if (typeof data === "string") {
    // Si se pasó un string directamente
    version = data;
  } else if (data instanceof FormData) {
    // Si se pasó un FormData
    const formVersion = data.get("version");
    version = typeof formVersion === "string" ? formVersion : "";
  } else if (data && typeof data === "object") {
    // Si se pasó un objeto con propiedad version
    if ("version" in data && typeof data.version === "string") {
      version = data.version;
    }
  }

  // Si no se pudo extraer la versión, verificar el estado previo
  if (!version && _previousState && typeof _previousState === "object") {
    if (
      "version" in _previousState &&
      typeof _previousState.version === "string"
    ) {
      version = _previousState.version;
    }
  }

  // Si aún no hay versión, usar la actual
  if (!version) {
    version = currentVersion;
  }

  // Limpiar la versión de espacios en blanco
  version = version.trim();

  // Validar formato de versión (x.y.z)
  const versionRegex = /^\d+\.\d+\.\d+$/;
  const isValidFormat = versionRegex.test(version);

  if (!isValidFormat) {
    return {
      error: "Invalid version format. Use X.Y.Z (e.g., 1.0.0)",
    };
  }

  // Verificar si la versión es diferente a la actual
  if (version === currentVersion) {
    return {
      info: `App version is already ${version}`,
    };
  }

  try {
    const updatedVersion = await updateAppVersion(version, user.id);

    // Enviar email a todos los usuarios activos sobre la actualización
    try {
      // Obtener todos los usuarios activos con email
      const activeUsers = await db
        .select()
        .from(user)
        .where(ne(user.email, ""))
        .where(isNull(user.deletedAt));

      // Enviar email a cada usuario de forma asíncrona
      // Limitar el número de emails simultáneos
      const batchSize = 5;
      let successCount = 0;
      let failureCount = 0;

      // Procesar en lotes para no sobrecargar el servicio de email
      for (let i = 0; i < activeUsers.length; i += batchSize) {
        const batch = activeUsers.slice(i, i + batchSize);

        const emailPromises = batch.map((recipient) =>
          sendVersionUpdateEmail({
            email: recipient.email,
            name: recipient.name || recipient.email.split("@")[0],
            currentVersion: currentVersion,
            newVersion: updatedVersion,
            releaseNotes:
              data instanceof FormData
                ? data.get("releaseNotes")?.toString()
                : "",
            downloadUrl:
              data instanceof FormData
                ? data.get("downloadUrl")?.toString()
                : process.env.NEXT_PUBLIC_APP_URL,
            isCritical:
              data instanceof FormData
                ? data.get("isCritical") === "true"
                : false,
          })
            .then(() => {
              successCount++;
              return true;
            })
            .catch((error) => {
              failureCount++;
              // No bloqueamos el proceso si falla algún email individual
              return false;
            })
        );

        // Esperamos a que termine este lote antes de continuar
        await Promise.all(emailPromises);

        // Pequeña pausa entre lotes para no sobrecargar
        if (i + batchSize < activeUsers.length) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      // Si estamos en modo desarrollo, mostrar un mensaje especial
      if (process.env.NEXT_PUBLIC_EMAIL_MODE !== "production") {
      }
    } catch (error) {}

    // Forzar la revalidación del path
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    revalidatePath("/(dashboard)/dashboard");
    revalidatePath("/(dashboard)/dashboard/settings");

    return {
      success: `App version updated to ${updatedVersion}`,
    };
  } catch (error) {
    return {
      error: "Failed to update app version",
    };
  }
}

export async function sendBroadcastEmailAction(
  data: FormData | null | undefined,
  _previousState: any
) {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    return {
      error: "Unauthorized - only admins can send broadcast emails",
    };
  }

  if (!data || !(data instanceof FormData)) {
    return {
      error: "No data provided",
    };
  }

  // Extraer datos del formulario
  const subject = data.get("subject")?.toString();
  const message = data.get("message")?.toString();
  const ctaLabel = data.get("ctaLabel")?.toString();
  const ctaUrl = data.get("ctaUrl")?.toString();
  const isImportant = data.get("isImportant") === "true";

  // Validar datos
  if (!subject || subject.trim() === "") {
    return {
      error: "El asunto es obligatorio",
    };
  }

  if (!message || message.trim() === "") {
    return {
      error: "El mensaje es obligatorio",
    };
  }

  // Si se proporciona etiqueta CTA, la URL es obligatoria
  if (ctaLabel && (!ctaUrl || !ctaUrl.startsWith("http"))) {
    return {
      error: "Si se proporciona una etiqueta CTA, la URL debe ser válida",
    };
  }

  try {
    // Obtener todos los usuarios activos con email
    const activeUsers = await db
      .select()
      .from(user)
      .where(ne(user.email, ""))
      .where(isNull(user.deletedAt));

    if (activeUsers.length === 0) {
      return {
        error: "No se encontraron usuarios activos para enviar el mensaje",
      };
    }

    // Enviar email a cada usuario de forma asíncrona
    // Limitar el número de emails simultáneos
    const batchSize = 5;
    let successCount = 0;
    let failureCount = 0;

    // Procesar en lotes para no sobrecargar el servicio de email
    for (let i = 0; i < activeUsers.length; i += batchSize) {
      const batch = activeUsers.slice(i, i + batchSize);

      const emailPromises = batch.map((recipient) =>
        sendBroadcastEmail({
          email: recipient.email,
          name: recipient.name || recipient.email.split("@")[0],
          subject: subject,
          message: message,
          ctaLabel: ctaLabel || undefined,
          ctaUrl: ctaUrl || undefined,
          isImportant: isImportant,
        })
          .then(() => {
            successCount++;
            return true;
          })
          .catch((error) => {
            failureCount++;
            // No bloqueamos el proceso si falla algún email individual
            return false;
          })
      );

      // Esperamos a que termine este lote antes de continuar
      await Promise.all(emailPromises);

      // Pequeña pausa entre lotes para no sobrecargar
      if (i + batchSize < activeUsers.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    return {
      success: `Email enviado con éxito a ${successCount} usuarios (${failureCount} fallidos)`,
    };
  } catch (error) {
    return {
      error: "Ocurrió un error al enviar los emails",
    };
  }
}

// Trading Accounts Actions

// Helper function to unlink slave accounts from a master
async function unlinkSlaveAccountsFromMaster(masterAccountNumber: string) {
  try {
    console.log(
      `Starting to unlink slaves from master account: ${masterAccountNumber}`
    );

    const result = await db
      .update(tradingAccounts)
      .set({
        connectedToMaster: "",
        updatedAt: new Date(),
      })
      .where(eq(tradingAccounts.connectedToMaster, masterAccountNumber))
      .returning();

    console.log(
      `Successfully unlinked ${result.length} slave accounts from master: ${masterAccountNumber}`
    );
    return result;
  } catch (error) {
    console.error(
      `Error unlinking slave accounts from master ${masterAccountNumber}:`,
      error
    );
    throw error;
  }
}

export async function createTradingAccount(data: NewTradingAccount) {
  try {
    const result = await db
      .insert(tradingAccounts)
      .values({
        ...data,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Check if user has Managed VPS and notify admins
    await notifyAdminsIfManagedVPS(data.userId, {
      accountId: result[0].id,
      action: "created",
      accountNumber: data.accountNumber,
      platform: data.platform,
      accountType: data.accountType,
      timestamp: new Date(),
    });

    return { success: true, account: result[0] };
  } catch (error) {
    return { success: false, error: "Failed to create trading account" };
  }
}

export async function updateTradingAccount(
  id: number,
  data: Partial<NewTradingAccount>
) {
  try {
    // Get the account to check user
    const existingAccount = await db
      .select()
      .from(tradingAccounts)
      .where(eq(tradingAccounts.id, id))
      .limit(1);

    if (existingAccount.length === 0) {
      return { success: false, error: "Trading account not found" };
    }

    const currentAccount = existingAccount[0];

    // Handle master account changes that require unlinking slaves
    const shouldUnlinkSlaves =
      currentAccount.accountType === "master" &&
      // Case 1: Master account number is being changed
      ((data.accountNumber &&
        data.accountNumber !== currentAccount.accountNumber) ||
        // Case 2: Account type is being changed from master to slave
        (data.accountType && data.accountType !== "master"));

    if (shouldUnlinkSlaves) {
      try {
        await unlinkSlaveAccountsFromMaster(currentAccount.accountNumber);
        console.log(
          `Successfully unlinked slaves from master account during update: ${currentAccount.accountNumber}`
        );
      } catch (unlinkError) {
        console.error(
          "Error unlinking slave accounts during update:",
          unlinkError
        );
        // Continue with update even if unlinking fails
        // This ensures the master account gets updated even if there's an issue with slaves
      }
    }

    const result = await db
      .update(tradingAccounts)
      .set({
        ...data,
        status: "pending",
        updatedAt: new Date(),
      })
      .where(eq(tradingAccounts.id, id))
      .returning();

    // Check if user has Managed VPS and notify admins
    // Do this in a try-catch so it doesn't fail the main operation
    try {
      await notifyAdminsIfManagedVPS(existingAccount[0].userId, {
        accountId: id,
        action: "updated",
        accountNumber: data.accountNumber || existingAccount[0].accountNumber,
        platform: data.platform || existingAccount[0].platform,
        accountType: data.accountType || existingAccount[0].accountType,
        timestamp: new Date(),
      });
    } catch (notificationError) {
      console.error(
        "Error sending admin notification during update:",
        notificationError
      );
      // Don't fail the update if notification fails
    }

    return { success: true, account: result[0] };
  } catch (error) {
    console.error("Error in updateTradingAccount:", error);
    return { success: false, error: "Failed to update trading account" };
  }
}

export async function deleteTradingAccount(id: number) {
  try {
    // Get the account to check user before deletion
    const existingAccount = await db
      .select()
      .from(tradingAccounts)
      .where(eq(tradingAccounts.id, id))
      .limit(1);

    if (existingAccount.length === 0) {
      return { success: false, error: "Trading account not found" };
    }

    const currentAccount = existingAccount[0];

    // If this is a master account, unlink all slave accounts connected to it
    if (currentAccount.accountType === "master") {
      try {
        await unlinkSlaveAccountsFromMaster(currentAccount.accountNumber);
        console.log(
          `Successfully unlinked slaves from master account: ${currentAccount.accountNumber}`
        );
      } catch (unlinkError) {
        console.error(
          "Error unlinking slave accounts during deletion:",
          unlinkError
        );
        // Continue with deletion even if unlinking fails
        // This ensures the master account gets deleted even if there's an issue with slaves
      }
    }

    // Soft delete by setting deletedAt
    const result = await db
      .update(tradingAccounts)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(tradingAccounts.id, id))
      .returning();

    // Check if user has Managed VPS and notify admins
    // Do this in a try-catch so it doesn't fail the main operation
    try {
      await notifyAdminsIfManagedVPS(existingAccount[0].userId, {
        accountId: id,
        action: "deleted",
        accountNumber: existingAccount[0].accountNumber,
        platform: existingAccount[0].platform,
        accountType: existingAccount[0].accountType,
        timestamp: new Date(),
      });
    } catch (notificationError) {
      console.error(
        "Error sending admin notification during deletion:",
        notificationError
      );
      // Don't fail the deletion if notification fails
    }

    return { success: true, account: result[0] };
  } catch (error) {
    console.error("Error in deleteTradingAccount:", error);
    return { success: false, error: "Failed to delete trading account" };
  }
}

// Helper function to notify admins if user has Managed VPS service
async function notifyAdminsIfManagedVPS(
  userId: string,
  updateDetails: {
    accountId?: number;
    action: "created" | "updated" | "deleted";
    accountNumber?: string;
    platform?: string;
    accountType?: string;
    timestamp: Date;
  }
) {
  try {
    // Get user information
    const userResult = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        planName: user.planName,
        subscriptionStatus: user.subscriptionStatus,
      })
      .from(user)
      .where(and(eq(user.id, userId), isNull(user.deletedAt)))
      .limit(1);

    if (userResult.length === 0) {
      console.log("User not found for notification");
      return;
    }

    const userInfo = userResult[0];

    // Check if user has Managed VPS service
    const isManagedVPS =
      userInfo.planName === "IPTRADE Managed VPS" &&
      (userInfo.subscriptionStatus === "active" ||
        userInfo.subscriptionStatus === "trialing" ||
        userInfo.subscriptionStatus === "admin_assigned");

    if (!isManagedVPS) {
      console.log(
        "User does not have Managed VPS service, skipping admin notification"
      );
      return;
    }

    // Get all admin users
    const admins = await getAdminUsers();

    if (admins.length === 0) {
      console.log("No admin users found for notification");
      return;
    }

    // Send notification to admins
    const { sendManagedVPSUpdateNotificationToAdmins } = await import(
      "@/lib/email/services"
    );

    const adminEmails = admins.map((admin) => ({
      email: admin.email,
      name: admin.name || admin.email.split("@")[0],
    }));

    await sendManagedVPSUpdateNotificationToAdmins({
      userInfo: {
        id: userInfo.id,
        name: userInfo.name || "",
        email: userInfo.email,
        planName: userInfo.planName || "",
      },
      updateDetails,
      adminEmails,
    });

    console.log(
      `Managed VPS user ${userInfo.email} ${updateDetails.action} account, admins notified`
    );
  } catch (error) {
    console.error("Error notifying admins about Managed VPS update:", error);
    // Don't throw error to avoid breaking the main operation
  }
}
