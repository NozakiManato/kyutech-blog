"use client";

import { DashboardNavProps } from "@/types";
import { usePathname } from "next/navigation";
import { Icon as Icons } from "../icons/icon";
import Link from "next/link";

const DashboardNav = ({ items }: DashboardNavProps) => {
  const path = usePathname();

  if (!items.length) {
    return null;
  }
  return (
    <nav>
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          <Link href={item.href!} key={index}>
            <span
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent text-accent-foreground ${
                path === item.href
              } ? "bg-accent": "bg-transparent" `}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default DashboardNav;
