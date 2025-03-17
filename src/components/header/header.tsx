import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import MainNav from "./main-nav";
import { NavItem } from "@/types";

interface MainNavProps {
  items: NavItem[];
}

const Header = ({ items }: MainNavProps) => {
  return (
    <header className="container z-40 bg-background">
      <div className="h-20 py-6 flex items-center justify-between">
        <MainNav items={items} />
        <nav>
          <Link
            href={"/sign-in"}
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
