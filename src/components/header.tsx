import { cn } from "@/lib/utils";
import React from "react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import MainNav from "./main-nav";

const Header = () => {
  return (
    <header className="container z-40 bg-background">
      <div className="h-20 py-6 flex items-center justify-between">
        <MainNav />
        <nav>
          <Link
            href={"/login"}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            ログイン
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
