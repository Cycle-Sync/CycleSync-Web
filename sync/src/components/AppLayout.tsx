// src/components/AppLayout.tsx
import { ReactNode } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar>
          <SidebarHeader />
          <SidebarContent>
            <SidebarGroup title="Main">
              <SidebarGroup.Item href="/app/dashboard">
                Dashboard
              </SidebarGroup.Item>
              <SidebarGroup.Item href="/app/calendar">
                Calendar
              </SidebarGroup.Item>
              <SidebarGroup.Item href="/app/entries">
                Entries
              </SidebarGroup.Item>
              <SidebarGroup.Item href="/app/profile">
                Profile
              </SidebarGroup.Item>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <ModeToggle />
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            {/* Optionally show page title here */}
          </header>
          <main className="p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
