'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';

export function PricingToggle() {
  const [isAnnual, setIsAnnual] = useState(false);
  
  useEffect(() => {
    // Inicializar correctamente el atributo con el valor por defecto (mensual)
    document.body.setAttribute('data-billing-period', 'monthly');
  }, []);
  
  const handleToggleChange = () => {
    const newValue = !isAnnual;
    setIsAnnual(newValue);
    
    // Actualizar el valor del atributo data-billing-period en el body
    document.body.setAttribute('data-billing-period', newValue ? 'annual' : 'monthly');
  };
  
  return (
    <Switch
      checked={isAnnual}
      onCheckedChange={handleToggleChange}
      className="data-[state=checked]:bg-black"
      id="billing-toggle"
    />
  );
} 