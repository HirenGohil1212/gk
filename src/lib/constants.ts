import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Stethoscope, CloudSun, BarChart3, BookText, Leaf } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: NavItem[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/diagnosis',
    label: 'Smart Diagnosis',
    icon: Stethoscope,
  },
  {
    href: '/weather',
    label: 'Weather Insights',
    icon: CloudSun,
  },
  {
    href: '/pricing',
    label: 'Crop Pricing',
    icon: BarChart3,
  },
  {
    href: '/resources',
    label: 'Resource Directory',
    icon: BookText,
  },
];

export const APP_NAME = "AgriAssist";
export const APP_ICON = Leaf;
