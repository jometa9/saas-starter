"use client";

import React, { useState, useRef } from "react";
import { User, TradingAccount } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Info,
  Loader2,
  Pencil,
  Save,
  X,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface AdminTradingAccountsViewProps {
  user: User;
  initialAccounts: TradingAccount[];
}

export function AdminTradingAccountsView({
  user,
  initialAccounts,
}: AdminTradingAccountsViewProps) {
  const [accounts, setAccounts] = useState<TradingAccount[]>(initialAccounts);
  const router = useRouter();
  const [collapsedMasters, setCollapsedMasters] = useState<
    Record<string, boolean>
  >({});
  const [loadingAccounts, setLoadingAccounts] = useState<
    Record<number, boolean>
  >({});
  const [serverIP, setServerIP] = useState<string>(
    user.serverIP || "192.168.1.100"
  );
  const [isEditingIP, setIsEditingIP] = useState<boolean>(false);
  const [savingIP, setSavingIP] = useState<boolean>(false);
  const ipInputRef = useRef<HTMLInputElement>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<number, boolean>
  >({});
  const [recentlyCopied, setRecentlyCopied] = useState<Record<string, boolean>>(
    {}
  );

  const getPlatformIcon = (platform: string) => {
    return (
      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
        <Monitor className="h-4 w-4 text-blue-700" />
      </div>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "synchronized":
        return (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
            <span>Synchronized</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-blue-500 mr-1.5" />
            <span>Pending</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center">
            <XCircle className="h-4 w-4 text-red-500 mr-1.5" />
            <span>Error</span>
          </div>
        );
      case "offline":
        return (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-gray-500 mr-1.5" />
            <span>Offline</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <Info className="h-4 w-4 text-gray-500 mr-1.5" />
            <span>Unknown</span>
          </div>
        );
    }
  };

  const handleGoBack = () => {
    router.push("/dashboard/managed-users");
  };

  // Calcular el número de cuentas en cada estado
  const getServerStatus = () => {
    const synchronizedCount = accounts.filter(
      (acc) => acc.status === "synchronized"
    ).length;
    const pendingCount = accounts.filter(
      (acc) => acc.status === "pending"
    ).length;
    const errorCount = accounts.filter(
      (acc) => acc.status === "error" || acc.status === "offline"
    ).length;
    const totalAccounts = accounts.length;

    if (totalAccounts === 0) {
      return "none";
    } else if (synchronizedCount === totalAccounts) {
      return "optimal";
    } else if (
      pendingCount >= errorCount &&
      pendingCount >= synchronizedCount
    ) {
      return "pending";
    } else if (errorCount >= pendingCount && errorCount >= synchronizedCount) {
      return "error";
    } else if (
      synchronizedCount > pendingCount &&
      synchronizedCount > errorCount
    ) {
      return "warning";
    } else {
      return "operational";
    }
  };

  // Función para actualizar el IP del servidor
  const updateServerIP = async (newIP: string) => {
    if (!newIP.trim()) return;

    try {
      setSavingIP(true);
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serverIP: newIP }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error updating server IP");
      }

      setServerIP(newIP);
      toast.success("Server IP updated successfully");
      setIsEditingIP(false);
    } catch (error) {
      
      toast.error(
        error instanceof Error ? error.message : "Error updating server IP"
      );
    } finally {
      setSavingIP(false);
    }
  };

  // Función para cancelar la edición del IP
  const cancelEditIP = () => {
    setIsEditingIP(false);
  };

  // Función para comenzar a editar el IP
  const startEditIP = () => {
    setIsEditingIP(true);
    // Focus en el input cuando aparece
    setTimeout(() => {
      if (ipInputRef.current) {
        ipInputRef.current.focus();
      }
    }, 100);
  };

  // Función para manejar la tecla Enter cuando se edita el IP
  const handleIPKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateServerIP(e.currentTarget.value);
    } else if (e.key === "Escape") {
      cancelEditIP();
    }
  };

  // Reemplazar la implementación de getServerIP
  const getServerIP = () => {
    return serverIP;
  };

  // Función para alternar el estado colapsado de una cuenta master
  const toggleMasterCollapse = (masterId: string) => {
    setCollapsedMasters((prev) => ({
      ...prev,
      [masterId]: !prev[masterId],
    }));
  };

  // Función para cambiar el estado de una cuenta
  const changeAccountStatus = async (accountId: number, newStatus: string) => {
    // Marcar esta cuenta como cargando
    setLoadingAccounts((prev) => ({ ...prev, [accountId]: true }));

    try {
      // Llamada a la API para actualizar el estado
      const response = await fetch(`/api/admin/trading-accounts/${accountId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al actualizar el estado de la cuenta"
        );
      }

      // Actualizar el estado local si la llamada fue exitosa
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc) =>
          acc.id === accountId ? { ...acc, status: newStatus } : acc
        )
      );

      toast.success(`Estado de cuenta cambiado a ${newStatus}`);
    } catch (error) {
      
      toast.error(
        error instanceof Error ? error.message : "Error al actualizar el estado"
      );
    } finally {
      // Quitar el estado de carga de esta cuenta
      setLoadingAccounts((prev) => {
        const newState = { ...prev };
        delete newState[accountId];
        return newState;
      });
    }
  };

  // Función para alternar la visibilidad de la contraseña de una cuenta
  const togglePasswordVisibility = (accountId: number) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  // Función para copiar al portapapeles
  const copyToClipboard = (
    text: string,
    fieldName: string,
    id: number,
    field: string
  ) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${fieldName} copiado al portapapeles`);

        // Establecer el estado para mostrar el icono de verificación
        const key = `${id}-${field}`;
        setRecentlyCopied((prev) => ({ ...prev, [key]: true }));

        // Restablecer después de 1.5 segundos
        setTimeout(() => {
          setRecentlyCopied((prev) => ({ ...prev, [key]: false }));
        }, 1500);
      })
      .catch((err) => {
        
        toast.error("No se pudo copiar al portapapeles");
      });
  };

  return (
    <div>
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Managed Users
        </Button>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No trading accounts configured yet.
          </p>
        </div>
      ) : (
        <div>
          <div
            className={`mb-4 border border-gray-200 rounded-xl overflow-hidden
            ${
              getServerStatus() === "optimal"
                ? "bg-green-50 border-green-200"
                : getServerStatus() === "warning"
                  ? "bg-yellow-50 border-yellow-200"
                  : getServerStatus() === "pending"
                    ? "bg-blue-50 border-blue-200"
                    : getServerStatus() === "error"
                      ? "bg-red-50 border-red-200"
                      : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between p-4 px-6">
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Server Status:
                </div>
                {(() => {
                  switch (getServerStatus()) {
                    case "optimal":
                      return <CheckCircle className="h-4 w-4 text-green-500" />;
                    case "warning":
                      return (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      );
                    case "pending":
                      return <Clock className="h-4 w-4 text-blue-500" />;
                    case "error":
                      return <XCircle className="h-4 w-4 text-red-500" />;
                    default:
                      return <Info className="h-4 w-4 text-gray-500" />;
                  }
                })()}
                <div className="text-sm font-medium">
                  {getServerStatus() === "optimal"
                    ? "All Synchronized"
                    : getServerStatus() === "warning"
                      ? "Mostly Synchronized"
                      : getServerStatus() === "pending"
                        ? "Mostly Pending"
                        : getServerStatus() === "error"
                          ? "Mostly Error"
                          : "No Accounts"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">Server IP:</div>
                {isEditingIP ? (
                  <div className="flex items-center gap-2">
                    <Input
                      ref={ipInputRef}
                      defaultValue={serverIP}
                      className="h-7 py-1 text-sm w-32"
                      onKeyDown={handleIPKeyDown}
                      disabled={savingIP}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() =>
                        updateServerIP(ipInputRef.current?.value || serverIP)
                      }
                      disabled={savingIP}
                    >
                      {savingIP ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Save className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={cancelEditIP}
                      disabled={savingIP}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="text-sm">{serverIP}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={startEditIP}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="border-b border-gray-200 mx-4"></div>
            <div className="flex flex-row items-center justify-between flex-wrap gap-4 p-4 px-6">
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Total Accounts:
                </div>
                <div className="font-medium">{accounts.length}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Master Accounts:
                </div>
                <div className="font-medium">
                  {
                    accounts.filter((acc) => acc.accountType === "master")
                      .length
                  }
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Slave Accounts:
                </div>
                <div className="font-medium">
                  {accounts.filter((acc) => acc.accountType === "slave").length}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Synchronized:
                </div>
                <div className="font-medium text-green-600">
                  {
                    accounts.filter((acc) => acc.status === "synchronized")
                      .length
                  }
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">Pending:</div>
                <div className="font-medium text-blue-600">
                  {accounts.filter((acc) => acc.status === "pending").length}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Invalid/Error:
                </div>
                <div className="font-medium text-red-600">
                  {
                    accounts.filter(
                      (acc) =>
                        acc.status === "error" || acc.status === "offline"
                    ).length
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="bg-muted/50 ronded-t-xl">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase align-middle">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase align-middle">
                    Account
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase align-middle">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase align-middle">
                    Platform
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase align-middle">
                    Server
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase align-middle">
                    Password
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase align-middle">
                    Configuration
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase align-middle">
                    Copying
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase align-middle">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-gray-200">
                {/* First display master accounts */}
                {accounts
                  .filter((account) => account.accountType === "master")
                  .map((masterAccount) => (
                    <React.Fragment key={`master-group-${masterAccount.id}`}>
                      {/* Master account row with highlight */}
                      <tr
                        className="bg-blue-50 hover:bg-blue-100 cursor-pointer"
                        onClick={(e) => {
                          if (
                            !(e.target as HTMLElement).closest(
                              ".actions-column"
                            )
                          ) {
                            toggleMasterCollapse(masterAccount.id.toString());
                          }
                        }}
                      >
                        <td className="px-4 py-2 whitespace-nowrap align-middle text-left">
                          <div className="flex items-center">
                            <span
                              className={
                                masterAccount.status === "synchronized"
                                  ? "text-green-600 text-sm"
                                  : masterAccount.status === "pending"
                                    ? "text-blue-600 text-sm"
                                    : "text-red-600 text-sm"
                              }
                            >
                              {masterAccount.status === "synchronized"
                                ? "Synced"
                                : masterAccount.status === "pending"
                                  ? "Pending"
                                  : "Invalid"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm align-middle">
                          <div className="flex items-center">
                            <span>{masterAccount.accountNumber}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(
                                  masterAccount.accountNumber,
                                  "Número de cuenta",
                                  masterAccount.id,
                                  "accountNumber"
                                );
                              }}
                              title="Copiar número de cuenta"
                            >
                              {recentlyCopied[
                                `${masterAccount.id}-accountNumber`
                              ] ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-yellow-700 align-middle">
                          Master
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm align-middle">
                          {masterAccount.platform === "mt4"
                            ? "MetaTrader 4"
                            : masterAccount.platform === "mt5"
                              ? "MetaTrader 5"
                              : masterAccount.platform}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm align-middle">
                          <div className="flex items-center">
                            <span>{masterAccount.server}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(
                                  masterAccount.server,
                                  "Servidor",
                                  masterAccount.id,
                                  "server"
                                );
                              }}
                              title="Copiar servidor"
                            >
                              {recentlyCopied[`${masterAccount.id}-server`] ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm align-middle">
                          <div className="flex items-center space-x-1">
                            <span>
                              {visiblePasswords[masterAccount.id]
                                ? masterAccount.password
                                : "••••••••"}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePasswordVisibility(masterAccount.id);
                              }}
                              title={
                                visiblePasswords[masterAccount.id]
                                  ? "Hide Password"
                                  : "Show Password"
                              }
                            >
                              {visiblePasswords[masterAccount.id] ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(
                                  masterAccount.password,
                                  "Contraseña",
                                  masterAccount.id,
                                  "password"
                                );
                              }}
                              title="Copiar contraseña"
                            >
                              {recentlyCopied[
                                `${masterAccount.id}-password`
                              ] ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap align-middle">
                          {accounts.filter(
                            (acc) =>
                              acc.connectedToMaster ===
                              masterAccount.accountNumber
                          ).length > 0 ? (
                            <div className="rounded-full px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 inline-block">
                              {
                                accounts.filter(
                                  (acc) =>
                                    acc.connectedToMaster ===
                                    masterAccount.accountNumber
                                ).length
                              }{" "}
                              slave
                              {accounts.filter(
                                (acc) =>
                                  acc.connectedToMaster ===
                                  masterAccount.accountNumber
                              ).length > 1
                                ? "s"
                                : ""}{" "}
                              connected
                            </div>
                          ) : (
                            <div className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-600 inline-block">
                              No slaves connected
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap align-middle">
                          <div className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-600 inline-block">
                            N/A
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap align-middle actions-column">
                          {loadingAccounts[masterAccount.id] ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              disabled
                            >
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </Button>
                          ) : (
                            <div className="flex space-x-2">
                              {masterAccount.status !== "synchronized" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    changeAccountStatus(
                                      masterAccount.id,
                                      "synchronized"
                                    );
                                  }}
                                  title="Set Synchronized"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                              )}
                              {masterAccount.status !== "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    changeAccountStatus(
                                      masterAccount.id,
                                      "pending"
                                    );
                                  }}
                                  title="Set Pending"
                                >
                                  <Clock className="h-4 w-4 text-blue-600" />
                                </Button>
                              )}
                              {masterAccount.status !== "error" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    changeAccountStatus(
                                      masterAccount.id,
                                      "error"
                                    );
                                  }}
                                  title="Set Error"
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              )}
                              {masterAccount.status !== "offline" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    changeAccountStatus(
                                      masterAccount.id,
                                      "offline"
                                    );
                                  }}
                                  title="Set Offline"
                                >
                                  <AlertCircle className="h-4 w-4 text-gray-600" />
                                </Button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Slave accounts related to this master (with indentation) */}
                      {!collapsedMasters[masterAccount.id.toString()] &&
                        accounts
                          .filter(
                            (acc) =>
                              acc.accountType === "slave" &&
                              acc.connectedToMaster ===
                                masterAccount.accountNumber
                          )
                          .map((slaveAccount) => (
                            <tr
                              key={slaveAccount.id}
                              className="bg-white hover:bg-muted/50"
                            >
                              <td className="px-4 py-1.5 whitespace-nowrap align-middle">
                                <span
                                  className={
                                    slaveAccount.status === "synchronized"
                                      ? "text-green-600 text-sm"
                                      : slaveAccount.status === "pending"
                                        ? "text-blue-600 text-sm"
                                        : "text-red-600 text-sm"
                                  }
                                >
                                  {slaveAccount.status === "synchronized"
                                    ? "Synced"
                                    : slaveAccount.status === "pending"
                                      ? "Pending"
                                      : "Invalid"}
                                </span>
                              </td>
                              <td className="px-4 py-1.5 whitespace-nowrap text-sm align-middle">
                                <div className="flex items-center">
                                  <span>{slaveAccount.accountNumber}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 ml-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(
                                        slaveAccount.accountNumber,
                                        "Número de cuenta",
                                        slaveAccount.id,
                                        "accountNumber"
                                      );
                                    }}
                                    title="Copiar número de cuenta"
                                  >
                                    {recentlyCopied[
                                      `${slaveAccount.id}-accountNumber`
                                    ] ? (
                                      <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              </td>
                              <td className="px-4 py-1.5 whitespace-nowrap text-sm text-green-700 align-middle">
                                Slave
                              </td>
                              <td className="px-4 py-1.5 whitespace-nowrap text-sm align-middle">
                                {slaveAccount.platform === "mt4"
                                  ? "MetaTrader 4"
                                  : slaveAccount.platform === "mt5"
                                    ? "MetaTrader 5"
                                    : slaveAccount.platform}
                              </td>
                              <td className="px-4 py-1.5 whitespace-nowrap text-sm align-middle">
                                <div className="flex items-center">
                                  <span>{slaveAccount.server}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 ml-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(
                                        slaveAccount.server,
                                        "Servidor",
                                        slaveAccount.id,
                                        "server"
                                      );
                                    }}
                                    title="Copiar servidor"
                                  >
                                    {recentlyCopied[
                                      `${slaveAccount.id}-server`
                                    ] ? (
                                      <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              </td>
                              <td className="px-4 py-1.5 whitespace-nowrap text-sm align-middle">
                                <div className="flex items-center space-x-1">
                                  <span>
                                    {visiblePasswords[slaveAccount.id]
                                      ? slaveAccount.password
                                      : "••••••••"}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 ml-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      togglePasswordVisibility(slaveAccount.id);
                                    }}
                                    title={
                                      visiblePasswords[slaveAccount.id]
                                        ? "Hide Password"
                                        : "Show Password"
                                    }
                                  >
                                    {visiblePasswords[slaveAccount.id] ? (
                                      <EyeOff className="h-3 w-3" />
                                    ) : (
                                      <Eye className="h-3 w-3" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(
                                        slaveAccount.password,
                                        "Contraseña",
                                        slaveAccount.id,
                                        "password"
                                      );
                                    }}
                                    title="Copiar contraseña"
                                  >
                                    {recentlyCopied[
                                      `${slaveAccount.id}-password`
                                    ] ? (
                                      <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              </td>
                              <td className="px-4 py-1.5 whitespace-nowrap text-xs align-middle">
                                <div className="flex gap-2">
                                  {(() => {
                                    // Crear array de etiquetas
                                    const configLabels = [];

                                    if (
                                      slaveAccount.forceLot &&
                                      parseFloat(
                                        String(slaveAccount.forceLot)
                                      ) > 0
                                    ) {
                                      configLabels.push(
                                        <div
                                          key="force"
                                          className="rounded-full px-2 py-0.5 text-xs bg-blue-100 text-blue-800 inline-block"
                                        >
                                          Force lot {slaveAccount.forceLot}
                                        </div>
                                      );
                                    } else if (slaveAccount.lotCoefficient) {
                                      configLabels.push(
                                        <div
                                          key="lot"
                                          className="rounded-full px-2 py-0.5 text-xs bg-green-100 text-green-800 inline-block"
                                        >
                                          Lot multiplier{" "}
                                          {slaveAccount.lotCoefficient}
                                        </div>
                                      );
                                    }

                                    if (slaveAccount.reverseTrade) {
                                      configLabels.push(
                                        <div
                                          key="reverse"
                                          className="rounded-full px-2 py-0.5 text-xs bg-purple-100 text-purple-800 inline-block"
                                        >
                                          Reverse trades
                                        </div>
                                      );
                                    }

                                    // Limitar número de etiquetas visibles
                                    const maxLabels = 2;
                                    const visibleLabels = configLabels.slice(
                                      0,
                                      maxLabels
                                    );
                                    const hiddenCount =
                                      configLabels.length - maxLabels;

                                    return (
                                      <>
                                        {visibleLabels}
                                        {hiddenCount > 0 && (
                                          <div className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-800 inline-block">
                                            +{hiddenCount} more
                                          </div>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              </td>
                              <td className="px-4 py-1.5 whitespace-nowrap text-sm align-middle">
                                <div className="flex items-center">
                                  <div className="rounded-full px-2 py-0.5 text-xs bg-green-100 text-green-800 inline-block flex items-center gap-1">
                                    Master: {slaveAccount.connectedToMaster}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-1.5 whitespace-nowrap align-middle actions-column">
                                {loadingAccounts[slaveAccount.id] ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    disabled
                                  >
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  </Button>
                                ) : (
                                  <div className="flex space-x-2">
                                    {slaveAccount.status !== "synchronized" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                        onClick={(e) =>
                                          changeAccountStatus(
                                            slaveAccount.id,
                                            "synchronized"
                                          )
                                        }
                                        title="Set Synchronized"
                                      >
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      </Button>
                                    )}
                                    {slaveAccount.status !== "pending" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                        onClick={(e) =>
                                          changeAccountStatus(
                                            slaveAccount.id,
                                            "pending"
                                          )
                                        }
                                        title="Set Pending"
                                      >
                                        <Clock className="h-4 w-4 text-blue-600" />
                                      </Button>
                                    )}
                                    {slaveAccount.status !== "error" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                        onClick={(e) =>
                                          changeAccountStatus(
                                            slaveAccount.id,
                                            "error"
                                          )
                                        }
                                        title="Set Error"
                                      >
                                        <XCircle className="h-4 w-4 text-red-600" />
                                      </Button>
                                    )}
                                    {slaveAccount.status !== "offline" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                        onClick={(e) =>
                                          changeAccountStatus(
                                            slaveAccount.id,
                                            "offline"
                                          )
                                        }
                                        title="Set Offline"
                                      >
                                        <AlertCircle className="h-4 w-4 text-gray-600" />
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                    </React.Fragment>
                  ))}

                {/* Show slave accounts not connected to any master at the end */}
                {accounts
                  .filter(
                    (account) =>
                      account.accountType === "slave" &&
                      (!account.connectedToMaster ||
                        account.connectedToMaster === "" ||
                        account.connectedToMaster === "none")
                  )
                  .map((orphanSlave) => (
                    <tr
                      key={orphanSlave.id}
                      className="hover:bg-muted/50 bg-gray-50"
                    >
                      <td className="px-4 py-2 whitespace-nowrap align-middle text-left">
                        <span
                          className={
                            orphanSlave.status === "synchronized"
                              ? "text-green-600 text-sm"
                              : orphanSlave.status === "pending"
                                ? "text-blue-600 text-sm"
                                : "text-red-600 text-sm"
                          }
                        >
                          {orphanSlave.status === "synchronized"
                            ? "Synced"
                            : orphanSlave.status === "pending"
                              ? "Pending"
                              : "Invalid"}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm align-middle">
                        <div className="flex items-center">
                          <span>{orphanSlave.accountNumber}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(
                                orphanSlave.accountNumber,
                                "Número de cuenta",
                                orphanSlave.id,
                                "accountNumber"
                              );
                            }}
                            title="Copiar número de cuenta"
                          >
                            {recentlyCopied[
                              `${orphanSlave.id}-accountNumber`
                            ] ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm align-middle">
                        <span className="text-orange-600">
                          Slave (Unconnected)
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm align-middle">
                        {orphanSlave.platform === "mt4"
                          ? "MetaTrader 4"
                          : orphanSlave.platform === "mt5"
                            ? "MetaTrader 5"
                            : orphanSlave.platform}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm align-middle">
                        <div className="flex items-center">
                          <span>{orphanSlave.server}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(
                                orphanSlave.server,
                                "Servidor",
                                orphanSlave.id,
                                "server"
                              );
                            }}
                            title="Copiar servidor"
                          >
                            {recentlyCopied[`${orphanSlave.id}-server`] ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm align-middle">
                        <div className="flex items-center space-x-1">
                          <span>
                            {visiblePasswords[orphanSlave.id]
                              ? orphanSlave.password
                              : "••••••••"}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePasswordVisibility(orphanSlave.id);
                            }}
                            title={
                              visiblePasswords[orphanSlave.id]
                                ? "Hide Password"
                                : "Show Password"
                            }
                          >
                            {visiblePasswords[orphanSlave.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(
                                orphanSlave.password,
                                "Contraseña",
                                orphanSlave.id,
                                "password"
                              );
                            }}
                            title="Copiar contraseña"
                          >
                            {recentlyCopied[`${orphanSlave.id}-password`] ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs align-middle">
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            // Crear array de etiquetas
                            const configLabels = [];

                            configLabels.push(
                              <div
                                key="unconnected"
                                className="rounded-full px-2 py-0.5 text-xs bg-orange-100 text-orange-800 inline-block"
                              >
                                Not connected
                              </div>
                            );

                            if (
                              orphanSlave.forceLot &&
                              parseFloat(String(orphanSlave.forceLot)) > 0
                            ) {
                              configLabels.push(
                                <div
                                  key="force"
                                  className="rounded-full px-2 py-0.5 text-xs bg-blue-100 text-blue-800 inline-block"
                                >
                                  Force lot {orphanSlave.forceLot}
                                </div>
                              );
                            } else if (orphanSlave.lotCoefficient) {
                              configLabels.push(
                                <div
                                  key="lot"
                                  className="rounded-full px-2 py-0.5 text-xs bg-green-100 text-green-800 inline-block"
                                >
                                  Lot multiplier {orphanSlave.lotCoefficient}
                                </div>
                              );
                            }

                            if (orphanSlave.reverseTrade) {
                              configLabels.push(
                                <div
                                  key="reverse"
                                  className="rounded-full px-2 py-0.5 text-xs bg-purple-100 text-purple-800 inline-block"
                                >
                                  Reverse trades
                                </div>
                              );
                            }

                            // Limitar número de etiquetas visibles
                            const maxLabels = 2;
                            const visibleLabels = configLabels.slice(
                              0,
                              maxLabels
                            );
                            const hiddenCount = configLabels.length - maxLabels;

                            return (
                              <>
                                {visibleLabels}
                                {hiddenCount > 0 && (
                                  <div className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-800 inline-block">
                                    +{hiddenCount} more
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm align-middle">
                        <div className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-600 inline-block">
                          Not copying
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap align-middle actions-column">
                        {loadingAccounts[orphanSlave.id] ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled
                          >
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </Button>
                        ) : (
                          <div className="flex space-x-2">
                            {orphanSlave.status !== "synchronized" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                onClick={() =>
                                  changeAccountStatus(
                                    orphanSlave.id,
                                    "synchronized"
                                  )
                                }
                                title="Set Synchronized"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            {orphanSlave.status !== "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                onClick={() =>
                                  changeAccountStatus(orphanSlave.id, "pending")
                                }
                                title="Set Pending"
                              >
                                <Clock className="h-4 w-4 text-blue-600" />
                              </Button>
                            )}
                            {orphanSlave.status !== "error" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                onClick={() =>
                                  changeAccountStatus(orphanSlave.id, "error")
                                }
                                title="Set Error"
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                            {orphanSlave.status !== "offline" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                onClick={() =>
                                  changeAccountStatus(orphanSlave.id, "offline")
                                }
                                title="Set Offline"
                              >
                                <AlertCircle className="h-4 w-4 text-gray-600" />
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
