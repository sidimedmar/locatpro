"use client";

import { useState } from "react";
import {
  Wrench,
  Plus,
  X,
  Save,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpCircle,
} from "lucide-react";
import { useMaintenance } from "@/hooks/use-maintenance";
import { Property } from "@/lib/types";

interface MaintenanceManagerProps {
  properties: Property[];
}

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  low: { label: "منخفضة", color: "bg-muted text-muted-foreground" },
  medium: { label: "متوسطة", color: "bg-secondary/20 text-secondary-foreground" },
  high: { label: "عالية", color: "bg-orange-100 text-orange-800" },
  urgent: { label: "عاجلة", color: "bg-destructive/10 text-destructive" },
};

const STATUS_MAP: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: "قيد الانتظار", icon: Clock, color: "bg-secondary/20 text-secondary-foreground" },
  in_progress: { label: "قيد التنفيذ", icon: ArrowUpCircle, color: "bg-blue-100 text-blue-800" },
  completed: { label: "مكتملة", icon: CheckCircle2, color: "bg-accent text-accent-foreground" },
  cancelled: { label: "ملغاة", icon: XCircle, color: "bg-muted text-muted-foreground" },
};

export default function MaintenanceManager({ properties }: MaintenanceManagerProps) {
  const { requests, isLoading, addRequest, updateStatus } = useMaintenance();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const [form, setForm] = useState({
    propertyId: "",
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    estimatedCost: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.propertyId || !form.title) return;
    setIsSubmitting(true);
    try {
      await addRequest({
        id: crypto.randomUUID(),
        ...form,
        status: "pending",
        actualCost: 0,
      });
      setShowForm(false);
      setForm({ propertyId: "", title: "", description: "", priority: "medium", estimatedCost: 0 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRequests = filterStatus
    ? requests.filter((r) => r.status === filterStatus)
    : requests;

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;
  const totalCost = requests.filter(r => r.status === "completed").reduce((sum, r) => sum + Number(r.actualCost), 0);

  const inputClass =
    "w-full p-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-muted text-foreground";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-balance">
            <Wrench className="text-primary" />
            {"إدارة الصيانة"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{"تتبع طلبات الصيانة والإصلاحات في جميع العقارات"}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full font-bold shadow-lg transition-transform active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>{"طلب صيانة"}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-2xl shadow-sm border-r-4 border-secondary text-center">
          <p className="text-muted-foreground text-xs mb-1">{"قيد الانتظار"}</p>
          <p className="text-2xl font-bold text-secondary-foreground">{pendingCount}</p>
        </div>
        <div className="bg-card p-4 rounded-2xl shadow-sm border-r-4 border-blue-500 text-center">
          <p className="text-muted-foreground text-xs mb-1">{"قيد التنفيذ"}</p>
          <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
        </div>
        <div className="bg-card p-4 rounded-2xl shadow-sm border-r-4 border-primary text-center">
          <p className="text-muted-foreground text-xs mb-1">{"مكتملة"}</p>
          <p className="text-2xl font-bold text-primary">{completedCount}</p>
        </div>
        <div className="bg-card p-4 rounded-2xl shadow-sm border-r-4 border-destructive text-center">
          <p className="text-muted-foreground text-xs mb-1">{"تكلفة الإصلاحات"}</p>
          <p className="text-lg font-bold text-destructive">{totalCost.toLocaleString()} <span className="text-xs font-normal">{"أوقية"}</span></p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-card p-4 rounded-2xl shadow-sm flex flex-wrap gap-2">
        {[
          { key: "", label: "الكل" },
          { key: "pending", label: "قيد الانتظار" },
          { key: "in_progress", label: "قيد التنفيذ" },
          { key: "completed", label: "مكتملة" },
          { key: "cancelled", label: "ملغاة" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              filterStatus === f.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">{"جاري التحميل..."}</div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-card p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-border">
          <Wrench className="mx-auto w-12 h-12 text-muted-foreground mb-3" />
          <h3 className="font-bold text-muted-foreground">{"لا توجد طلبات صيانة"}</h3>
          <p className="text-muted-foreground/60 text-sm">{"سيتم عرض طلبات الصيانة هنا"}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const statusInfo = STATUS_MAP[req.status] || STATUS_MAP.pending;
            const priorityInfo = PRIORITY_MAP[req.priority] || PRIORITY_MAP.medium;
            const StatusIcon = statusInfo.icon;

            return (
              <div key={req.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h4 className="font-bold text-card-foreground">{req.title}</h4>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${priorityInfo.color}`}>
                        <AlertTriangle className="w-3 h-3" />
                        {priorityInfo.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                    </div>
                    {req.description && <p className="text-sm text-muted-foreground mb-2">{req.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{req.tenantName || "---"} - {req.moughataa}</span>
                      {req.estimatedCost > 0 && <span>{"التكلفة المقدرة:"} {Number(req.estimatedCost).toLocaleString()} {"أوقية"}</span>}
                      {req.createdAt && <span>{new Date(req.createdAt).toLocaleDateString("ar-MA")}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {req.status === "pending" && (
                      <button
                        onClick={() => updateStatus(req.id, "in_progress")}
                        className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors"
                      >
                        {"بدء التنفيذ"}
                      </button>
                    )}
                    {req.status === "in_progress" && (
                      <button
                        onClick={() => {
                          const cost = prompt("التكلفة الفعلية (أوقية):");
                          if (cost !== null) updateStatus(req.id, "completed", parseInt(cost) || 0);
                        }}
                        className="px-3 py-1.5 bg-accent text-accent-foreground rounded-lg text-xs font-bold hover:bg-accent/80 transition-colors"
                      >
                        {"إنهاء"}
                      </button>
                    )}
                    {(req.status === "pending" || req.status === "in_progress") && (
                      <button
                        onClick={() => updateStatus(req.id, "cancelled")}
                        className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-bold hover:bg-border transition-colors"
                      >
                        {"إلغاء"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Maintenance Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground w-full max-w-lg rounded-2xl shadow-2xl">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                {"طلب صيانة جديد"}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-muted rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">{"العقار"}</label>
                <select required value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: e.target.value })} className={inputClass}>
                  <option value="">{"-- اختر العقار --"}</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.tenantName} - {p.moughataa}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">{"عنوان المشكلة"}</label>
                <input type="text" required className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={"مثال: تسرب مياه في الحمام"} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">{"الوصف (اختياري)"}</label>
                <textarea className={`${inputClass} h-20 resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">{"الأولوية"}</label>
                  <select className={inputClass} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as "low" | "medium" | "high" | "urgent" })}>
                    <option value="low">{"منخفضة"}</option>
                    <option value="medium">{"متوسطة"}</option>
                    <option value="high">{"عالية"}</option>
                    <option value="urgent">{"عاجلة"}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">{"التكلفة المقدرة"}</label>
                  <input type="number" min="0" className={inputClass} value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-border">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  <Save className="w-5 h-5" />
                  {isSubmitting ? "جاري الحفظ..." : "إرسال الطلب"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-muted hover:bg-border text-muted-foreground font-bold py-3 rounded-lg">{"إلغاء"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
