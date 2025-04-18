import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const TradingAccountsAPI = () => {
  const [accounts, setAccounts] = useState([]);
  const [formState, setFormState] = useState({
    accountNumber: "",
    platform: "",
    serverIp: "",
    password: "",
    accountType: "",
    status: "",
    lotCoefficient: "",
    forceLot: "",
    reverseTrade: "",
    connectedToMaster: "",
  });
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/trading-accounts");
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch trading accounts");
        }
        
        const data = await response.json();
        if (data.accounts) {
          const formattedAccounts = data.accounts.map((account: any) => ({
            ...account,
            id: account.id.toString(),
            password: "••••••••",
            copyingTo: account.copyingTo || [],
          }));
          setAccounts(formattedAccounts);
        }
      } catch (error) {
        
        toast({
          title: "Error",
          description: "Failed to load trading accounts. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    fetchAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      const payload = {
        accountNumber: formState.accountNumber,
        platform: formState.platform,
        server: formState.serverIp,
        password: formState.password,
        accountType: formState.accountType,
        status: formState.status,
        ...(formState.accountType === "slave" && {
          lotCoefficient: formState.lotCoefficient,
          forceLot: formState.forceLot,
          reverseTrade: formState.reverseTrade,
          connectedToMaster: formState.connectedToMaster,
        }),
      };

      let response;
      let data;
      
      if (editingAccount) {
        response = await fetch(`/api/trading-accounts/${editingAccount.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update trading account");
        }
        
        data = await response.json();
        
        setAccounts(
          accounts.map((acc) =>
            acc.id === editingAccount.id
              ? {
                  ...data.account,
                  id: data.account.id.toString(),
                  password: "••••••••",
                  copyingTo: acc.copyingTo || [],
                }
              : acc
          )
        );

        toast({
          title: "Account Updated",
          description: "Your trading account has been updated successfully.",
        });
      } else {
        response = await fetch("/api/trading-accounts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create trading account");
        }
        
        data = await response.json();
        
        setAccounts([
          ...accounts,
          {
            ...data.account,
            id: data.account.id.toString(),
            password: "••••••••",
            copyingTo: [],
          },
        ]);

        toast({
          title: "Account Added",
          description: "Your new trading account has been added successfully.",
        });
      }

      setIsAddingAccount(false);
      setEditingAccount(null);
    } catch (error) {
      
      toast({
        title: "Error",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteAccount = async () => {
    if (deleteConfirmId) {
      try {
        setIsSubmitting(true);
        
        const response = await fetch(`/api/trading-accounts/${deleteConfirmId}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to delete trading account");
        }
        
        setAccounts(accounts.filter((account) => account.id !== deleteConfirmId));
        
        toast({
          title: "Account Deleted",
          description: "The account has been removed successfully.",
        });
      } catch (error) {
        
        toast({
          title: "Error",
          description: "Failed to delete trading account. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
        setDeleteConfirmId(null);
      }
    }
  };

  return (
    <div>
      {/* Rest of the component code */}
    </div>
  );
};

export default TradingAccountsAPI; 