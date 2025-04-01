import DashboardHeader from "@/components/dashboard/blogs/dashboard-header";
import DashBoardShell from "@/components/dashboard/blogs/dashboard-shell";

import React from "react";

const DashboardPage = async () => {
  return (
    <DashBoardShell>
      <DashboardHeader heading="ダッシュボード" text="記事の投稿と管理">
        <></>
      </DashboardHeader>
    </DashBoardShell>
  );
};

export default DashboardPage;
