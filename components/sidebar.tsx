"use client";

import {
  Building2,
  LayoutDashboard,
  Users,
  FileText,
  Database,
  Wallet,
  Wrench,
} from "lucide-react";

type View = "dashboard" | "properties" | "payments" | "maintenance" | "reports";

interface SidebarProps {
  view: View;
  onViewChange: (view: View) => void;
}

const NAV_ITEMS: { key: View; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { key: "properties", label: "إدارة المستأجرين", icon: Users },
  { key: "payments", label: "المدفوعات", icon: Wallet },
  { key: "maintenance", label: "الصيانة", icon: Wrench },
  { key: "reports", label: "التقارير الشهرية", icon: FileText },
];

export default function Sidebar({ view, onViewChange }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 bg-primary text-primary-foreground flex flex-col shadow-xl z-20 sticky top-0 md:h-screen shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <Building2 className="w-8 h-8 text-secondary" />
        <div>
          <h1 className="text-xl font-bold leading-tight">LocatPro</h1>
          <p className="text-[10px] text-white/50">{"نظام إدارة العقارات"}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onViewChange(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                view === item.key
                  ? "bg-secondary text-secondary-foreground font-bold"
                  : "hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="pt-4 border-t border-white/10 mt-4">
          <p className="text-[10px] uppercase tracking-widest text-white/50 px-4 mb-2">
            {"قاعدة البيانات"}
          </p>
          <div className="flex items-center gap-3 px-4 py-2 text-white/70 text-xs">
            <Database className="w-4 h-4 text-green-400" />
            <span>{"Neon PostgreSQL — متصل"}</span>
          </div>
        </div>
      </nav>

      <div className="p-4 mt-auto border-t border-white/10">
        <div className="bg-white/5 rounded-lg p-3 text-[10px] text-white/60">
          <p>{"LocatPro v2.0 — Pro Edition"}</p>
        </div>
      </div>
    </aside>
  );
}
