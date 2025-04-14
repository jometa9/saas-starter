"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";

export function PricingToggle() {
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    // Inicializar correctamente el atributo con el valor por defecto (mensual)
    document.body.setAttribute("data-billing-period", "monthly");
  }, []);

  const handleToggleChange = () => {
    const newValue = !isAnnual;
    setIsAnnual(newValue);

    // Actualizar el valor del atributo data-billing-period en el body
    document.body.setAttribute(
      "data-billing-period",
      newValue ? "annual" : "monthly"
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-600">Monthly</span>
      <Switch
        checked={isAnnual}
        onCheckedChange={handleToggleChange}
        className="data-[state=checked]:bg-green-600"
        id="billing-toggle"
      />
      <span className="text-sm font-medium text-gray-600">
        Annual{" "}
        <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
          Save 20%
        </span>
      </span>
    </div>
  );
}
