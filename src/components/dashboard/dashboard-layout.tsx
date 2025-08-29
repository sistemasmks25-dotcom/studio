"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";
import { Header } from "./header";

export function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
