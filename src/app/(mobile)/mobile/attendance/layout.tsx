import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function MobileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href={"/localabo"} className="items-center flex">
              <Image src="/icon.svg" alt="Icon" width="50" height="50" />
              <span className="font-bold inline-block pl-1 text-4xl my-auto">
                LocaLabo
              </span>
            </Link>
          </div>
        </div>
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
      </header>
      <main className="flex-1">
        <div className="container py-4">
          <Card className="container py-4">
            <CardContent className="p-2 md:p-4">{children}</CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
