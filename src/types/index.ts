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

export type AdditionalInfoFormProps = {
  userId: string;
};

export type SaveUserProfileProps = {
  userId: string;
  researchLab: string;
  academicYear: string;
};

export type EditProfileProps = {
  params: {
    userId: string;
  };
};
export type ProfileFormProps = {
  userId: string;
  defaultValues: {
    researchLab: string;
    academicYear: string;
  };
};
