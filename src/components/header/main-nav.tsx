"use client";
import { NavItem } from "@/types";
import Link from "next/link";
import React, { ReactNode } from "react";
import HamburgerMenu from "./hamburger-menu";

interface MainNavProps {
  items: NavItem[];
  children?: ReactNode;
}

const MainNav = ({ items }: MainNavProps) => {
  return (
    <div className=" flex items-center md:gap-10">
      <Link href={"/"} className="hidden md:flex items-center">
        <img src="/icon.svg" alt="Icon" width="50" height="50" />
        <span className="font-bold hidden md:inline-block pl-1">LocaLabo</span>
      </Link>
      <nav className="md:flex gap-6 hidden">
        {items?.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="text-lg sm:text-sm font-medium hover:text-foreground/80"
          >
            {item.title}
          </Link>
        ))}
      </nav>
      <HamburgerMenu items={items} />
    </div>
  );
};

export default MainNav;
