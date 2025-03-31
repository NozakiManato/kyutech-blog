import { Icon } from "@/components/icons/icon";
import { DashboardConfig } from "@/types";

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "ダッシュボード",
      href: "/dashboard",
      icon: Icon.laptop,
    },
    {
      title: "記事投稿",
      href: "/dashboard/blog",
      icon: Icon.post,
    },
    {
      title: "プロフィール",
      href: "/dashboard/profile",
      icon: Icon.user,
    },
    {
      title: "ドキュメント",
      href: "/docs",
      icon: Icon.page,
    },
    {
      title: "サポート",
      href: "/support",
      icon: Icon.help,
    },
    {
      title: "設定",
      href: "/dashboard/settings",
      icon: Icon.settings,
    },
  ],
};
