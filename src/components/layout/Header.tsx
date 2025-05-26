"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";

export function Header() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const currentNavItem = NAV_ITEMS.find(item => item.href === pathname);
  const pageTitle = currentNavItem ? currentNavItem.label : "AgriAssist";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:pt-4 sm:pb-2"
      )}
    >
      {isMobile && <SidebarTrigger />}
      <h1 className="text-xl font-semibold md:text-2xl">{pageTitle}</h1>
    </header>
  );
}
