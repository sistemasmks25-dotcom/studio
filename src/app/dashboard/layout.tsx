import { Dashboard } from "@/components/dashboard/dashboard-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Dashboard | Fortress',
  description: 'Manage your passwords securely.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Dashboard>{children}</Dashboard>;
}
