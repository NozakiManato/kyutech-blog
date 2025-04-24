"use cache";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { marketingConfig } from "@/config/marketing";
import { PageLayoutProps } from "@/types";

const MarketingLayout = ({ children }: PageLayoutProps) => {
  return (
    <>
      <Header items={marketingConfig.mainNav} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MarketingLayout;
