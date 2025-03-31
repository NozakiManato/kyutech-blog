import DashboardNav from "@/components/dashboard/dashboard-nav";
import Footer from "@/components/footer/footer";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { dashboardConfig } from "@/config/dashboard";
import { PageLayoutProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const DashboardLayout = ({ children }: PageLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] pt-5">
        <aside className="hidden md:flex w-52 flex-col">
          <AppSidebar items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex flex-col w-full flex-1 overflow-hidden">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
