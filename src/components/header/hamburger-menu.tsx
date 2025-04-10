"use client";
import { NavItem } from "@/types";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";

interface MobileNavProps {
  items: NavItem[];
}

const HamburgerMenu = ({ items }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [labs, setLabs] = useState<string[]>([]);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await fetch("/api/labs");
        if (!response.ok) {
          throw new Error("Failed to fetch labs");
        }
        const data = await response.json();
        setLabs(data);
      } catch (error) {
        console.error("Error fetching labs:", error);
      }
    };

    fetchLabs();
  }, []);

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-white p-4 shadow-lg">
          <SheetTitle className="flex flex-col space-y-4">
            <Link
              href="/localabo"
              onClick={() => setIsOpen(false)}
              className="font-extrabold text-2xl "
            >
              <div className="flex  text-center m-auto">
                <Image src={"/icon.svg"} alt="Icon" width={50} height={50} />
                <div className="my-auto">LocaLabo</div>
              </div>
            </Link>
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="hover:text-blue-500"
              >
                {item.title}
              </Link>
            ))}
            <div className="pt-2 border-t">
              <div className="font-semibold mb-2">研究室</div>
              {labs.map((lab) => (
                <Link
                  key={lab}
                  href={`/localabo/${encodeURIComponent(lab)}`}
                  onClick={() => setIsOpen(false)}
                  className="block hover:text-blue-500"
                >
                  {lab}
                </Link>
              ))}
            </div>
          </SheetTitle>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HamburgerMenu;
