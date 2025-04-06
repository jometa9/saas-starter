"use client";

import { useState, useEffect, startTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState } from "react";
import { updateAppVersionAction } from "@/lib/db/actions";
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
import { CheckCircle, AlertCircle } from "lucide-react";

// Esquema de validación
const versionFormSchema = z.object({
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, "El formato debe ser X.Y.Z (ej. 1.0.0)"),
  releaseNotes: z.string().min(10, "Las notas de versión deben tener al menos 10 caracteres"),
  downloadUrl: z.string().url("Debe ser una URL válida").optional(),
  isCritical: z.boolean().default(false),
});

type VersionFormValues = z.infer<typeof versionFormSchema>;

export default function VersionUpdateForm({ currentVersion }: { currentVersion: string }) {
  const [isPending, setIsPending] = useState(false);
  const [state, formAction] = useActionState(updateAppVersionAction, {});
  const [prevState, setPrevState] = useState({});

  // Detectar cambios en el estado para actualizar isPending
  useEffect(() => {
    if (state !== prevState && isPending) {
      setIsPending(false);
      setPrevState(state);
    }
  }, [state, prevState, isPending]);

  const form = useForm<VersionFormValues>({
    resolver: zodResolver(versionFormSchema),
    defaultValues: {
      version: currentVersion,
      releaseNotes: "",
      downloadUrl: "",
      isCritical: false,
    },
  });

  const onSubmit = async (data: VersionFormValues) => {
    setIsPending(true);
    const formData = new FormData();
    formData.append("version", data.version);
    formData.append("releaseNotes", data.releaseNotes);
    formData.append("downloadUrl", data.downloadUrl || "");
    formData.append("isCritical", data.isCritical ? "true" : "false");
    
    startTransition(() => {
      formAction(formData);
    });
    // No desactivamos isPending aquí, lo haremos en el useEffect cuando el estado cambie
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center p-4 rounded-md bg-muted">
        <div className="flex-1">
          <div className="font-medium">Versión actual</div>
          <div className="text-2xl font-bold">{currentVersion}</div>
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
          <AlertTitle>Actualización completada</AlertTitle>
          <AlertDescription>
            {state.success}
            <p className="mt-2 font-medium">La aplicación ha sido actualizada correctamente y se han enviado las notificaciones.</p>
          </AlertDescription>
        </Alert>
      )}
      
      {state.info && (
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Información</AlertTitle>
          <AlertDescription>{state.info}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nueva versión</FormLabel>
                <FormControl>
                  <Input placeholder="1.0.0" {...field} />
                </FormControl>
                <FormDescription>
                  Utiliza el formato semántico: X.Y.Z (ejemplo: 1.0.0)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="releaseNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas de la versión</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detalla los cambios incluidos en esta versión..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Esta información será enviada a los usuarios por email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="downloadUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de descarga (opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://ejemplo.com/descargar"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  URL donde los usuarios pueden descargar esta versión.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isCritical"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Actualización crítica</FormLabel>
                  <FormDescription>
                    Marca esta opción si la actualización contiene correcciones de seguridad importantes.
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
            {isPending ? "Actualizando versión... Por favor espera" : "Actualizar versión y notificar a usuarios"}
          </Button>
        </form>
      </Form>
    </div>
  );
} 