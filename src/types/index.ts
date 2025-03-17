import { HandleOAuthCallbackParams } from "@clerk/types";
import { ReactNode } from "react";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};
export type TechStack = {
  title: string;
  description: string;
  href: string;
  svg: ReactNode;
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    instagram: string;
    github: string;
  };
};

export type MarketingConfig = {
  mainNav: NavItem[];
  techstack: TechStack[];
};

export type SSOCallbackPageProps = {
  searchParams: HandleOAuthCallbackParams;
};
