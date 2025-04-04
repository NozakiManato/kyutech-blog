import { Post } from "@prisma/client";
import { LucideIcon } from "lucide-react";
import React, { ComponentType, JSX } from "react";
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
  name: string;
  imageUrl: string;
  researchLab: string;
  academicYear: string;
  description: string;
  github: string;
  x: string;
  instagram: string;
  isCheckedIn: boolean;
};

export type EditProfileProps = {
  params: {
    userId: string;
  };
};
export type ProfileFormProps = {
  userId: string;
};
export type MainNavProps = {
  items: NavItem[];
};

export type PageLayoutProps = {
  children: ReactNode;
};

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon: ComponentType<any>;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavItem[];
    }
);

export type DashboardConfig = {
  mainSidebarNav: SidebarNavItem[];
  supportSidebarNav: SidebarNavItem[];
};

export type DashboardNavProps = {
  mainItems: SidebarNavItem[];
  supportItems: SidebarNavItem[];
  userId: string;
};

export type DashBoardShellProps = React.HTMLAttributes<HTMLDivElement>;

export type DashBoardHeaderProps = {
  heading: string;
  text?: string;
  children: React.ReactNode;
};
export type PostItemProps = {
  post: Pick<Post, "id" | "title" | "published" | "createdAt">;
};

export type PostCardProps = {
  post: {
    id: string;
    title: string;
    content: any;
    published: boolean;
    createdAt: Date;
    author?: {
      id: string;
      name: string;
      researchLab: string;
      academicYear: string;
    };
  };
  profile: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    researchLab: string;
    academicYear: string;
  };
};

export type PostOperationsProps = {
  post: Pick<Post, "id" | "title">;
};

export type DataProps = {
  title: string;
  content: any;
  published: boolean;
  authorId: string;
};

export type PostFormProps = {
  authorId: string;
  post?: {
    id: string;
    title: string;
    content: any;
    published: boolean;
  };
  isEditing?: boolean;
};

export type EditPostPageProps = {
  params: {
    postId: string;
  };
};

export type profileProps = {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  researchLab: string;
  academicYear: string;
  description: string | "";
  isCheckedIn: boolean;
  github: string | "";
  x: string | "";
  instagram: string | "";
};

export type editProfileProps = {
  name: string;
  researchLab: string;
  academicYear: string;
  description: string;
  github: string;
  x: string;
  instagram: string;
};
export interface TechSkill {
  id: string;
  name: string;
  category:
    | "frontend"
    | "backend"
    | "database"
    | "image"
    | "ai"
    | "devops"
    | "other";
  iconName?: string;
}

export interface IconMapping {
  [key: string]: (props?: { className?: string }) => JSX.Element;
}

export interface CategoryIconMapping {
  [key: string]: LucideIcon;
}

export interface ProfileCardProps {
  initialProfile: profileProps;
}
