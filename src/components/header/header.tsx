import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import MainNav from "./main-nav";
import { MainNavProps } from "@/types";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { getUserProfile } from "@/lib/prisma/user";
import { getAllLabs } from "@/lib/prisma/lab";

const Header = async ({ items }: MainNavProps) => {
  const { userId } = await auth();
  const profile = userId ? await getUserProfile(userId) : null;
  const labs = await getAllLabs();

  return (
    <header className="sticky top-0 border-b z-40 bg-background w-full">
      <div className="container mx-auto h-20 py-6 flex items-center justify-between">
        <MainNav items={items} />
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            {labs.map((lab) => (
              <Link
                key={lab}
                href={`/localabo/${encodeURIComponent(lab)}`}
                className="text-sm font-medium hover:text-foreground/80"
              >
                {lab}
              </Link>
            ))}
          </div>
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
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" })
                )}
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
      </div>
    </header>
  );
};

export default Header;
