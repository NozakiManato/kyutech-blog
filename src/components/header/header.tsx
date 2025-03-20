import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import MainNav from "./main-nav";
import { NavItem } from "@/types";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

interface MainNavProps {
  items: NavItem[];
}

const Header = ({ items }: MainNavProps) => {
  return (
    <header className="sticky top-0 border-b container z-40 bg-background">
      <div className="h-20 py-6 flex items-center justify-between">
        <MainNav items={items} />
        <div>
          <SignedOut>
            <Link
              href={"/sign-in"}
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "mr-2"
              )}
            >
              ログイン
            </Link>
            <Link
              href={"/sign-up"}
              className={cn(buttonVariants({ variant: "default", size: "lg" }))}
            >
              新規登録
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
