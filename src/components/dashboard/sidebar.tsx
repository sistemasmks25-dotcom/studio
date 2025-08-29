"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  KeyRound,
  Users,
  Building,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "../logo";

const menuItems = [
  { href: "/dashboard", label: "Passwords", icon: KeyRound },
  { href: "/dashboard/departments", label: "Departments", icon: Building },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <Link href="/">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
