"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";

export const SidebarClient = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      {children}
    </SidebarProvider>
  );
};
