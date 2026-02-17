"use client";

import { Droplet, Zap, Phone, User, Trash2, MapPin } from "lucide-react";
import { Property } from "@/lib/types";

interface PropertyTableProps {
  properties: Property[];
  onDelete: (id: string) => void;
}

export default function PropertyTable({
  properties,
  onDelete,
}: PropertyTableProps) {
  if (properties.length === 0) {
    return (
      <div className="bg-card text-card-foreground p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-border">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <MapPin className="text-muted-foreground w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-muted-foreground">
          {"لا توجد سجلات حالياً"}
        </h3>
        <p className="text-muted-foreground/60">
          {"ابدأ بإضافة أول عقار للنظام"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-accent text-accent-foreground border-b border-border">
              <th className="px-6 py-4 font-bold whitespace-nowrap">
                {"الموقع"}
              </th>
              <th className="px-6 py-4 font-bold whitespace-nowrap">
                {"المستأجر"}
              </th>
              <th className="px-6 py-4 font-bold whitespace-nowrap">
                {"المواصفات"}
              </th>
              <th className="px-6 py-4 font-bold whitespace-nowrap">
                {"الإيجار الشهري"}
              </th>
              <th className="px-6 py-4 font-bold whitespace-nowrap">
                {"الخدمات"}
              </th>
              <th className="px-6 py-4 font-bold whitespace-nowrap">
                {"الإجراءات"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {properties.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-card-foreground">
                    {p.wilaya} - {p.moughataa}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {p.neighborhood}، {"منزل"} {p.houseNumber}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-card-foreground">
                      {p.tenantName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Phone className="w-3 h-3" />
                    {p.tenantPhone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block bg-secondary/20 text-secondary-foreground text-xs px-2 py-1 rounded-full font-bold">
                    {p.roomsCount} {"غرف"} - {p.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-primary">
                    {Number(p.monthlyRent).toLocaleString()} {"أوقية"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {p.paymentSystem}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <div
                      title="SNDE"
                      className={`p-1.5 rounded-full ${
                        p.sndeStatus
                          ? "bg-blue-100 text-blue-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      <Droplet className="w-4 h-4" />
                    </div>
                    <div
                      title="SOMELEC"
                      className={`p-1.5 rounded-full ${
                        p.somelecStatus
                          ? "bg-orange-100 text-orange-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      if (confirm("هل أنت متأكد من حذف هذا السجل؟")) {
                        onDelete(p.id);
                      }
                    }}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
