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
    const button = document.activeElement as HTMLElement;
    const parentForm = button?.closest('form') as HTMLFormElement;
    
    if (!parentForm) {
      toast({
        title: "Error",
        description: "Could not find subscription form. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData(parentForm);
    const priceId = formData.get('priceId') as string;
    
    if (!priceId) {
      console.log('No se encontró priceId en el formulario');
      const recommendedCard = document.querySelector('.recommended input[name="priceId"]') as HTMLInputElement;
      if (recommendedCard?.value) {
        formData.set('priceId', recommendedCard.value);
        console.log('Usando priceId del plan recomendado:', recommendedCard.value);
        submitSubscription(formData);
      } else {
        toast({
          title: "Error",
          description: "No pricing plan selected. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      console.log('PriceId encontrado:', priceId);
      submitSubscription(formData);
    }
  };
  
  const submitSubscription = (formData: FormData) => {
    if (!formAction || typeof formAction !== 'function') {
      toast({
        title: "Error",
        description: "Invalid form configuration. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    startTransition(async () => {
      try {
        const result = await formAction(formData);
        
        if (result?.redirect) {
          // Redirección inmediata a Stripe
          window.location.href = result.redirect;
        } else if (result?.error) {
          setError(result.error);
          toast({
            title: "Subscription Error",
            description: `There was a problem: ${result.error}. Please try again.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Unknown Response",
            description: "Received an unexpected response. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error processing subscription:', error);
        toast({
          title: "Unexpected Error",
          description: "An error occurred. Please try again later.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Button
      type="button"
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
