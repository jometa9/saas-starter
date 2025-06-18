import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 pt-0 gap-4 text-center">
      <h1 className="text-8xl font-bold">404</h1>
      <h1 className="text-4xl font-bold">Page Not Found</h1>
      <p className="text-sm text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
