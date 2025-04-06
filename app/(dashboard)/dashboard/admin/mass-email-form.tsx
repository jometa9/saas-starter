"use client";

import { useState, useEffect, startTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState } from "react";
import { sendBroadcastEmailAction } from "@/lib/db/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Mail } from "lucide-react";

// Esquema de validación
const broadcastFormSchema = z.object({
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres"),
  message: z.string().min(20, "El mensaje debe tener al menos 20 caracteres"),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().url("Debe ser una URL válida").optional(),
  isImportant: z.boolean().default(false),
});

type BroadcastFormValues = z.infer<typeof broadcastFormSchema>;

export default function MassEmailForm() {
  const [isPending, setIsPending] = useState(false);
  const [state, formAction] = useActionState(sendBroadcastEmailAction, {});
  const [prevState, setPrevState] = useState({});

  // Detectar cambios en el estado para actualizar isPending
  useEffect(() => {
    if (state !== prevState && isPending) {
      setIsPending(false);
      setPrevState(state);
    }
  }, [state, prevState, isPending]);

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastFormSchema),
    defaultValues: {
      subject: "",
      message: "",
      ctaLabel: "",
      ctaUrl: "",
      isImportant: false,
    },
  });

  const onSubmit = async (data: BroadcastFormValues) => {
    setIsPending(true);
    const formData = new FormData();
    formData.append("subject", data.subject);
    formData.append("message", data.message);
    formData.append("ctaLabel", data.ctaLabel || "");
    formData.append("ctaUrl", data.ctaUrl || "");
    formData.append("isImportant", data.isImportant ? "true" : "false");
    
    startTransition(() => {
      formAction(formData);
    });
    // No desactivamos isPending aquí, lo haremos en el useEffect cuando el estado cambie
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center p-4 rounded-md bg-muted">
        <Mail className="h-6 w-6 mr-3 text-primary" />
        <div className="flex-1">
          <div className="font-medium">Envío de emails masivos</div>
          <div className="text-sm text-muted-foreground">
            Esta herramienta enviará emails a todos los usuarios activos de la plataforma.
          </div>
        </div>
      </div>

      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      
      {state.success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Emails enviados correctamente</AlertTitle>
          <AlertDescription>
            {state.success}
            <p className="mt-2 font-medium">Se ha enviado la notificación a todos los usuarios activos.</p>
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asunto del email</FormLabel>
                <FormControl>
                  <Input placeholder="Anuncio importante para nuestros usuarios" {...field} />
                </FormControl>
                <FormDescription>
                  Asunto claro y descriptivo para el email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenido del mensaje</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Escribe aquí el contenido detallado del mensaje..."
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Puedes usar saltos de línea para formatear el texto. No se admite HTML.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ctaLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etiqueta del botón (opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Más información"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Texto para el botón de llamada a la acción (CTA).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ctaUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del botón (opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://ejemplo.com/informacion"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  URL donde redirigirá el botón CTA.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isImportant"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Marcar como importante</FormLabel>
                  <FormDescription>
                    Añade una etiqueta de [IMPORTANTE] al asunto y destaca visualmente el mensaje.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Enviando emails... Por favor espera" : "Enviar email a todos los usuarios"}
          </Button>
        </form>
      </Form>
    </div>
  );
} 