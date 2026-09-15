import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Gauge,
  History,
  Mic,
  Phone,
  Plug,
  ScrollText,
  Search,
  Settings,
  SlidersHorizontal,
  Users,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: Gauge },
  { label: "Live Calls", href: "/live-calls", icon: Phone },
  { label: "Live Detection", href: "/live-detection", icon: Mic },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "Investigations", href: "/investigations", icon: Search },
  { label: "Call History", href: "/call-history", icon: History },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Integrations", href: "/settings/integrations", icon: Plug },
  { label: "Policies", href: "/settings/policies", icon: SlidersHorizontal },
  { label: "Team", href: "/settings/team", icon: Users },
  { label: "Audit Log", href: "/settings/audit-log", icon: ScrollText },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const ALL_NAV: NavItem[] = [...PRIMARY_NAV, ...ADMIN_NAV];
