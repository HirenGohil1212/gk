import Link from 'next/link';
import { APP_NAME, APP_ICON as AppIcon } from '@/lib/constants';

export function AppLogo({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 px-2 py-1">
      <AppIcon className="h-8 w-8 text-primary" />
      {!collapsed && (
        <span className="text-xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
          {APP_NAME}
        </span>
      )}
    </Link>
  );
}
