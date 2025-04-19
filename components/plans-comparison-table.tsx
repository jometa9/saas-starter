"use client";

import React from "react";
import { Check, X, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useUser } from "@/lib/auth";

interface PlanFeature {
  name: string;
  free: boolean | string;
  premium: boolean | string;
  unlimited: boolean | string;
  managedVps: boolean | string;
}

const planFeatures: PlanFeature[] = [
  {
    name: "Number of master accounts",
    free: "1",
    premium: "1",
    unlimited: "Multiple",
    managedVps: "Multiple",
  },
  {
    name: "Number of slave accounts",
    free: "Unlimited",
    premium: "Up to 10",
    unlimited: "Unlimited",
    managedVps: "Up to 50",
  },
  {
    name: "Lot size customization",
    free: false,
    premium: true,
    unlimited: true,
    managedVps: true,
  },
  {
    name: "Fixed lot size (0.01)",
    free: true,
    premium: false,
    unlimited: false,
    managedVps: false,
  },
  {
    name: "Single IP for all accounts",
    free: false,
    premium: true,
    unlimited: true,
    managedVps: true,
  },
  {
    name: "Priority support",
    free: false,
    premium: true,
    unlimited: true,
    managedVps: true,
  },
  {
    name: "24/7 Priority support",
    free: false,
    premium: false,
    unlimited: true,
    managedVps: true,
  },
  {
    name: "Advanced risk management",
    free: false,
    premium: true,
    unlimited: true,
    managedVps: true,
  },
  {
    name: "Dedicated VPS server",
    free: false,
    premium: false,
    unlimited: false,
    managedVps: true,
  },
  {
    name: "24/7 server monitoring",
    free: false,
    premium: false,
    unlimited: false,
    managedVps: true,
  },
  {
    name: "Full setup & configuration",
    free: false,
    premium: false,
    unlimited: false,
    managedVps: true,
  },
];

export function PlansComparisonTable() {
  const { userPromise } = useUser();
  const [user, setUser] = React.useState<any>(null);
  const [currentPlan, setCurrentPlan] = React.useState<string | null>(null);
  const [isAnnual, setIsAnnual] = React.useState<boolean>(true);

  React.useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        if (userPromise && typeof userPromise === "object") {
          const userData = await userPromise;
          setUser(userData);

          if (userData?.planName) {
            setCurrentPlan(userData.planName);
          }
        }
      } catch (error) {
        
      }
    };

    fetchUserData();

    // Check billing period
    const billingPeriod = document.body.getAttribute("data-billing-period");
    setIsAnnual(billingPeriod === "annual" || billingPeriod === null);
  }, [userPromise]);

  const renderCellContent = (value: boolean | string) => {
    if (typeof value === "string") {
      return value;
    } else if (value === true) {
      return <Check className="h-5 w-5 text-green-600 mx-auto" />;
    } else {
      return <X className="h-5 w-5 text-red-400 mx-auto" />;
    }
  };

  const scrollToPrices = () => {
    // Detect if we are on the dashboard/pricing page
    const isDashboardPricing =
      window.location.pathname.includes("/dashboard/pricing");

    // Look for element with ID "prices" for smooth scrolling
    const pricesElement = document.getElementById("prices");

    if (pricesElement) {
      // If the element exists, perform smooth scroll
      pricesElement.scrollIntoView({ behavior: "smooth" });
    } else {
      // If the element doesn't exist, navigate according to the current page
      if (isDashboardPricing) {
        window.location.href = "/dashboard/pricing/#prices";
      } else {
        window.location.href = "/#prices";
      }
    }
  };

  // Determine button text and state based on login status and current plan
  const getButtonText = (planName: string): string => {
    if (!user) return "Get " + planName; // User not logged in

    if (planName === "Free") return "Start Now"; // Free plan always shows "Start Now"

    // For paid plans, if it matches the current plan show "Current", otherwise "Get" + name
    if (currentPlan && currentPlan.indexOf(planName) !== -1) {
      return "Current Plan";
    }

    return "Get " + planName;
  };

  // Check if the button should be disabled
  const isButtonDisabled = (planName: string): boolean => {
    if (!user) return false; // If not logged in, don't disable buttons

    // Free Plan - disabled if the user has a paid plan
    if (planName === "Free" && currentPlan && currentPlan !== "Free") {
      return true;
    }

    // If they already have this plan, disable the button
    if (currentPlan && currentPlan.indexOf(planName) !== -1) {
      return true;
    }

    return false;
  };

  // Function to get the correct URL for non-logged in users
  const getPlanUrl = (planName: string): string => {
    // Detect if we are on the dashboard/pricing page
    const isDashboardPricing =
      window.location.pathname.includes("/dashboard/pricing");

    if (!user) {
      // Not logged in - direct to sign in
      return `/sign-in?redirect=${isDashboardPricing ? "/dashboard/pricing" : "/"}`;
    }

    // Logged in user - go to pricing section based on current page
    return isDashboardPricing ? "/dashboard/pricing/#prices" : "/#prices";
  };

  return (
    <Card className="w-full my-8 border border-gray-200 shadow-lg">
      <CardContent className="p-0 overflow-hidden">
        <div className="overflow-x-auto rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100">
                <TableHead className="w-1/3 font-semibold text-gray-800 p-4  border-b-2 border-gray-300">
                  Feature
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-800 p-4 bg-gray-50 border-b-2 border-gray-300">
                  Free
                </TableHead>
                <TableHead className="text-center font-semibold text-green-800 p-4 bg-green-50 border-b-2 border-green-300">
                  Premium
                </TableHead>
                <TableHead className="text-center font-semibold text-blue-800 p-4 bg-blue-50 border-b-2 border-blue-300">
                  Unlimited
                </TableHead>
                <TableHead className="text-center font-semibold text-purple-800 p-4 bg-purple-50 border-b-2 border-purple-300">
                  Managed VPS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planFeatures.map((feature, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? "bg-muted/30" : ""}
                >
                  <TableCell className="font-medium p-4">
                    {feature.name}
                  </TableCell>
                  <TableCell className="text-center p-4">
                    {renderCellContent(feature.free)}
                  </TableCell>
                  <TableCell className="text-center p-4">
                    {renderCellContent(feature.premium)}
                  </TableCell>
                  <TableCell className="text-center p-4">
                    {renderCellContent(feature.unlimited)}
                  </TableCell>
                  <TableCell className="text-center p-4">
                    {renderCellContent(feature.managedVps)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Fila de botones */}
              <TableRow>
                <TableCell className="p-4 border-t-2 border-gray-200"></TableCell>
                <TableCell className="text-center p-4 border-t-2 border-gray-200">
                  {user ? (
                    <Button
                      onClick={scrollToPrices}
                      variant="outline"
                      className="w-full border-gray-400 hover:bg-gray-100 cursor-pointer"
                      disabled={isButtonDisabled("Free")}
                    >
                      {getButtonText("Free")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-gray-400 hover:bg-gray-100 cursor-pointer"
                    >
                      <Link href={getPlanUrl("Free")}>
                        {getButtonText("Free")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-center p-4 border-t-2 border-gray-200">
                  {user ? (
                    <Button
                      onClick={scrollToPrices}
                      className={`w-full ${
                        currentPlan && currentPlan.indexOf("Premium") !== -1
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-green-600 hover:bg-green-700"
                      } text-white cursor-pointer`}
                      disabled={isButtonDisabled("Premium")}
                    >
                      {getButtonText("Premium")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                    >
                      <Link href={getPlanUrl("Premium")}>
                        {getButtonText("Premium")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-center p-4 border-t-2 border-gray-200">
                  {user ? (
                    <Button
                      onClick={scrollToPrices}
                      className={`w-full  cursor-pointer${
                        currentPlan && currentPlan.indexOf("Unlimited") !== -1
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white`}
                      disabled={isButtonDisabled("Unlimited")}
                    >
                      {getButtonText("Unlimited")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Link href={getPlanUrl("Unlimited")}>
                        {getButtonText("Unlimited")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-center p-4 border-t-2 border-gray-200">
                  {user ? (
                    <Button
                      onClick={scrollToPrices}
                      className={`w-full ${
                        currentPlan && currentPlan.indexOf("Managed VPS") !== -1
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-purple-600 hover:bg-purple-700"
                      } text-white cursor-pointer`}
                      disabled={isButtonDisabled("Managed VPS")}
                    >
                      {getButtonText("Managed VPS")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                    >
                      <Link href={getPlanUrl("Managed VPS")}>
                        {getButtonText("Managed VPS")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
