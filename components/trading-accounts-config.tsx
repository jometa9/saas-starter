"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/lib/db/schema";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Info,
  Monitor,
  Pencil,
  RefreshCw,
  Trash,
  XCircle,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export function TradingAccountsConfig({ user }: { user: User }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState<string | null>(
    null
  ); // Track which account is being deleted
  const [accounts, setAccounts] = useState<
    Array<{
      id: string;
      accountNumber: string;
      platform: string;
      server: string;
      password: string;
      copyingTo: string[];
      accountType: string;
      status: string;
      lotCoefficient?: number;
      forceLot?: number;
      reverseTrade?: boolean;
      connectedToMaster?: string;
    }>
  >([]);

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Define fetchAccounts as a reusable function
  const fetchAccounts = async (showLoadingState = false) => {
    try {
      if (showLoadingState) {
        setIsLoading(true);
      }

      console.log("Fetching trading accounts...");
      const response = await fetch("/api/trading-accounts");

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch trading accounts");
      }

      const data = await response.json();
      console.log("Fetched accounts data:", data);

      if (data.accounts && data.accounts.length > 0) {
        // Convert numeric IDs to strings and ensure copyingTo exists
        const formattedAccounts = data.accounts.map((account: any) => ({
          ...account,
          id: account.id.toString(),
          password: "••••••••",
          copyingTo: account.copyingTo || [],
        }));
        setAccounts(formattedAccounts);
        console.log(
          `Updated accounts state with ${formattedAccounts.length} accounts`
        );
      } else {
        setAccounts([]);
        console.log("No accounts found, setting empty array");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      if (showLoadingState) {
        toast({
          title: "Error",
          description: "Failed to load trading accounts. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  };

  // Add useEffect to fetch accounts from API on component mount
  useEffect(() => {
    fetchAccounts(true); // Show loading state on initial load
  }, []);

  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    accountNumber: "",
    platform: "mt4",
    serverIp: "",
    password: "",
    accountType: "master",
    status: "synchronized",
    lotCoefficient: 1,
    forceLot: 0,
    reverseTrade: false,
    connectedToMaster: "none",
  });

  // Check if user is administrator
  const isAdmin = user.role === "admin" || user.role === "superadmin";

  // Check if user has Managed VPS plan
  const isManagedVPS = user.planName === "IPTRADE Managed VPS";

  // Platform options
  const platformOptions = [
    { value: "mt4", label: "MetaTrader 4" },
    { value: "mt5", label: "MetaTrader 5" },
  ];

  // Account types
  const accountTypeOptions = [
    { value: "master", label: "Master Account (Signal Provider)" },
    { value: "slave", label: "Slave Account (Signal Follower)" },
  ];

  // Server options by platform (could be fetched from API)
  const serverOptions = {
    mt4: [
      { value: "ICMarkets-Live1", label: "IC Markets Live 1" },
      { value: "ICMarkets-Live2", label: "IC Markets Live 2" },
      { value: "ICMarkets-Demo", label: "IC Markets Demo" },
      { value: "Pepperstone-Live", label: "Pepperstone Live" },
      { value: "Pepperstone-Demo", label: "Pepperstone Demo" },
    ],
    mt5: [
      { value: "ICMarkets-MT5-Live", label: "IC Markets MT5 Live" },
      { value: "ICMarkets-MT5-Demo", label: "IC Markets MT5 Demo" },
      { value: "FXCM-Real", label: "FXCM Real" },
      { value: "FXCM-Demo", label: "FXCM Demo" },
    ],
    ctrader: [
      { value: "Pepperstone-cTrader", label: "Pepperstone cTrader" },
      { value: "ICMarkets-cTrader", label: "IC Markets cTrader" },
    ],
  };

  // Function to get available accounts for copying to
  const getAvailableAccountsForCopying = (currentAccountId: string) => {
    return accounts
      .filter((acc) => acc.id !== currentAccountId)
      .map((acc) => ({
        value: acc.accountNumber,
        label: `${acc.platform.toUpperCase()} - ${acc.accountNumber} (${acc.server})`,
      }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "accountType" && value === "master") {
      // When changing to master account type, automatically set status to synchronized
      setFormState({ ...formState, [name]: value, status: "synchronized" });
    } else {
      setFormState({ ...formState, [name]: value });
    }
  };

  // New function to handle platform changes
  const handlePlatformChange = (value: string) => {
    setFormState({
      ...formState,
      platform: value,
      serverIp: "", // Reset server when platform changes
    });
  };

  const handleAddAccount = () => {
    setIsAddingAccount(true);
    setEditingAccount(null);
    setShowPassword(false);
    setFormState({
      accountNumber: "",
      platform: "mt4",
      serverIp: "",
      password: "",
      accountType: "master",
      status: "synchronized",
      lotCoefficient: 1,
      forceLot: 0,
      reverseTrade: false,
      connectedToMaster: "none",
    });
  };

  // Referencia para el formulario
  const formRef = React.useRef<HTMLDivElement>(null);

  const handleEditAccount = async (account: any) => {
    setIsAddingAccount(true);
    setEditingAccount(account);

    // Fetch the real password from the database
    let realPassword = "";
    try {
      const response = await fetch(`/api/trading-accounts/${account.id}`);
      if (response.ok) {
        const data = await response.json();
        realPassword = data.account?.password || "";
      }
    } catch (error) {
      console.log("Could not fetch password:", error);
    }

    setFormState({
      accountNumber: account.accountNumber,
      platform: account.platform,
      serverIp: account.server,
      password: realPassword, // Load the actual password
      accountType: account.accountType,
      status: account.status,
      lotCoefficient: account.lotCoefficient || 1,
      forceLot: account.forceLot || 0,
      reverseTrade: account.reverseTrade || false,
      connectedToMaster: account.connectedToMaster
        ? account.connectedToMaster
        : "none",
    });

    // Scroll to the form after a short delay to allow the DOM to update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleDeleteAccount = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDeleteAccount = async () => {
    if (deleteConfirmId) {
      try {
        setIsSubmitting(true);
        setIsDeletingAccount(deleteConfirmId); // Set which account is being deleted

        // Check if the account being deleted is a master
        const accountToDelete = accounts.find(
          (acc) => acc.id === deleteConfirmId
        );
        const isMaster =
          accountToDelete && accountToDelete.accountType === "master";
        const masterAccountNumber = accountToDelete?.accountNumber;
        const connectedSlaves = accounts.filter(
          (acc) =>
            acc.accountType === "slave" &&
            acc.connectedToMaster === masterAccountNumber
        );

        console.log(`Attempting to delete account:`, {
          id: deleteConfirmId,
          accountNumber: masterAccountNumber,
          isMaster,
          connectedSlavesCount: connectedSlaves.length,
        });

        const response = await fetch(
          `/api/trading-accounts/${deleteConfirmId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const error = await response.json();
          console.error("Delete API response error:", error);
          throw new Error(error.error || "Failed to delete trading account");
        }

        const responseData = await response.json();
        console.log("Delete API success response:", responseData);

        // Refresh accounts to get updated state from backend
        console.log("Refreshing accounts after deletion...");
        await fetchAccounts(); // This will handle its own errors internally
        console.log("Accounts refreshed successfully");

        toast({
          title: "Account Deleted",
          description:
            isMaster && connectedSlaves.length > 0
              ? `The master account has been removed and ${connectedSlaves.length} slave accounts have been unlinked.`
              : "The account has been removed successfully.",
        });
      } catch (error) {
        console.error("Error in confirmDeleteAccount:", error);
        toast({
          title: "Error",
          description: "Failed to delete trading account. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
        setIsDeletingAccount(null);
        setDeleteConfirmId(null);
      }
    }
  };

  const cancelDeleteAccount = () => {
    setDeleteConfirmId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formState.accountNumber || !formState.serverIp) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare payload for API
      const payload = {
        accountNumber: formState.accountNumber,
        platform: formState.platform,
        server: formState.serverIp, // Map serverIp to server for API
        password: formState.password,
        accountType: formState.accountType,
        status: formState.status,
        ...(formState.accountType === "slave" && {
          lotCoefficient: Number(formState.lotCoefficient),
          forceLot: Number(formState.forceLot),
          reverseTrade: formState.reverseTrade,
          connectedToMaster:
            formState.connectedToMaster === "none"
              ? ""
              : formState.connectedToMaster,
        }),
      };

      let response, data;

      if (editingAccount) {
        // Update existing account
        response = await fetch(`/api/trading-accounts/${editingAccount.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        data = await response.json();

        if (!response.ok) {
          let errorMessage = "Failed to update trading account";
          try {
            if (data && typeof data === "object") {
              // Specifically handle Zod validation errors
              if (
                data._errors ||
                (data.error &&
                  typeof data.error === "object" &&
                  data.error._errors)
              ) {
                const zodErrors = data._errors || data.error._errors;
                if (Array.isArray(zodErrors) && zodErrors.length > 0) {
                  errorMessage = zodErrors.join(", ");
                } else {
                  // Check for specific field errors
                  const fieldErrors = [];
                  for (const [field, value] of Object.entries(data)) {
                    if (
                      value &&
                      typeof value === "object" &&
                      "_errors" in value
                    ) {
                      fieldErrors.push(`${field}: ${value._errors.join(", ")}`);
                    }
                  }
                  if (fieldErrors.length > 0) {
                    errorMessage = `Validation errors: ${fieldErrors.join("; ")}`;
                  }
                }
              } else if ("error" in data) {
                if (typeof data.error === "string") {
                  errorMessage = data.error;
                } else if (typeof data.error === "object") {
                  // Try to extract a more meaningful message or convert to JSON
                  errorMessage =
                    data.error.message || JSON.stringify(data.error);
                }
              }
            }
          } catch (e) {}
          throw new Error(errorMessage);
        }

        // Update state with the response
        setAccounts(
          accounts.map((acc) =>
            acc.id === editingAccount.id
              ? {
                  ...acc,
                  server: formState.serverIp,
                  accountNumber: formState.accountNumber,
                  platform: formState.platform,
                  password: formState.password ? "••••••••" : acc.password,
                  accountType: formState.accountType,
                  status: formState.status,
                  connectedToMaster:
                    formState.accountType === "slave"
                      ? formState.connectedToMaster === "none"
                        ? ""
                        : formState.connectedToMaster
                      : undefined,
                  lotCoefficient:
                    formState.accountType === "slave"
                      ? formState.lotCoefficient
                      : undefined,
                  forceLot:
                    formState.accountType === "slave"
                      ? formState.forceLot
                      : undefined,
                  reverseTrade:
                    formState.accountType === "slave"
                      ? formState.reverseTrade
                      : undefined,
                }
              : acc
          )
        );

        // Refresh accounts after successful update
        await fetchAccounts();

        toast({
          title: "Account Updated",
          description: "Your trading account has been updated successfully.",
        });
      } else {
        // Create new account
        response = await fetch("/api/trading-accounts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        data = await response.json();

        if (!response.ok) {
          let errorMessage = "Failed to create trading account";
          try {
            if (data && typeof data === "object") {
              // Specifically handle Zod validation errors
              if (
                data._errors ||
                (data.error &&
                  typeof data.error === "object" &&
                  data.error._errors)
              ) {
                const zodErrors = data._errors || data.error._errors;
                if (Array.isArray(zodErrors) && zodErrors.length > 0) {
                  errorMessage = zodErrors.join(", ");
                } else {
                  // Check for specific field errors
                  const fieldErrors = [];
                  for (const [field, value] of Object.entries(data)) {
                    if (
                      value &&
                      typeof value === "object" &&
                      "_errors" in value
                    ) {
                      fieldErrors.push(`${field}: ${value._errors.join(", ")}`);
                    }
                  }
                  if (fieldErrors.length > 0) {
                    errorMessage = `Validation errors: ${fieldErrors.join("; ")}`;
                  }
                }
              } else if ("error" in data) {
                if (typeof data.error === "string") {
                  errorMessage = data.error;
                } else if (typeof data.error === "object") {
                  // Try to extract a more meaningful message or convert to JSON
                  errorMessage =
                    data.error.message || JSON.stringify(data.error);
                }
              }
            }
          } catch (e) {}
          throw new Error(errorMessage);
        }

        // Add the new account to state
        setAccounts([
          ...accounts,
          {
            ...data.account,
            id: data.account.id.toString(), // Convert numeric ID to string
            password: "••••••••",
            copyingTo: [],
            accountType: formState.accountType,
            status: formState.status,
            ...(formState.accountType === "slave" && {
              lotCoefficient: formState.lotCoefficient,
              forceLot: formState.forceLot,
              reverseTrade: formState.reverseTrade,
              connectedToMaster:
                formState.connectedToMaster === "none"
                  ? ""
                  : formState.connectedToMaster,
            }),
          },
        ]);

        // Refresh accounts after successful creation
        await fetchAccounts();

        toast({
          title: "Account Added",
          description: "Your new trading account has been added successfully.",
        });
      }

      // Reset form and state
      setIsAddingAccount(false);
      setEditingAccount(null);
      setShowPassword(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsAddingAccount(false);
    setEditingAccount(null);
    setShowPassword(false);
  };

  const handleRefreshAccounts = async () => {
    try {
      setIsRefreshing(true);
      await fetchAccounts(); // Use the reusable function

      toast({
        title: "Accounts Refreshed",
        description: "Trading accounts have been updated successfully.",
      });
    } catch (error) {
      console.error("Error refreshing accounts:", error);
      toast({
        title: "Error",
        description: "Failed to refresh trading accounts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "mt4":
        return (
          <div className="bg-blue-100 p-1 rounded">
            <img
              src="/assets/mt4.png"
              alt="MT4"
              className="w-5 h-5 object-contain"
            />
          </div>
        );
      case "mt5":
        return (
          <div className="bg-blue-100 p-1 rounded">
            <img
              src="/assets/mt5.png"
              alt="MT5"
              className="w-5 h-5 object-contain"
            />
          </div>
        );
      default:
        return <Monitor className="h-5 w-5 text-blue-500" />;
    }
  };

  const getServerStatus = () => {
    // Calculate the number of accounts in each status
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

    // Determine server status based on rules
    if (totalAccounts === 0) {
      return "none"; // Sin cuentas
    } else if (synchronizedCount === totalAccounts) {
      return "optimal"; // Todas sincronizadas - VERDE
    } else if (
      pendingCount >= errorCount &&
      pendingCount >= synchronizedCount
    ) {
      return "pending"; // Majority pending - BLUE
    } else if (errorCount >= pendingCount && errorCount >= synchronizedCount) {
      return "error"; // Majority with error - RED
    } else if (
      synchronizedCount > pendingCount &&
      synchronizedCount > errorCount
    ) {
      return "warning"; // Majority synchronized but there are pending or errors - YELLOW
    } else {
      return "operational"; // Estado por defecto
    }
  };

  const getServerIP = () => {
    // Obtener la IP del servidor desde los datos del usuario
    return user.serverIP || "Waiting for configuration"; // Mostrar mensaje cuando no hay IP configurada
  };

  const [selectedPlatform, setSelectedPlatform] = useState<string>("mt4");

  useEffect(() => {
    if (formState.platform) {
      setSelectedPlatform(formState.platform);
    }
  }, [formState.platform]);

  // New state to track which master accounts are collapsed
  const [collapsedMasters, setCollapsedMasters] = useState<
    Record<string, boolean>
  >({});

  // Function to toggle the collapsed state of a master account
  const toggleMasterCollapse = (masterId: string) => {
    setCollapsedMasters((prev) => ({
      ...prev,
      [masterId]: !prev[masterId],
    }));
  };

  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Function to handle table scroll and show shadows when necessary
  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const isScrolledRight =
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 10;
    const isScrolledLeft = container.scrollLeft <= 10;

    if (tableContainerRef.current) {
      if (!isScrolledLeft) {
        tableContainerRef.current.classList.add("shadow-left");
      } else {
        tableContainerRef.current.classList.remove("shadow-left");
      }

      if (!isScrolledRight) {
        tableContainerRef.current.classList.add("shadow-right");
      } else {
        tableContainerRef.current.classList.remove("shadow-right");
      }
    }
  };

  // Add effect to initialize shadows
  useEffect(() => {
    if (tableContainerRef.current) {
      const container = tableContainerRef.current;
      const isScrollable = container.scrollWidth > container.clientWidth;

      if (isScrollable) {
        const isScrolledRight =
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 10;
        const isScrolledLeft = container.scrollLeft <= 10;

        if (!isScrolledLeft) {
          container.classList.add("shadow-left");
        }

        if (!isScrolledRight) {
          container.classList.add("shadow-right");
        }
      }
    }
  }, [accounts]); // Run when accounts list changes

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Trading Accounts Configuration</CardTitle>
            <CardDescription>
              Manage your trading accounts and copy trading configuration (up to
              50 accounts)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              onClick={handleRefreshAccounts}
              variant="outline"
              r
              disabled={isRefreshing || isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
            <Button onClick={handleAddAccount} disabled={accounts.length >= 50}>
              Add Trading Account
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
                    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
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
              <div className="text-sm">
                {user.serverIP ? (
                  getServerIP()
                ) : (
                  <span className="text-yellow-600">
                    Waiting for admin configuration
                  </span>
                )}
              </div>
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
                {accounts.filter((acc) => acc.accountType === "master").length}
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
              <div className="text-sm text-muted-foreground">Synchronized:</div>
              <div className="font-medium text-green-600">
                {accounts.filter((acc) => acc.status === "synchronized").length}
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
                    (acc) => acc.status === "error" || acc.status === "offline"
                  ).length
                }
              </div>
            </div>
          </div>
        </div>

        {isAddingAccount && (
          <div
            ref={formRef}
            className={`mb-4 p-4 border rounded-xl ${
              formState.accountType === "master"
                ? "border-blue-200 bg-blue-50"
                : "border-green-200 bg-green-50"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h3
                className={`text-lg font-medium ${
                  formState.accountType === "master"
                    ? "text-blue-700"
                    : "text-green-700"
                }`}
              >
                {editingAccount
                  ? "Edit Trading Account"
                  : "Add New Trading Account"}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                className="h-8 w-8 p-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={
                    formState.accountType === "master"
                      ? "text-blue-700"
                      : "text-green-700"
                  }
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span className="sr-only">Close</span>
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={formState.accountNumber}
                    onChange={handleChange}
                    placeholder="12345678"
                    required
                    className="bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    name="platform"
                    value={formState.platform}
                    onValueChange={(value) => handlePlatformChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="serverIp">Server IP/Name</Label>
                  <Input
                    id="serverIp"
                    name="serverIp"
                    value={formState.serverIp}
                    onChange={handleChange}
                    placeholder="Enter server IP or hostname"
                    required
                    className="bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="password">
                    Password {editingAccount && "(loaded from account)"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formState.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required={!editingAccount}
                      className="bg-white pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100 focus:outline-none rounded-r-md"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {editingAccount && (
                    <p className="text-xs text-muted-foreground mt-1">
                      The current password has been loaded from the account
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select
                    name="accountType"
                    value={formState.accountType}
                    onValueChange={(value) =>
                      handleSelectChange("accountType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  {isAdmin ? (
                    <Select
                      name="status"
                      value={formState.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="synchronized">
                          Synchronized
                        </SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-gray-100">
                      <span className="text-sm text-gray-600">
                        {formState.status === "synchronized"
                          ? "Synchronized"
                          : formState.status === "pending"
                            ? "Pending"
                            : formState.status === "error"
                              ? "Error"
                              : "Offline"}
                      </span>
                      {!editingAccount && (
                        <p className="text-xs text-muted-foreground">
                          (Only administrators can change this status)
                        </p>
                      )}
                      {editingAccount && (
                        <p className="text-xs text-muted-foreground">
                          (Contact an administrator to change this status)
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {formState.accountType === "slave" && (
                  <>
                    <div>
                      <Label htmlFor="connectedToMaster">
                        Connect to Master Account
                      </Label>
                      <Select
                        name="connectedToMaster"
                        value={formState.connectedToMaster}
                        onValueChange={(value) =>
                          handleSelectChange("connectedToMaster", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Master Account (Optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            Not Connected (Independent)
                          </SelectItem>
                          {accounts
                            .filter((acc) => acc.accountType === "master")
                            .map((masterAcc) => (
                              <SelectItem
                                key={masterAcc.id}
                                value={masterAcc.accountNumber}
                              >
                                {masterAcc.accountNumber} (
                                {masterAcc.platform.toUpperCase()} -{" "}
                                {masterAcc.server})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Leave empty to keep the account unconnected
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="lotCoefficient">
                        Lot Size Coefficient (0.01 - 100)
                      </Label>
                      <Input
                        id="lotCoefficient"
                        name="lotCoefficient"
                        type="number"
                        min="0.01"
                        max="100"
                        step="0.01"
                        value={formState.lotCoefficient?.toString() || "1"}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            lotCoefficient:
                              e.target.value === ""
                                ? 1
                                : parseFloat(e.target.value),
                          })
                        }
                        className="bg-white"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Multiplies the lot size from the master account
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="forceLot">
                        Force Fixed Lot Size (0 to disable)
                      </Label>
                      <Input
                        id="forceLot"
                        name="forceLot"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formState.forceLot?.toString() || "0"}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            forceLot:
                              e.target.value === ""
                                ? 0
                                : parseFloat(e.target.value),
                          })
                        }
                        className="bg-white"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        If set above 0, uses this fixed lot size instead of
                        copying
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 h-full mt-4">
                      <Checkbox
                        id="reverseTrade"
                        checked={formState.reverseTrade}
                        onCheckedChange={(checked) =>
                          setFormState({
                            ...formState,
                            reverseTrade: checked as boolean,
                          })
                        }
                      />
                      <Label
                        htmlFor="reverseTrade"
                        className="font-medium cursor-pointer"
                      >
                        Reverse Trades (Buy → Sell, Sell → Buy)
                      </Label>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Saving...
                    </>
                  ) : editingAccount ? (
                    "Update Account"
                  ) : (
                    "Add Account"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="text-center py-10">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
                <p className="text-muted-foreground">
                  Loading your trading accounts...
                </p>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground">
                  No trading accounts configured yet.
                </p>
                <Button onClick={handleAddAccount} className="mt-4">
                  Add your first trading account
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-md border shadow-sm relative overflow-x-auto">
            <div
              className="max-w-full overflow-x-auto overflow-y-hidden relative"
              style={{
                boxShadow:
                  "inset 10px 0 6px -6px rgba(0, 0, 0, 0.05), inset -10px 0 6px -6px rgba(0, 0, 0, 0.05)",
              }}
            >
              <table className="min-w-full divide-y divide-gray-200">
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
                            // Avoid activation if clicked on action buttons
                            if (
                              !(e.target as HTMLElement).closest(
                                ".actions-column"
                              )
                            ) {
                              toggleMasterCollapse(masterAccount.id);
                            }
                          }}
                        >
                          <td className="px-4 py-2 whitespace-nowrap align-middle">
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
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm align-middle">
                            <div className="flex items-center">
                              {masterAccount.accountNumber}
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
                            {masterAccount.server}
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
                            {deleteConfirmId === masterAccount.id ? (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDeleteAccount();
                                  }}
                                  disabled={
                                    isDeletingAccount === masterAccount.id
                                  }
                                >
                                  {isDeletingAccount === masterAccount.id
                                    ? "Deleting..."
                                    : "Confirm"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cancelDeleteAccount();
                                  }}
                                  disabled={
                                    isDeletingAccount === masterAccount.id
                                  }
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditAccount(masterAccount);
                                  }}
                                  title="Edit Account"
                                  disabled={
                                    isDeletingAccount === masterAccount.id
                                  }
                                >
                                  <Pencil className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAccount(masterAccount.id);
                                  }}
                                  title="Delete Account"
                                  disabled={
                                    isDeletingAccount === masterAccount.id
                                  }
                                >
                                  <Trash className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>

                        {/* Slave accounts connected to this master */}
                        {!collapsedMasters[masterAccount.id] &&
                          accounts
                            .filter(
                              (account) =>
                                account.accountType === "slave" &&
                                account.connectedToMaster ===
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
                                  {slaveAccount.accountNumber}
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
                                  {slaveAccount.server}
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

                                      // Limit number of visible tags
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
                                <td className="px-4 py-1.5 whitespace-nowrap align-middle">
                                  <div className="flex items-center">
                                    <div className="rounded-full px-2 py-0.5 text-xs bg-green-100 text-green-800 inline-block flex items-center gap-1">
                                      Master: {masterAccount.accountNumber}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-1.5 whitespace-nowrap align-middle actions-column">
                                  {deleteConfirmId === slaveAccount.id ? (
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={confirmDeleteAccount}
                                        disabled={
                                          isDeletingAccount === slaveAccount.id
                                        }
                                      >
                                        {isDeletingAccount === slaveAccount.id
                                          ? "Deleting..."
                                          : "Confirm"}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={cancelDeleteAccount}
                                        disabled={
                                          isDeletingAccount === slaveAccount.id
                                        }
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditAccount(slaveAccount);
                                        }}
                                        title="Edit Account"
                                        disabled={
                                          isDeletingAccount ===
                                            slaveAccount.id ||
                                          isDeletingAccount === masterAccount.id
                                        }
                                      >
                                        <Pencil className="h-4 w-4 text-blue-600" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 w-9 p-0 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteAccount(slaveAccount.id);
                                        }}
                                        title="Delete Account"
                                        disabled={
                                          isDeletingAccount ===
                                            slaveAccount.id ||
                                          isDeletingAccount === masterAccount.id
                                        }
                                      >
                                        <Trash className="h-4 w-4 text-red-600" />
                                      </Button>
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
                        <td className="px-4 py-2 whitespace-nowrap align-middle">
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
                          {orphanSlave.accountNumber}
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
                          {orphanSlave.server}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs align-middle">
                          <div className="flex flex-wrap gap-1">
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
                                orphanSlave.forceLot > 0
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

                              // Limit number of visible tags
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
                        <td className="px-4 py-2 whitespace-nowrap align-middle">
                          <div className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-600 inline-block">
                            Not copying
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap align-middle">
                          {deleteConfirmId === orphanSlave.id ? (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={confirmDeleteAccount}
                                disabled={isDeletingAccount === orphanSlave.id}
                              >
                                {isDeletingAccount === orphanSlave.id
                                  ? "Deleting..."
                                  : "Confirm"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelDeleteAccount}
                                disabled={isDeletingAccount === orphanSlave.id}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-full bg-white border border-gray-200 hover:bg-gray-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditAccount(orphanSlave);
                                }}
                                title="Edit Account"
                                disabled={isDeletingAccount === orphanSlave.id}
                              >
                                <Pencil className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-full bg-white border border-gray-200 hover:bg-gray-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAccount(orphanSlave.id);
                                }}
                                title="Delete Account"
                                disabled={isDeletingAccount === orphanSlave.id}
                              >
                                <Trash className="h-4 w-4 text-red-600" />
                              </Button>
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
      </CardContent>
    </Card>
  );
}
