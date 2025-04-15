"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/db/schema";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import {
  Zap,
  Monitor,
  CircleCheckIcon,
} from "lucide-react";

export function TradingAccountsConfig({ user }: { user: User }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  >([
    {
      id: "1",
      accountNumber: "12345678",
      platform: "mt4",
      server: "ICMarkets-Live1",
      password: "••••••••",
      copyingTo: ["MT5 Demo Account", "FXCM Live"],
      accountType: "master",
      status: "synchronized",
    },
    {
      id: "2",
      accountNumber: "87654321",
      platform: "mt5",
      server: "FXCM-Real",
      password: "••••••••",
      copyingTo: [],
      accountType: "slave",
      lotCoefficient: 1.5,
      forceLot: 0,
      reverseTrade: false,
      status: "pending",
      connectedToMaster: "12345678",
    },
    {
      id: "3",
      accountNumber: "23456789",
      platform: "mt4",
      server: "Pepperstone-Live",
      password: "••••••••",
      copyingTo: ["MT4 FTMO", "MT5 MFF"],
      accountType: "master",
      status: "synchronized",
    },
    {
      id: "4",
      accountNumber: "34567890",
      platform: "mt5",
      server: "ICMarkets-MT5-Live",
      password: "••••••••",
      copyingTo: [],
      accountType: "slave",
      lotCoefficient: 0.8,
      forceLot: 0,
      reverseTrade: false,
      status: "synchronized",
      connectedToMaster: "12345678",
    },
    {
      id: "5",
      accountNumber: "45678901",
      platform: "ctrader",
      server: "Pepperstone-cTrader",
      password: "••••••••",
      copyingTo: [],
      accountType: "master",
      status: "error",
    },
    {
      id: "6",
      accountNumber: "56789012",
      platform: "mt4",
      server: "ICMarkets-Demo",
      password: "••••••••",
      copyingTo: [],
      accountType: "slave",
      lotCoefficient: 1.0,
      forceLot: 1.0,
      reverseTrade: true,
      status: "synchronized",
      connectedToMaster: "23456789",
    },
    {
      id: "7",
      accountNumber: "67890123",
      platform: "mt5",
      server: "FXCM-Demo",
      password: "••••••••",
      copyingTo: [],
      accountType: "slave",
      lotCoefficient: 2.0,
      forceLot: 0,
      reverseTrade: false,
      status: "synchronized",
      connectedToMaster: "78901234",
    },
    {
      id: "8",
      accountNumber: "78901234",
      platform: "mt4",
      server: "ICMarkets-Live2",
      password: "••••••••",
      copyingTo: ["FTMO Challenge"],
      accountType: "master",
      status: "synchronized",
    },
    {
      id: "9",
      accountNumber: "89012345",
      platform: "mt5",
      server: "ICMarkets-MT5-Demo",
      password: "••••••••",
      copyingTo: [],
      accountType: "slave",
      lotCoefficient: 0.5,
      forceLot: 0,
      reverseTrade: true,
      status: "pending",
      connectedToMaster: "78901234",
    },
    {
      id: "10",
      accountNumber: "90123456",
      platform: "ctrader",
      server: "ICMarkets-cTrader",
      password: "••••••••",
      copyingTo: [],
      accountType: "slave",
      lotCoefficient: 1.2,
      forceLot: 0,
      reverseTrade: false,
      status: "error",
      connectedToMaster: "45678901",
    },
    {
      id: "11",
      accountNumber: "01234567",
      platform: "mt4",
      server: "Pepperstone-Demo",
      password: "••••••••",
      copyingTo: [],
      accountType: "master",
      status: "offline",
    },
    {
      id: "12",
      accountNumber: "10293847",
      platform: "mt5",
      server: "FXCM-Real",
      password: "••••••••",
      copyingTo: [],
      accountType: "slave",
      lotCoefficient: 0.75,
      forceLot: 0.5,
      reverseTrade: false,
      status: "synchronized",
      connectedToMaster: "01234567",
    },
  ]);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
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
  });

  // Platform options
  const platformOptions = [
    { value: "mt4", label: "MetaTrader 4" },
    { value: "mt5", label: "MetaTrader 5" },
    { value: "ctrader", label: "cTrader" },
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
      .filter(acc => acc.id !== currentAccountId)
      .map(acc => ({
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
    setFormState({ ...formState, [name]: value });
  };

  // Nueva función para manejar cambios de plataforma
  const handlePlatformChange = (value: string) => {
    setFormState({ 
      ...formState, 
      platform: value,
      serverIp: "" // Reset server cuando cambia la plataforma 
    });
  };

  const handleAddAccount = () => {
    setIsAddingAccount(true);
    setEditingAccount(null);
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
    });
  };

  const handleEditAccount = (account: any) => {
    setIsAddingAccount(true);
    setEditingAccount(account);
    setFormState({
      accountNumber: account.accountNumber,
      platform: account.platform,
      serverIp: account.server,
      password: "", // No mostramos la contraseña existente
      accountType: account.accountType,
      status: account.status,
      lotCoefficient: account.lotCoefficient || 1,
      forceLot: account.forceLot || 0,
      reverseTrade: account.reverseTrade || false,
    });
  };

  const handleDeleteAccount = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDeleteAccount = () => {
    if (deleteConfirmId) {
      setAccounts(accounts.filter((account) => account.id !== deleteConfirmId));
      toast({
        title: "Account Deleted",
        description: "The account has been removed successfully.",
      });
      setDeleteConfirmId(null);
    }
  };

  const cancelDeleteAccount = () => {
    setDeleteConfirmId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validación básica
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
      // Simular una operación asíncrona
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingAccount) {
        // Actualizar cuenta existente
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

        toast({
          title: "Account Updated",
          description: "Your trading account has been updated successfully.",
        });
      } else {
        // Agregar nueva cuenta
        setAccounts([
          ...accounts,
          {
            id: Date.now().toString(),
            accountNumber: formState.accountNumber,
            platform: formState.platform,
            server: formState.serverIp,
            password: "••••••••",
            copyingTo: [],
            accountType: formState.accountType,
            status: formState.status,
            ...(formState.accountType === "slave" && {
              lotCoefficient: formState.lotCoefficient,
              forceLot: formState.forceLot,
              reverseTrade: formState.reverseTrade,
            }),
          },
        ]);

        toast({
          title: "Account Added",
          description: "Your new trading account has been added successfully.",
        });
      }

      // Resetear el estado del formulario
      setIsAddingAccount(false);
      setEditingAccount(null);
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

  const getAccountTypeIcon = (accountType: string) => {
    switch (accountType) {
      case "master":
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case "slave":
        return <CircleCheckIcon className="h-5 w-5 text-green-500" />;
      default:
        return <Monitor className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "synchronized":
        return (
          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
        );
      case "pending":
        return (
          <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse"></div>
        );
      case "error":
        return <div className="h-3 w-3 rounded-full bg-red-500"></div>;
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-500"></div>;
    }
  };

  const getServerStatus = () => {
    // En un caso real, podríamos hacer una llamada a una API
    // para obtener el estado real del servidor
    return "operational"; // o "down", "maintenance"
  };

  // Default platform when adding new account
  const [selectedPlatform, setSelectedPlatform] = useState<string>("mt4");
  
  // Update selected platform when form changes
  useEffect(() => {
    if (formState.platform) {
      setSelectedPlatform(formState.platform);
    }
  }, [formState.platform]);

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
          {!isAddingAccount && (
            <Button
              onClick={handleAddAccount}
              className="ml-auto"
              disabled={accounts.length >= 50}
            >
              Add Trading Account
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center gap-6 mb-6 p-3 bg-muted/30 rounded-md">
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Server Status:</div>
            {getStatusIcon(getServerStatus())}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Total Accounts:</div>
            <div className="font-medium">{accounts.length}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Master Accounts:</div>
            <div className="font-medium">{accounts.filter(acc => acc.accountType === "master").length}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Slave Accounts:</div>
            <div className="font-medium">{accounts.filter(acc => acc.accountType === "slave").length}</div>
          </div>
        </div>
        {isAddingAccount ? (
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
                />
              </div>

              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select
                  name="platform"
                  value={formState.platform}
                  onValueChange={(value) =>
                    handlePlatformChange(value)
                  }
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
                <Select
                  name="serverIp"
                  value={formState.serverIp}
                  onValueChange={(value) =>
                    handleSelectChange("serverIp", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Server" />
                  </SelectTrigger>
                  <SelectContent>
                    {serverOptions[formState.platform]?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="password">
                  Password {editingAccount && "(leave blank to keep unchanged)"}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required={!editingAccount}
                />
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
                    <SelectItem value="synchronized">Synchronized</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formState.accountType === "slave" && (
                <>
                  <div>
                    <Label htmlFor="lotCoefficient">
                      Lot Size Coefficient (0.1 - 10)
                    </Label>
                    <Input
                      id="lotCoefficient"
                      name="lotCoefficient"
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={formState.lotCoefficient}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          lotCoefficient: parseFloat(e.target.value),
                        })
                      }
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
                      value={formState.forceLot}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          forceLot: parseFloat(e.target.value),
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      If set above 0, uses this fixed lot size instead of
                      copying
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 h-full mt-8">
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
        ) : accounts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No trading accounts configured yet.
            </p>
            <Button onClick={handleAddAccount} className="mt-4">
              Add your first trading account
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider">
                    Account Number
                  </th>
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider">
                    Server
                  </th>
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider">
                    Configuration
                  </th>
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-gray-200">
                {accounts.map((account) => (
                  <tr key={account.id} className="hover:bg-muted/50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={
                          account.status === "synchronized"
                            ? "text-green-600 font-medium"
                            : account.status === "pending"
                            ? "text-blue-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {account.status === "synchronized"
                          ? "Synced"
                          : account.status === "pending"
                          ? "Pending"
                          : "Invalid"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {account.accountNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {account.accountType === "master" ? "Master" : "Slave"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {account.platform === "mt4"
                        ? "MetaTrader 4"
                        : account.platform === "mt5"
                        ? "MetaTrader 5"
                        : account.platform === "ctrader"
                        ? "cTrader"
                        : account.platform}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {account.server}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs">
                      {account.accountType === "slave" ? (
                        <div className="space-y-1">
                          <div className="font-medium text-blue-600">
                            Master: {account.connectedToMaster ? 
                              accounts.find(acc => acc.accountNumber === account.connectedToMaster)?.accountNumber || "Unknown" 
                              : "Not connected"}
                          </div>
                          {account.lotCoefficient && (
                            <div>Lot Coef: {account.lotCoefficient}x</div>
                          )}
                          {account.forceLot > 0 && (
                            <div>Force Lot: {account.forceLot}</div>
                          )}
                          {account.reverseTrade && <div>Reverse: Yes</div>}
                        </div>
                      ) : (
                        <div>
                          {accounts.filter(acc => acc.connectedToMaster === account.accountNumber).length > 0 ? (
                            <div className="font-medium">
                              Connected by {accounts.filter(acc => acc.connectedToMaster === account.accountNumber).length} slaves
                            </div>
                          ) : "—"}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {deleteConfirmId === account.id ? (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={confirmDeleteAccount}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelDeleteAccount}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAccount(account)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteAccount(account.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 