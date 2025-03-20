import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { marketingConfig } from "@/config/marketing";
import { MarketingLayoutProps } from "@/types";

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
