import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const IndexPage = () => {
  return (
    <>
      <section className="pt-6 md:pt-10 lg:py-32 pb-8 md:pb-12">
        <div className="container text-center flex flex-col items-center gap-4 max-w-4xl">
          <Link
            href={"/"}
            className="bg-muted px-4 py-1.5 rounded-2xl font-medium text-sm"
          >
            Xをフォローする
          </Link>
          <h1 className="font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            LocaLabo
          </h1>
          <p className="text-muted-foreground sm:text-xl leading-normal">
            このアプリケーションは芹川・張・山脇・陽研究室の在室管理システムです。
            ユーザーは在室と退室を記録することができます。※B4は特に重要!!!
          </p>
          <div className="space-x-4">
            <Link
              href={"/login"}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              始める
            </Link>
            <Link
              href={"https://github.com/NozakiManato"}
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
              target="_blank"
              rel="noreferrer"
            >
              Github
            </Link>
          </div>
        </div>
      </section>
      <section></section>
      <section></section>
    </>
  );
};

export default IndexPage;
