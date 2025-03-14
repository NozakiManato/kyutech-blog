import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { marketingConfig } from "@/config/marketing";
import React, { ReactNode } from "react";

type MarketingLayoutProps = {
  children: ReactNode;
};

const MarketingLayout = ({ children }: MarketingLayoutProps) => {
  return (
    <>
      <Header items={marketingConfig.mainNav} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MarketingLayout;
