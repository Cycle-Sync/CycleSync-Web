// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarHeader,
// } from "@/components/ui/sidebar"

// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarHeader />
//       <SidebarContent>
//         <SidebarGroup />
//         <SidebarGroup />
//       </SidebarContent>
//       <SidebarFooter />
//     </Sidebar>
//   )
// }
"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Jane Doe",
    email: "jane@example.com",
    avatar: "/avatars/jane.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/", icon: IconDashboard },
    { title: "Cycle Tracker", url: "#", icon: IconListDetails },
    { title: "Hormone Analytics", url: "#", icon: IconChartBar },
    { title: "Symptoms Log", url: "#", icon: IconFileDescription },
    { title: "Health Insights", url: "#", icon: IconReport },
  ],
  navClouds: [
    {
      title: "Cycle History",
      icon: IconFolder,
      url: "#",
      items: [
        { title: "Current Cycle", url: "#" },
        { title: "Past Cycles", url: "#" },
      ],
    },
    {
      title: "Symptoms",
      icon: IconFileDescription,
      url: "#",
      items: [
        { title: "Log New Symptom", url: "#" },
        { title: "Symptom Trends", url: "#" },
      ],
    },
  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: IconSettings },
    { title: "Help & Support", url: "#", icon: IconHelp },
    { title: "Search Cycles", url: "#", icon: IconSearch },
  ],
  documents: [
    { name: "Health Records", url: "#", icon: IconDatabase },
    { name: "Reports", url: "#", icon: IconReport },
    { name: "Doctor Notes", url: "#", icon: IconFileWord },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">CycleSync.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
