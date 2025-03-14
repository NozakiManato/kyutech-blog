import { MarketingConfig } from "@/types";

export const marketingConfig: MarketingConfig = {
  mainNav: [
    {
      title: "特徴",
      href: "#features",
    },
    {
      title: "ブログ",
      href: "/blog",
    },
    {
      title: "価格",
      href: "/pricing",
    },
  ],
  techstack: [
    {
      title: "Next.js →",
      description:
        "Reactに基づいたフレームワークで、モダンなアプリ開発を大幅に効率化するための機能を提供しています",
      href: "https://nextjs.org/",
      svg: (
        <svg
          height="45"
          width="45"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M386.399 35.508C217.06-64.061 1.885 57.55.012 253.882c-1.828 191.716 201.063 315.545 370.02 231.163L185.56 213.636v167.997c0 18.614-35.619 18.614-35.619 0V156.421c0-14.776 27.448-15.989 35.226-3.145L395.43 470.572c157.95-101.737 155.817-338.136-9.031-435.064zm-23.756 317.939L326.91 298.87V149.458c0-13.932 35.732-13.932 35.732 0v203.989z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      title: "Tailwind css →",
      description:
        "よりオリジナリティの高いデザインのWebサイトを作成可能なCSSフレームワークです。",
      href: "https://tailwindcss.com/",
      svg: (
        <svg
          height="45"
          width="45"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 9.969q1-4.063 5-4.063c4 0 4.5 3.047 6.5 3.555q2 .508 3.5-1.524Q21 12 17 12c-4 0-4.5-3.047-6.5-3.555Q8.5 7.938 7 9.97m-5 6.094Q3 12 7 12c4 0 4.5 3.047 6.5 3.555q2 .507 3.5-1.524q-1 4.063-5 4.063c-4 0-4.5-3.047-6.5-3.555q-2-.508-3.5 1.524"
            fill="currentColor"
            fillRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: "shadcn/ui →",
      description:
        "モダンなウェブ開発環境において、UI構築を効率化するための便利なツールです。",
      href: "https://ui.shadcn.com/",
      svg: (
        <svg
          height="45"
          width="45"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.219 11.784L11.784 22.219a1.045 1.045 0 0 0 1.476 1.476L23.695 13.26a1.045 1.045 0 0 0-1.476-1.476M20.132.305L.305 20.132a1.045 1.045 0 0 0 1.476 1.476L21.608 1.781A1.045 1.045 0 0 0 20.132.305"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      title: "Prisma →",
      description:
        "Node.jsやTypeScript環境向けに設計された次世代ORMおよびデータベースツールキットです。",
      href: "https://www.prisma.io/",
      svg: (
        <svg
          height="45"
          width="45"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.807 18.285L13.553.756a1.324 1.324 0 0 0-1.129-.754a1.31 1.31 0 0 0-1.206.626l-8.952 14.5a1.356 1.356 0 0 0 .016 1.455l4.376 6.778a1.408 1.408 0 0 0 1.58.581l12.703-3.757c.389-.115.707-.39.873-.755s.164-.783-.007-1.145zm-1.848.752L9.18 22.224a.452.452 0 0 1-.575-.52l3.85-18.438c.072-.345.549-.4.699-.08l7.129 15.138a.515.515 0 0 1-.325.713z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      title: "Supabase →",
      description:
        "オープンソースのBaaSプラットフォームで、Firebaseの代替として注目されています。",
      href: "https://supabase.com/",
      svg: (
        <svg
          height="45"
          width="45"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      title: "OAuth →",
      description:
        "Next.jsアプリケーション向けのオープンソース認証ライブラリです。",
      href: "https://next-auth.js.org/",
      svg: (
        <svg
          height="45"
          width="45"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.98 7.448L19.62 0H4.347L2.02 7.448c-1.352 4.312.03 9.206 3.815 12.015L12.007 24l6.157-4.552c3.755-2.81 5.182-7.688 3.815-12.015l-6.16 4.58l2.343 7.45l-6.157-4.597l-6.158 4.58l2.358-7.433l-6.188-4.55l7.63-.045L12.008 0l2.356 7.404l7.615.044z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      title: "zod →",
      description:
        "TypeScriptファーストのスキーマ宣言およびバリデーションライブラリです。",
      href: "https://zod.dev/",
      svg: (
        <svg
          height="45"
          width="45"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.088 2.477L24 7.606L12.521 20.485l-.925 1.038L0 7.559l5.108-5.082h13.98Zm-17.434 5.2l6.934-4.003H5.601L1.619 7.636l.035.041Zm12.117-4.003L3.333 9.7l2.149 2.588l10.809-6.241l-.2-.346l2.851-1.646l-.365-.381h-4.806Zm7.52 2.834L8.257 14.034h5.101v-.4h3.667l5.346-5.998l-1.08-1.128Zm-7.129 10.338H9.268l2.36 2.843l2.534-2.843Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ],
};
