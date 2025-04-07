"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, FileText, User, CreditCard, Settings } from "lucide-react";
import { useUser } from "@/lib/auth";
import { use } from "react";
import { User as UserType } from "@/lib/db/schema";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { userPromise } = useUser();
  const user = use(userPromise);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const path = pathname.split("/").pop();

    if (path === "dashboard" || path === "") {
      setActiveTab("dashboard");
    } else if (path === "guide") {
      setActiveTab("guide");
    } else if (path === "profile") {
      setActiveTab("profile");
    } else if (path === "admin") {
      setActiveTab("admin");
    }
  }, [pathname]);

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard/${tab === "dashboard" ? "" : tab}`);
  };

  return (
    <div className="width-full">
      <div className="flex flex-wrap px-4">
        <Button
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          onClick={() => navigateTo("dashboard")}
          className="flex items-center rounded-xl border shadow mb-4 pr-5 mr-4"
        >
          <Home className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
        <Button
          variant={activeTab === "guide" ? "default" : "ghost"}
          onClick={() => navigateTo("guide")}
          className="flex items-center rounded-xl border shadow mb-4 pr-5 mr-4"
        >
          <FileText className="h-4 w-4 mr-2" />
          Guide
        </Button>
        <Button
          variant={activeTab === "profile" ? "default" : "ghost"}
          onClick={() => navigateTo("profile")}
          className="flex items-center rounded-xl border shadow mb-4 pr-5 mr-4"
        >
          <User className="h-4 w-4 mr-2" />
          Account
        </Button>
        {isAdmin && (
          <Button
            variant={activeTab === "admin" ? "default" : "ghost"}
            onClick={() => navigateTo("admin")}
            className="flex items-center rounded-xl border shadow mb-4 pr-5 mr-4"
          >
            <Settings className="h-4 w-4 mr-2" />
            Admin
          </Button>
        )}
      </div>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
