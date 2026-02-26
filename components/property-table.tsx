"use client";

import { useState } from "react";
import { Droplet, Zap, Phone, User, Trash2, MapPin, Eye, Edit3, Filter } from "lucide-react";
import { Property } from "@/lib/types";
import { MAURITANIA_LOCATIONS } from "@/lib/constants";

interface PropertyTableProps {
  properties: Property[];
  onDelete: (id: string) => void;
  onView: (property: Property) => void;
  onEdit: (property: Property) => void;
}

export default function PropertyTable({ properties, onDelete, onView, onEdit }: PropertyTableProps) {
  const [filterWilaya, setFilterWilaya] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | "paid" | "arrears" | "water" | "electricity">("");

  const filtered = properties.filter((p) => {
    if (filterWilaya && p.wilaya !== filterWilaya) return false;
    if (filterStatus === "paid" && Number(p.arrears) !== 0) return false;
    if (filterStatus === "arrears" && Number(p.arrears) === 0) return false;
    if (filterStatus === "water" && p.sndeStatus !== false) return false;
    if (filterStatus === "electricity" && p.somelecStatus !== false) return false;
    return true;
  });

  const inputClass = "p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-muted text-foreground text-sm";

  if (properties.length === 0) {
    return (
      <div className="bg-card text-card-foreground p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-border">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <MapPin className="text-muted-foreground w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-muted-foreground">{"لا توجد سجلات حاليا"}</h3>
        <p className="text-muted-foreground/60">{"ابدأ بإضافة أول عقار للنظام"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card p-4 rounded-2xl shadow-sm flex flex-wrap items-center gap-3">
        <Filter className="w-5 h-5 text-primary shrink-0" />
        <select value={filterWilaya} onChange={(e) => setFilterWilaya(e.target.value)} className={inputClass}>
          <option value="">{"كل الولايات"}</option>
          {Object.keys(MAURITANIA_LOCATIONS).map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)} className={inputClass}>
          <option value="">{"كل الحالات"}</option>
          <option value="paid">{"مسدد بالكامل"}</option>
          <option value="arrears">{"بمتأخرات"}</option>
          <option value="water">{"مشكلة مياه"}</option>
          <option value="electricity">{"مشكلة كهرباء"}</option>
        </select>
        {(filterWilaya || filterStatus) && (
          <button onClick={() => { setFilterWilaya(""); setFilterStatus(""); }} className="text-xs text-destructive hover:underline font-bold">{"مسح الفلاتر"}</button>
        )}
        <span className="text-xs text-muted-foreground mr-auto">{filtered.length} {"من"} {properties.length} {"سجل"}</span>
      </div>

      <div className="bg-card rounded-2xl shadow-sm overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-accent text-accent-foreground border-b border-border">
                <th className="px-5 py-3.5 font-bold whitespace-nowrap text-sm">{"الموقع"}</th>
                <th className="px-5 py-3.5 font-bold whitespace-nowrap text-sm">{"المستأجر"}</th>
                <th className="px-5 py-3.5 font-bold whitespace-nowrap text-sm">{"المواصفات"}</th>
                <th className="px-5 py-3.5 font-bold whitespace-nowrap text-sm">{"الإيجار"}</th>
                <th className="px-5 py-3.5 font-bold whitespace-nowrap text-sm">{"المتأخرات"}</th>
                <th className="px-5 py-3.5 font-bold whitespace-nowrap text-sm">{"الخدمات"}</th>
                <th className="px-5 py-3.5 font-bold whitespace-nowrap text-sm">{"الإجراءات"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-card-foreground text-sm">{p.wilaya} - {p.moughataa}</div>
                    <div className="text-xs text-muted-foreground">{p.neighborhood}، {"منزل"} {p.houseNumber}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-card-foreground text-sm">{p.tenantName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Phone className="w-3 h-3" />
                      <span dir="ltr">{p.tenantPhone}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block bg-secondary/20 text-secondary-foreground text-xs px-2 py-1 rounded-full font-bold">
                      {p.roomsCount} {"غرف"} - {p.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-primary text-sm">{Number(p.monthlyRent).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{"أوقية/شهر"}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`font-bold text-sm ${Number(p.arrears) > 0 ? "text-destructive" : "text-primary"}`}>
                      {Number(p.arrears) > 0 ? `${Number(p.arrears).toLocaleString()} أوقية` : "مسدد"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <div title="SNDE" className={`p-1.5 rounded-full ${p.sndeStatus ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"}`}>
                        <Droplet className="w-3.5 h-3.5" />
                      </div>
                      <div title="SOMELEC" className={`p-1.5 rounded-full ${p.somelecStatus ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"}`}>
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => onView(p)} className="p-1.5 hover:bg-primary/10 text-primary rounded-lg transition-colors" title="عرض التفاصيل">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => onEdit(p)} className="p-1.5 hover:bg-secondary/20 text-secondary-foreground rounded-lg transition-colors" title="تعديل">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { if (confirm("هل أنت متأكد من حذف هذا السجل؟")) onDelete(p.id); }}
                        className="p-1.5 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
