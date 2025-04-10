"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LabFilter() {
  const [labs, setLabs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabs();
  }, []);

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 w-24 bg-muted rounded-md animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-2">
          <Link href="/localabo">
            <Button
              variant={pathname === "/localabo" ? "default" : "outline"}
              size="sm"
            >
              全研究室
            </Button>
          </Link>
          {labs.map((lab) => (
            <Link key={lab} href={`/localabo/${encodeURIComponent(lab)}`}>
              <Button
                variant={
                  pathname === `/localabo/${encodeURIComponent(lab)}`
                    ? "default"
                    : "outline"
                }
                size="sm"
              >
                {lab}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
