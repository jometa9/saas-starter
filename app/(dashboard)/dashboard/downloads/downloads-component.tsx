"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Windows, Apple, Linux } from "lucide-react";

export function Downloads() {
  const downloads = [
    {
      id: "windows",
      name: "Windows",
      version: "v1.0.0",
      icon: <Windows className="h-6 w-6" />,
      description: "Download IPTRADE for Windows 7/8/10/11",
      downloadUrl: "/downloads/iptrade-windows.exe",
      size: "15.2 MB",
    },
    {
      id: "macos",
      name: "macOS",
      version: "v1.0.0",
      icon: <Apple className="h-6 w-6" />,
      description: "Download IPTRADE for macOS 10.12 or higher",
      downloadUrl: "/downloads/iptrade-macos.dmg",
      size: "18.5 MB",
    },
    {
      id: "linux",
      name: "Linux",
      version: "v1.0.0",
      icon: <Linux className="h-6 w-6" />,
      description: "Download IPTRADE for Linux (Ubuntu 18.04 or higher)",
      downloadUrl: "/downloads/iptrade-linux.deb",
      size: "16.8 MB",
    },
  ];

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">
        Download IPTRADE
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {downloads.map((download) => (
          <Card key={download.id} className="hover:shadow-lg transition-shadow w-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {download.icon}
                </div>
                <div>
                  <CardTitle>{download.name}</CardTitle>
                  <p className="text-sm text-gray-500">{download.version}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{download.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{download.size}</span>
                <Button asChild>
                  <a
                    href={download.downloadUrl}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-medium mb-2">Installation Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>Download the appropriate version for your operating system</li>
          <li>Run the installer and follow the on-screen instructions</li>
          <li>Launch IPTRADE and configure your Master and Slave accounts</li>
          <li>Start copying trades between your MetaTrader platforms</li>
        </ol>
      </div>
    </section>
  );
} 