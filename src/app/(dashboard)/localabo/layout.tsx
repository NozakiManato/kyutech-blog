import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { PageLayoutProps } from "@/types";
import { marketingConfig } from "@/config/marketing";

const LocalaboLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header items={marketingConfig.mainNav} />
      <main className="flex-1 container py-6">{children}</main>
      <Footer />
    </div>
  );
};

export default LocalaboLayout;
