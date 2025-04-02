import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import MainNav from "./main-nav";
import { MainNavProps } from "@/types";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { getUserProfile } from "@/lib/prisma/user";

const Header = async ({ items }: MainNavProps) => {
  const { userId } = await auth();
  const profile = userId ? await getUserProfile(userId) : null;
  return (
    <header className="sticky top-0 border-b max-w-screen container z-40 bg-background">
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
            {profile ? (
              <Link
                href={`/dashboard/${profile.id}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                ダッシュボード →
              </Link>
            ) : (
              ""
            )}
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
