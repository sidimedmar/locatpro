"use client";

import { Activity, Wallet, Wrench, Edit3, Plus, Trash2 } from "lucide-react";
import { useActivity } from "@/hooks/use-activity";

const ACTION_MAP: Record<string, { icon: typeof Activity; color: string; bg: string }> = {
  payment: { icon: Wallet, color: "text-primary", bg: "bg-accent" },
  maintenance: { icon: Wrench, color: "text-orange-600", bg: "bg-orange-50" },
  update: { icon: Edit3, color: "text-blue-600", bg: "bg-blue-50" },
  create: { icon: Plus, color: "text-primary", bg: "bg-accent" },
  delete: { icon: Trash2, color: "text-destructive", bg: "bg-destructive/10" },
};

export default function ActivityLogView() {
  const { activities, isLoading } = useActivity();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2 text-balance">
          <Activity className="text-primary" />
          {"سجل النشاط"}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">{"آخر 50 عملية تمت في النظام"}</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">{"جاري التحميل..."}</div>
      ) : activities.length === 0 ? (
        <div className="bg-card p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-border">
          <Activity className="mx-auto w-12 h-12 text-muted-foreground mb-3" />
          <h3 className="font-bold text-muted-foreground">{"لا توجد أنشطة مسجلة"}</h3>
          <p className="text-muted-foreground/60 text-sm">{"سيتم تسجيل جميع العمليات هنا تلقائيا"}</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <div className="relative">
            <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {activities.map((act) => {
                const info = ACTION_MAP[act.actionType] || ACTION_MAP.create;
                const Icon = info.icon;
                return (
                  <div key={act.id} className="flex items-start gap-4 relative">
                    <div className={`w-9 h-9 rounded-full ${info.bg} flex items-center justify-center shrink-0 z-10 border-2 border-card`}>
                      <Icon className={`w-4 h-4 ${info.color}`} />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium text-card-foreground">{act.description}</p>
                      {act.createdAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(act.createdAt).toLocaleDateString("ar-MA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
