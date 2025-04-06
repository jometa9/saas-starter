"use client";

import { useState } from "react";
import { User } from "@/lib/db/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VersionUpdateForm from "./version-update-form";
import MassEmailForm from "./mass-email-form";

interface AdminLayoutProps {
  user: User;
  currentVersion: string;
}

export default function AdminLayout({ user, currentVersion }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState("version");

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona configuraciones de la aplicación y envía notificaciones a usuarios.
        </p>
      </div>

      <Tabs defaultValue="version" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="version">Actualización de Versión</TabsTrigger>
          <TabsTrigger value="email">Emails Masivos</TabsTrigger>
        </TabsList>

        <TabsContent value="version" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Versión</CardTitle>
              <CardDescription>
                Actualiza la versión de la aplicación y notifica a los usuarios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VersionUpdateForm currentVersion={currentVersion} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Envío de Emails Masivos</CardTitle>
              <CardDescription>
                Envía notificaciones o anuncios a todos los usuarios de la plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MassEmailForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 