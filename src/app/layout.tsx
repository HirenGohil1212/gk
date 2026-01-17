
"use client";

import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/AppLogo';
import { NAV_ITEMS, APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header';


const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

// export const metadata: Metadata = {
//   title: APP_NAME,
//   description: 'Your helpful agritech assistant.',
// };

function AppSidebarContent() {
  const pathname = usePathname();
  const { state: sidebarState, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <AppLogo collapsed={isCollapsed} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  onClick={handleLinkClick}
                  isActive={pathname === item.href || (pathname === '/' && item.href === '/')}
                  tooltip={{ children: item.label, side: 'right', align: 'center' }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className={cn(isCollapsed && "items-center")}>
        {/* Auth related buttons were here */}
      </SidebarFooter>
    </Sidebar>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const pathname = usePathname(); // Removed as it's no longer used
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
          <SidebarProvider defaultOpen={true}>
            <AppSidebarContent />
            <SidebarInset>
              <Header />
              <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
