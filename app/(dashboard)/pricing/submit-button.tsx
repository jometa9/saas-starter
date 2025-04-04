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
    const form = document.getElementById('subscription-form');
    if (!form) {
      // Si no existe un formulario con id 'subscription-form', intentar obtener el formulario padre del botón
      const button = document.activeElement as HTMLElement;
      const parentForm = button?.closest('form') as HTMLFormElement;
      
      if (!parentForm) {
        setError('Form not found');
        return;
      }
      
      // Obtener los datos del formulario
      const formData = new FormData(parentForm);
      submitFormData(formData);
    } else {
      // Si existe el formulario con id, usarlo
      const formData = new FormData(form as HTMLFormElement);
      submitFormData(formData);
    }
  };
  
  const submitFormData = async (formData: FormData) => {
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
