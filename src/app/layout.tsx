
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
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { LogOut, LogIn } from 'lucide-react'; // Added LogIn
import { Header } from '@/components/layout/Header';
import { AuthProvider, useAuth } from '@/contexts/AuthContext'; // Added AuthProvider and useAuth
import { signOut } from '@/lib/firebase/authService'; // Added signOut
import { useToast } from '@/hooks/use-toast'; // Added useToast

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
  const router = useRouter();
  const { toast } = useToast();
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";
  const { currentUser, userProfile } = useAuth(); // Get currentUser and profile

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push('/auth/login'); // Redirect to login page after sign out
    } catch (error) {
      console.error("Sign out error", error);
      toast({ title: "Sign Out Error", description: "Failed to sign out. Please try again.", variant: "destructive" });
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
        {currentUser ? (
          <Button variant="ghost" className={cn("w-full justify-start gap-2", isCollapsed && "justify-center w-auto p-2")} onClick={handleSignOut}>
            <LogOut />
            {!isCollapsed && <span>Log Out {userProfile?.displayName && `(${userProfile.displayName})`}</span>}
          </Button>
        ) : (
          <Link href="/auth/login" passHref className="w-full">
            <Button variant="ghost" className={cn("w-full justify-start gap-2", isCollapsed && "justify-center w-auto p-2")}>
              <LogIn />
              {!isCollapsed && <span>Log In</span>}
            </Button>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth/');

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
          {isAuthPage ? (
            <>
              {children}
              <Toaster />
            </>
          ) : (
            <SidebarProvider defaultOpen={true}>
              <AppSidebarContent />
              <SidebarInset>
                <Header />
                <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          )}
          {!isAuthPage && <Toaster /> /* Render Toaster outside SidebarProvider for non-auth pages */}
        </AuthProvider>
      </body>
    </html>
  );
}
