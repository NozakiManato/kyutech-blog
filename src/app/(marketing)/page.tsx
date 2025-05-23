"use cache";
import { Card, CardContent } from "@/components/ui/card";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import Link from "next/link";

const IndexPage = async () => {
  return (
    <>
      <section className="pt-6 md:pt-10 lg:py-32 pb-8 md:pb-12">
        <div className="container text-center flex flex-col items-center gap-4 max-w-4xl">
          <h1 className="font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            LocaLabo
          </h1>
          <p className="text-muted-foreground sm:text-xl leading-normal">
            このアプリケーションは芹川・張・山脇・楊研究室の在室管理システムです。
            ユーザーは在室と退室を記録することができます。※B4は特に重要!!!
            Notionライクなテキストエディターを構築しており、週報や研究、就活ハウツーなど何でも書いてください!!!
          </p>
        </div>
      </section>
      <section
        id="features"
        className="container py-8 md:py-12 lg:py-24 bg-slate-100 space-y-6"
      >
        <div className="text-center space-y-6 ">
          <h2 className="font-extrabold text-3xl md:text-6xl mx-auto">
            サービスの特徴
          </h2>
          <p className="max-w-4xl mx-auto text-muted-foreground sm:text-lg sm:leading-7">
            このプロジェクトはモダンな技術スタックを使って作ったWebアプリケーションです。Next.jsのAppRouterやEditor.jsを利用してNotionのような書き心地でブログ投稿ができます。
          </p>
        </div>

        <Card className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {marketingConfig.techstack.map((item, index) => (
            <CardContent key={index}>
              <Link href={item.href}>
                <div className="flex h-full items-center space-x-4 rounded-md border p-4 hover:bg-gray-200">
                  {item.svg}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            </CardContent>
          ))}
        </Card>
      </section>
      <section id="contact" className="container py-8 md:py-12 lg:py-24">
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-4">
          <h2 className="font-extrabold text-3xl md:text-6xl">Contact Me</h2>
          <p className="text-muted-foreground sm:text-lg sm:leading-7">
            もしもWebサービスが気に入った場合は下記Instagramからご連絡ください。
            <br />
            お仕事のご連絡お待ちしております。
          </p>
          <Link
            href={siteConfig.links.instagram}
            className="underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            お仕事はInstagramまで
          </Link>
        </div>
      </section>
    </>
  );
};

export default IndexPage;
