import { Icon } from "@/components/icons/icon";
import { DashboardConfig } from "@/types";

export const dashboardConfig: DashboardConfig = {
  mainSidebarNav: [
    {
      title: "ダッシュボード",
      href: "/dashboard",
      icon: Icon.laptop,
    },
    {
      title: "記事投稿",
      href: "/dashboard/blogs",
      icon: Icon.post,
    },
    {
      title: "プロフィール",
      href: "/dashboard/profiles",
      icon: Icon.user,
    },
  ],
  supportSidebarNav: [
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
