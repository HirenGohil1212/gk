
"use client";

import { 
  Sun, Moon, CloudSun, CloudMoon, Cloud, Cloudy, 
  CloudDrizzle, CloudRain, CloudLightning, CloudSnow, CloudFog 
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const getLucideIcon = (iconCode: string): LucideIcon => {
  if (!iconCode) return Cloud; // Default icon
  const mainPart = iconCode.substring(0, 2);
  switch (mainPart) {
    case '01': return iconCode.endsWith('n') ? Moon : Sun;
    case '02': return iconCode.endsWith('n') ? CloudMoon : CloudSun;
    case '03': return Cloud;
    case '04': return Cloudy;
    case '09': return CloudDrizzle; // Shower rain
    case '10': return CloudRain;   // Rain
    case '11': return CloudLightning; // Thunderstorm
    case '13': return CloudSnow;   // Snow
    case '50': return CloudFog;    // Mist/Fog
    default: return Cloud; // Fallback for unknown codes
  }
};
