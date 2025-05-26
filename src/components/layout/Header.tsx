
"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function LanguageSwitcher() {
  const { toast } = useToast();

  const handleLanguageSelect = (lang: string) => {
    toast({
      title: "Language Switcher",
      description: `Platform language selection (${lang}) is a feature planned for the future.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageSelect("English")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageSelect("Español")}>
          Español
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageSelect("Français")}>
          Français
        </DropdownMenuItem>
        {/* Add more placeholder languages here if desired */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
      <div className="ml-auto flex items-center gap-2">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
