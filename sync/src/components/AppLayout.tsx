// src/components/AppLayout.tsx
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const path = location.pathname;
  const isActive = (to: string) => path.startsWith(to);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar collapsible="icon" variant="floating">
          <SidebarHeader className="flex items-center justify-between">
            <h1 className="text-lg font-bold">CycleSync</h1>
            {/* Collapse/Expand toggle */}
            <SidebarTrigger />
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/app/dashboard")}
                  tooltip="Dashboard"
                >
                  <Link to="/app/dashboard">Dashboard</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/app/calendar")}
                  tooltip="Calendar"
                >
                  <Link to="/app/calendar">Calendar</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/app/entries")}
                  tooltip="Entries"
                >
                  <Link to="/app/entries">Entries</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/app/profile")}
                  tooltip="Profile"
                >
                  <Link to="/app/profile">Profile</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="flex items-center justify-center">
            <ModeToggle />
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            {/* Optional: page title */}
          </header>
          <main className="p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
