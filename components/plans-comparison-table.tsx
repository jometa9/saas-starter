"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const renderCellContent = (value: boolean | string) => {
    if (typeof value === "string") {
      return value;
    } else if (value === true) {
      return <Check className="h-5 w-5 text-green-600 mx-auto" />;
    } else {
      return <X className="h-5 w-5 text-red-400 mx-auto" />;
    }
  };

  return (
    <Card className="w-full my-8 border border-gray-200 shadow-lg">
      <CardContent className="p-0 overflow-hidden">
        <div className="overflow-x-auto rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100">
                <TableHead className="w-1/3 font-semibold text-gray-800 p-4  border-b-2 border-gray-300 ">Feature</TableHead>
                <TableHead className="text-center font-semibold text-gray-800 p-4 bg-gray-50 border-b-2 border-gray-300">Free</TableHead>
                <TableHead className="text-center font-semibold text-green-800 p-4 bg-green-50 border-b-2 border-green-300">Premium</TableHead>
                <TableHead className="text-center font-semibold text-blue-800 p-4 bg-blue-50 border-b-2 border-blue-300">Unlimited</TableHead>
                <TableHead className="text-center font-semibold text-purple-800 p-4 bg-purple-50 border-b-2 border-purple-300">Managed VPS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planFeatures.map((feature, index) => (
                <TableRow key={index} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                  <TableCell className="font-medium p-4">{feature.name}</TableCell>
                  <TableCell className="text-center p-4">{renderCellContent(feature.free)}</TableCell>
                  <TableCell className="text-center p-4">{renderCellContent(feature.premium)}</TableCell>
                  <TableCell className="text-center p-4">{renderCellContent(feature.unlimited)}</TableCell>
                  <TableCell className="text-center p-4">{renderCellContent(feature.managedVps)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 