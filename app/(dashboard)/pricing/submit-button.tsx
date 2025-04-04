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
    console.log('Ejecutando handleButtonClick');
    const form = document.getElementById('subscription-form');
    if (!form) {
      console.log('No se encontró formulario con id subscription-form, buscando alternativa');
      // Si no existe un formulario con id 'subscription-form', intentar obtener el formulario padre del botón
      const button = document.activeElement as HTMLElement;
      const parentForm = button?.closest('form') as HTMLFormElement;
      
      if (!parentForm) {
        console.log('No se encontró ningún formulario padre');
        setError('Form not found');
        return;
      }
      
      // Obtener los datos del formulario
      console.log('Usando formulario padre encontrado vía DOM');
      const formData = new FormData(parentForm);
      submitFormData(formData);
    } else {
      // Si existe el formulario con id, usarlo
      console.log('Formulario subscription-form encontrado');
      const formData = new FormData(form as HTMLFormElement);
      submitFormData(formData);
    }
  };
  
  const submitFormData = async (formData: FormData) => {
    console.log('Ejecutando submitFormData, datos:', Object.fromEntries(formData.entries()));
    const priceId = formData.get('priceId') as string;
    
    if (!priceId) {
      console.log('Error: No se encontró priceId en formData');
      setError('No price ID provided');
      return;
    }
    
    // Iniciar transición
    console.log('Iniciando transición para ejecutar formAction');
    startTransition(async () => {
      try {
        // Ejecutar la acción del formulario
        console.log('Ejecutando formAction con formData');
        const result = await formAction(formData);
        console.log('Resultado de formAction:', result);
        
        // Manejar la respuesta
        if (result?.redirect) {
          console.log('Redirigiendo a:', result.redirect);
          // Redirigir al usuario a la URL de checkout de Stripe
          window.location.href = result.redirect;
        } else if (result?.error) {
          console.log('Error recibido:', result.error);
          setError(result.error);
          router.push(`/dashboard?error=${result.error}`);
        } else {
          console.log('Respuesta no reconocida:', result);
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
