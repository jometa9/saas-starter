"use client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="width-full">
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
