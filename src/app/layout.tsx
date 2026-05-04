
"use client";

import { useMemo, useEffect } from 'react';
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
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
  useSidebar,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/AppLogo';
import { NAV_ITEMS, LandArea } from '@/lib/constants';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

function UserMenu() {
  const { user, userProfile, logout, loading } = useAuth();
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === 'collapsed';

  if (loading) {
    return null;
  }

  if (!user || !userProfile) {
    return (
      <div className={cn("flex w-full", isCollapsed ? "flex-col gap-2" : "gap-2")}>
        <Link href="/auth/login" passHref className='w-full'>
          <Button variant="secondary" className="w-full">Login</Button>
        </Link>
        <Link href="/auth/register" passHref className='w-full'>
          <Button variant="outline" className="w-full">Register</Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start p-2 text-left",
            isCollapsed && "h-10 w-10 justify-center p-0"
          )}
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`https://avatar.vercel.sh/${user.uid}.png`} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name?.[0]}</AvatarFallback>
            </Avatar>
            {!isCollapsed && <span className="truncate">{userProfile.name}</span>}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userProfile.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppSidebarContent() {
  const pathname = usePathname();
  const { state: sidebarState, isMobile, setOpenMobile } = useSidebar();
  const { userProfile } = useAuth();
  const isCollapsed = sidebarState === "collapsed";

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const landAreaAccess: Record<LandArea, string[]> = {
    [LandArea.LESS_THAN_5]: ['/dashboard', '/diagnosis', '/soil-analysis', '/weather', '/pricing', '/crop-guide'],
    [LandArea.BETWEEN_5_AND_10]: ['/dashboard', '/diagnosis', '/soil-analysis', '/weather', '/pricing', '/crop-guide', '/soil-testing', '/equipment-rental'],
    [LandArea.MORE_THAN_10]: ['/dashboard', '/diagnosis', '/soil-analysis', '/weather', '/pricing', '/crop-guide', '/soil-testing', '/equipment-rental', '/export-program', '/contract-farming', '/our-partners'],
  };

  const accessibleNavItems = useMemo(() => {
    if (!userProfile) return NAV_ITEMS.filter(item => item.href === '/');
    const allowedHrefs = landAreaAccess[userProfile.landArea as LandArea] || [];
    return NAV_ITEMS.filter(item => allowedHrefs.includes(item.href));
  }, [userProfile]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <AppLogo collapsed={isCollapsed} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {accessibleNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  onClick={handleLinkClick}
                  isActive={pathname === item.href}
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
      <SidebarFooter className={cn("flex p-2", isCollapsed && "items-center")}>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

function MainContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isPublicPage = pathname === '/' || pathname.startsWith('/auth');

    if (!user && !isPublicPage) {
      router.push('/auth/login');
    } else if (user && pathname.startsWith('/auth')) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show full layout for authenticated users, or for everyone on the landing page/auth pages but hide sidebar if not logged in
  const showSidebar = user && pathname !== '/';

  if (!showSidebar) {
    return <div className="min-h-screen bg-background p-4 sm:p-6">{children}</div>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebarContent />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <AuthProvider>
          <MainContent>{children}</MainContent>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
