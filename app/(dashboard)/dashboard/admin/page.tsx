import React from "react";
import { Metadata } from "next";
import { getUserAuth } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsersIcon, SettingsIcon, ChevronRightIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Administration panel for managing users and settings",
};

export default async function AdminDashboardPage() {
  const { session, user } = await getUserAuth();

  if (!session || !user) {
    return redirect("/sign-in");
  }

  if (user.role !== "admin" && user.role !== "superadmin") {
    return redirect("/dashboard");
  }

  const adminMenuItems = [
    {
      title: "Managed Users",
      description: "View and manage users with managed service subscription",
      icon: <UsersIcon className="h-4 w-4" />,
      href: "/dashboard/managed-users",
    },
    {
      title: "Admin Settings",
      description: "Configure application settings and preferences",
      icon: <SettingsIcon className="h-4 w-4" />,
      href: "/dashboard/admin/settings",
    },
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, settings, and application features
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {adminMenuItems.map((item) => (
          <Card key={item.href} className="hover:shadow-md transition-all">
            <Link href={item.href} className="block h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
