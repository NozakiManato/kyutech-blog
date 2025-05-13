import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { ClerkProvider } from "@clerk/nextjs";
import { jaJP } from "@clerk/localizations";
import { Toaster } from "sonner";
import { Providers } from "./providers";

const fontNotoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  manifest: "/site.webmanifest",
  description: siteConfig.description,
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  keywords: [
    "Localalabo",
    "九工大",
    "電子システム工学科",
    "4研",
    "ロカラボ",
    "九州工業大学",
    "九工大4研",
  ],
  authors: [
    {
      name: "NozakiManato",
      url: siteConfig.url,
    },
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.ogImage,
        width: 192,
        height: 192,
        alt: siteConfig.name,
      },
    ],
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ClerkProvider localization={jaJP}>
      <html lang="ja">
        <body
          className={cn(
            "bg-background antialiased min-h-screen",
            fontNotoSansJP.className
          )}
        >
          <Providers>{children}</Providers>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
