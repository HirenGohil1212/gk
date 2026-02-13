import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Stethoscope, CloudSun, BarChart3, Sprout, Tractor, Globe, Handshake, Users, FlaskConical, ClipboardCheck } from 'lucide-react';
import { type Timestamp } from 'firebase/firestore';

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
    href: '/soil-testing',
    label: 'Book Soil Testing',
    icon: ClipboardCheck,
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
    href: '/equipment-rental',
    label: 'Equipment Rental',
    icon: Tractor,
  },
   {
    href: '/export-program',
    label: 'Export Program',
    icon: Globe,
  },
  {
    href: '/contract-farming',
    label: 'Contract Farming',
    icon: Handshake,
  },
  {
    href: '/our-partners',
    label: 'Our Partners',
    icon: Users,
  },
];

export const APP_NAME = "GrowKrishi";
export const APP_ICON = Sprout;

export enum LandArea {
    LESS_THAN_5 = 'LESS_THAN_5',
    BETWEEN_5_AND_10 = 'BETWEEN_5_AND_10',
    MORE_THAN_10 = 'MORE_THAN_10',
}

export const LAND_AREA_OPTIONS = [
    { value: LandArea.LESS_THAN_5, label: "< 5 Hectares" },
    { value: LandArea.BETWEEN_5_AND_10, label: "> 5 Hectares" },
    { value: LandArea.MORE_THAN_10, label: "> 10 Hectares" },
];

export type UserProfile = {
  uid: string;
  email: string;
  name: string;
  village: string;
  landArea: LandArea;
  createdAt: Timestamp;
};
