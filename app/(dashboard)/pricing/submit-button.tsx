'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEffect, useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';

export function SubmitButton({ 
  className, 
  children,
  formAction
}: { 
  className?: string, 
  children?: React.ReactNode,
  formAction?: any
}) {
  const { pending } = useFormStatus();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  // Manejar el clic en el botón
  const handleButtonClick = () => {
    // Obtener el formulario padre del botón
    const form = document.getElementById('subscription-form') as HTMLFormElement;
    if (!form) return;
    
    // Obtener los datos del formulario
    const formData = new FormData(form);
    const priceId = formData.get('priceId') as string;
    
    if (!priceId) {
      setError('No price ID provided');
      return;
    }
    
    // Iniciar transición
    startTransition(async () => {
      try {
        // Ejecutar la acción del formulario
        const result = await formAction(formData);
        
        // Manejar la respuesta
        if (result?.redirect) {
          console.log('Redirigiendo a:', result.redirect);
          // Redirigir al usuario a la URL de checkout de Stripe
          window.location.href = result.redirect;
        } else if (result?.error) {
          setError(result.error);
          router.push(`/dashboard?error=${result.error}`);
        }
      } catch (error) {
        console.error('Error al procesar el checkout:', error);
        setError('error-inesperado');
        router.push('/dashboard?error=error-inesperado');
      }
    });
  };

  return (
    <Button
      type="button" // Cambiado a button para manejar manualmente el evento
      className={className}
      disabled={pending || isPending}
      onClick={handleButtonClick}
    >
      {(pending || isPending) ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : children || 'Subscribe'}
    </Button>
  );
}
