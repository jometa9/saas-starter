'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEffect, useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

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
    
    // Mostrar información de depuración en la página
    toast({
      title: "Processing subscription...",
      description: "Preparing your checkout session with Stripe...",
    });
    
    // Primero buscar el formulario por ID
    const form = document.getElementById('subscription-form') as HTMLFormElement;
    
    if (!form) {
      console.log('No se encontró formulario con id subscription-form, buscando alternativa');
      
      // Buscar todos los formularios en la página
      const allForms = document.querySelectorAll('form');
      console.log('Formularios en la página:', allForms.length);
      
      if (allForms.length === 0) {
        // Si no hay formularios, intentar buscar el botón y su formulario padre
        const button = document.activeElement as HTMLElement;
        const parentForm = button?.closest('form') as HTMLFormElement;
        
        if (!parentForm) {
          console.log('No se encontró ningún formulario padre');
          setError('Form not found');
          toast({
            title: "Error",
            description: "Could not find subscription form. Please try again or contact support.",
            variant: "destructive",
          });
          return;
        }
        
        // Usar el formulario padre encontrado
        processForm(parentForm);
      } else {
        // Usar el primer formulario encontrado
        console.log('Usando el primer formulario encontrado');
        processForm(allForms[0] as HTMLFormElement);
      }
    } else {
      // Usar el formulario por ID
      processForm(form);
    }
  };
  
  const processForm = (form: HTMLFormElement) => {
    // Crear formData con el formulario
    const formData = new FormData(form);
    
    // Verificar si hay un input de priceId
    let priceId = formData.get('priceId') as string;
    
    // Buscar explícitamente el input hidden
    if (!priceId) {
      const priceInput = form.querySelector('input[name="priceId"]') as HTMLInputElement;
      if (priceInput) {
        priceId = priceInput.value;
        console.log('PriceId encontrado en el input:', priceId);
        formData.set('priceId', priceId);
      } else {
        // Buscar todos los inputs hidden en el formulario
        const hiddenInputs = form.querySelectorAll('input[type="hidden"]');
        console.log('Inputs ocultos encontrados:', hiddenInputs.length);
        
        if (hiddenInputs.length > 0) {
          const inputsArray = Array.from(hiddenInputs);
          console.log('Inputs ocultos:', inputsArray.map(i => ({ name: i.name, value: i.value })));
        }
      }
    }
    
    // Mostrar datos del formulario para debug
    console.log('Datos del formulario:', Object.fromEntries(formData.entries()));
    
    // Verificar priceId y continuar
    submitFormData(formData);
  };
  
  const submitFormData = async (formData: FormData) => {
    console.log('Ejecutando submitFormData, datos:', Object.fromEntries(formData.entries()));
    const priceId = formData.get('priceId') as string;
    
    if (!priceId) {
      console.log('Error: No se encontró priceId en formData');
      setError('No price ID provided');
      
      // Intentar obtener priceId de los planes de la página
      const pricingCards = document.querySelectorAll('.recommended input[name="priceId"]');
      if (pricingCards.length > 0) {
        const recommendedPriceId = (pricingCards[0] as HTMLInputElement).value;
        console.log('Usando priceId recomendado:', recommendedPriceId);
        
        if (recommendedPriceId) {
          formData.set('priceId', recommendedPriceId);
          toast({
            title: "Using recommended plan",
            description: "Proceeding with the recommended plan subscription.",
          });
          // Continuar con el priceId encontrado
          executeFormAction(formData);
          return;
        }
      }
      
      toast({
        title: "Error",
        description: "No pricing plan selected. Please try again or contact support.",
        variant: "destructive",
      });
      return;
    }
    
    executeFormAction(formData);
  };
  
  const executeFormAction = async (formData: FormData) => {
    // Iniciar transición
    console.log('Iniciando transición para ejecutar formAction');
    startTransition(async () => {
      try {
        // Ejecutar la acción del formulario
        console.log('Ejecutando formAction con formData');
        
        if (!formAction || typeof formAction !== 'function') {
          console.error('Error: formAction no es una función válida', formAction);
          toast({
            title: "Error",
            description: "Invalid form action. Please try again later or contact support.",
            variant: "destructive",
          });
          return;
        }
        
        const result = await formAction(formData);
        console.log('Resultado de formAction:', result);
        
        // Manejar la respuesta
        if (result?.redirect) {
          console.log('Redirigiendo a:', result.redirect);
          toast({
            title: "Success!",
            description: "Redirecting to Stripe checkout...",
          });
          
          // Agregar un pequeño retraso para asegurarse de que el toast se muestre
          setTimeout(() => {
            // Redirigir al usuario a la URL de checkout de Stripe
            window.location.href = result.redirect;
          }, 800);
        } else if (result?.error) {
          console.log('Error recibido:', result.error);
          setError(result.error);
          
          toast({
            title: "Checkout Error",
            description: `There was a problem: ${result.error}. Please try again or contact support.`,
            variant: "destructive",
          });
          
          router.push(`/dashboard?error=${result.error}`);
        } else {
          console.log('Respuesta no reconocida:', result);
          toast({
            title: "Unknown response",
            description: "Received an unknown response. Please try again or contact support.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error al procesar el checkout:', error);
        console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack available');
        setError('error-inesperado');
        
        toast({
          title: "Unexpected error",
          description: "An unexpected error occurred. Please try again later or contact support.",
          variant: "destructive",
        });
        
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
