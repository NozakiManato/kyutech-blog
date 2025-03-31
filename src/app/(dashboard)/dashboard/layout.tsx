"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { CustomTrigger } from "@/components/sidebar/custom-trigger";
import { SidebarProvider } from "@/components/ui/sidebar";
import { dashboardConfig } from "@/config/dashboard";
import { PageLayoutProps } from "@/types";
import { useState } from "react";

const DashboardLayout = ({ children }: PageLayoutProps) => {
  const [open, setOpen] = useState(false);
  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar
        mainItems={dashboardConfig.mainSidebarNav}
        supportItems={dashboardConfig.supportSidebarNav}
      />

      <main className="container flex flex-col w-full flex-1 overflow-hidden">
        <CustomTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
