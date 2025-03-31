"use client";
import { NavItem } from "@/types";
import Link from "next/link";
import React, { ReactNode } from "react";
import HamburgerMenu from "./hamburger-menu";
import Image from "next/image";

interface MainNavProps {
  items: NavItem[];
  children?: ReactNode;
}

const MainNav = ({ items }: MainNavProps) => {
  return (
    <div className=" flex items-center md:gap-10">
      <Link href={"/"} className="hidden md:flex items-center">
        <Image src="/icon.svg" alt="Icon" width="50" height="50" />
        <span className="font-bold hidden md:inline-block pl-1 md:text-4xl my-auto">
          LocaLabo
        </span>
      </Link>
      <nav className="md:flex gap-6 hidden">
        {items?.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="sm:text-sm font-medium hover:text-foreground/80 md:text-lg"
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
