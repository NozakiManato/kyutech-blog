import DashboardNav from "@/components/dashboard/dashboard-nav";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { dashboardConfig } from "@/config/dashboard";
import { PageLayoutProps } from "@/types";
import React from "react";

const DashboardLayout = ({ children }: PageLayoutProps) => {
  return (
    <>
      <Header items={dashboardConfig.mainNav} />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] pt-5">
        <aside className="hidden md:flex w-52 flex-col">
          <DashboardNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex flex-col w-full flex-1 overflow-hidden">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default DashboardLayout;
