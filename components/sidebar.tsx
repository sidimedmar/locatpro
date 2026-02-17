"use client";

import {
  Building2,
  LayoutDashboard,
  Users,
  FileText,
  Database,
} from "lucide-react";

type View = "dashboard" | "properties" | "reports";

interface SidebarProps {
  view: View;
  onViewChange: (view: View) => void;
}

export default function Sidebar({ view, onViewChange }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 bg-primary text-primary-foreground flex flex-col shadow-xl z-20 sticky top-0 md:h-screen shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <Building2 className="w-8 h-8 text-secondary" />
        <h1 className="text-xl font-bold leading-tight">LocatPro</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <button
          onClick={() => onViewChange("dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            view === "dashboard"
              ? "bg-secondary text-secondary-foreground font-bold"
              : "hover:bg-white/10"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>لوحة التحكم</span>
        </button>

        <button
          onClick={() => onViewChange("properties")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            view === "properties"
              ? "bg-secondary text-secondary-foreground font-bold"
              : "hover:bg-white/10"
          }`}
        >
          <Users className="w-5 h-5" />
          <span>{"إدارة المستأجرين"}</span>
        </button>

        <button
          onClick={() => onViewChange("reports")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            view === "reports"
              ? "bg-secondary text-secondary-foreground font-bold"
              : "hover:bg-white/10"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>التقارير الشهرية</span>
        </button>

        <div className="pt-4 border-t border-white/10 mt-4">
          <p className="text-[10px] uppercase tracking-widest text-white/50 px-4 mb-2">
            {"قاعدة البيانات (Neon PostgreSQL)"}
          </p>
          <div className="flex items-center gap-3 px-4 py-2 text-white/70 text-xs">
            <Database className="w-4 h-4 text-green-400" />
            <span>متصل بالسحابة</span>
          </div>
        </div>
      </nav>

      <div className="p-4 mt-auto border-t border-white/10">
        <div className="bg-white/5 rounded-lg p-3 text-[10px] text-white/60">
          <p>{"LocatPro v1.0 — Neon PostgreSQL"}</p>
        </div>
      </div>
    </aside>
  );
}
