import { siteConfig } from "@/config/site";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="container py-10 md:py-0 md:h-24">
        <p className="text-center text-sm md:text-left">
          Built by {""}
          <Link
            href={siteConfig.links.github}
            className="underline underline-offset-4 font-medium"
            target="_blank"
            rel="noreferrer"
          >
            NozakiManato
          </Link>
          . Hosted on {""}
          <Link
            href={"https://vercel.com"}
            className="underline underline-offset-4 font-medium"
            target="_blank"
            rel="noreferrer"
          >
            Vercel
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
