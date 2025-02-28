"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "../ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar className="w-64 h-full border-r bg-white dark:bg-gray-900">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
            Navigation
          </p>
        </SidebarGroup>
        <SidebarGroup>
          <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
            Settings
          </p>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
