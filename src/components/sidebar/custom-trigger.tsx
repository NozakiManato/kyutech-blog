"use client";
import { Icon } from "../icons/icon";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button onClick={toggleSidebar} size="icon" variant={"outline"}>
      <Icon.sidebar />
    </Button>
  );
}
