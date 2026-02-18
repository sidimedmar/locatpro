"use client";

import {
  Building2,
  LayoutDashboard,
  Users,
  FileText,
  Database,
  Wallet,
  Wrench,
  Activity,
  Map,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export type View = "dashboard" | "properties" | "map" | "payments" | "maintenance" | "reports" | "activity";

interface SidebarProps {
  view: View;
  onViewChange: (view: View) => void;
  counts?: {
    properties: number;
    pendingMaintenance: number;
  };
}

const NAV_ITEMS: { key: View; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { key: "properties", label: "إدارة العقارات", icon: Users },
  { key: "map", label: "الخريطة", icon: Map },
  { key: "payments", label: "المدفوعات", icon: Wallet },
  { key: "maintenance", label: "الصيانة", icon: Wrench },
  { key: "reports", label: "التقارير", icon: FileText },
  { key: "activity", label: "سجل النشاط", icon: Activity },
];

export default function Sidebar({ view, onViewChange, counts }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? "w-full md:w-20" : "w-full md:w-64"} bg-primary text-primary-foreground flex flex-col shadow-xl z-20 sticky top-0 md:h-screen shrink-0 transition-all duration-300`}>
      <div className="p-4 md:p-6 flex items-center gap-3 border-b border-white/10">
        <Building2 className="w-8 h-8 text-secondary shrink-0" />
        {!collapsed && <h1 className="text-xl font-bold leading-tight hidden md:block">LocatPro</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex mr-auto p-1 hover:bg-white/10 rounded-lg transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 p-2 md:p-4 space-y-1 overflow-y-auto overflow-x-hidden">
        <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const badgeCount =
              item.key === "maintenance" ? counts?.pendingMaintenance :
              item.key === "properties" ? counts?.properties : undefined;

            return (
              <button
                key={item.key}
                onClick={() => onViewChange(item.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  view === item.key
                    ? "bg-secondary text-secondary-foreground font-bold"
                    : "hover:bg-white/10"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="hidden md:inline">{item.label}</span>}
                <span className="md:hidden">{item.label}</span>
                {badgeCount !== undefined && badgeCount > 0 && (
                  <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full mr-auto">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className={`p-4 mt-auto border-t border-white/10 ${collapsed ? "hidden md:block" : ""}`}>
        <div className="flex items-center gap-3 px-2 py-2 text-white/70 text-xs">
          <Database className="w-4 h-4 text-green-400 shrink-0" />
          {!collapsed && <span className="hidden md:inline">{"Neon PostgreSQL - متصل"}</span>}
        </div>
        {!collapsed && (
          <div className="hidden md:block bg-white/5 rounded-lg p-3 text-[10px] text-white/60 mt-2">
            <p>{"LocatPro v2.0 Pro"}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
