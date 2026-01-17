
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Stethoscope, CloudSun, BarChart3, BookText, Leaf, FlaskConical, Users, ShieldCheck, Sprout, Tractor, Globe } from 'lucide-react';

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
    href: '/soil-analysis',
    label: 'Soil Analysis',
    icon: FlaskConical,
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
    href: '/crop-guide',
    label: 'Crop Nutrient Guide',
    icon: Sprout,
  },
  {
    href: '/resources',
    label: 'Resource Directory',
    icon: BookText,
  },
  {
    href: '/equipment-rental',
    label: 'Equipment Rental',
    icon: Tractor,
  },
  {
    href: '/export-program',
    label: 'Export Program',
    icon: Globe,
  },
];

export const APP_NAME = "GrowKrishi";
export const APP_ICON = Leaf;

// UserRole enum, USER_ROLES_OPTIONS, and UserProfile type removed as auth module is disabled.
// export enum UserRole {
//   Farmer = "Farmer",
//   Supplier = "Supplier",
//   SoilTestLab = "Soil Test Lab",
//   DroneCompany = "Drone Company",
//   Admin = "Admin",
// }

// export const USER_ROLES_OPTIONS = [
//   { value: UserRole.Farmer, label: "Farmer" },
//   { value: UserRole.Supplier, label: "Supplier" },
//   { value: UserRole.SoilTestLab, label: "Soil Test Lab" },
//   { value: UserRole.DroneCompany, label: "Drone Company" },
//   { value: UserRole.Admin, label: "Administrator" },
// ];

// export type UserProfile = {
//   uid: string;
//   email: string | null;
//   role: UserRole;
//   displayName?: string;
//   createdAt: any; // Firestore Timestamp
// };
