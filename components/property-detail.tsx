"use client";

import {
  X,
  MapPin,
  User,
  Phone,
  CreditCard,
  Home,
  FileText,
  Droplet,
  Zap,
  Calendar,
  Wallet,
} from "lucide-react";
import { Property } from "@/lib/types";

interface PropertyDetailProps {
  property: Property;
  onClose: () => void;
  onEdit: () => void;
}

export default function PropertyDetail({ property: p, onClose, onEdit }: PropertyDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Home className="w-5 h-5" />
            {"تفاصيل العقار"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-secondary/20 text-secondary-foreground rounded-lg text-sm font-bold hover:bg-secondary/30 transition-colors"
            >
              {"تعديل"}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Location */}
          <section>
            <h3 className="text-lg font-semibold mb-4 border-r-4 border-secondary pr-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {"الموقع الجغرافي"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard label="الولاية" value={p.wilaya} />
              <InfoCard label="المقاطعة" value={p.moughataa} />
              <InfoCard label="الحي" value={p.neighborhood} />
              <InfoCard label="رقم المنزل" value={p.houseNumber} />
            </div>
          </section>

          {/* Property Specs */}
          <section>
            <h3 className="text-lg font-semibold mb-4 border-r-4 border-secondary pr-3 flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              {"مواصفات العقار"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoCard label="عدد الغرف" value={String(p.roomsCount)} />
              <InfoCard label="التصنيف" value={p.type} />
              <InfoCard label="الملحقات" value={p.accessories || "---"} />
            </div>
          </section>

          {/* Owner & Tenant */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-accent/50 p-5 rounded-xl">
              <h3 className="text-base font-bold mb-3 text-accent-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                {"بيانات المالك"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-primary" /><span className="font-semibold">{p.ownerName}</span></div>
                <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-primary" /><span dir="ltr">{p.ownerPhone}</span></div>
                <div className="flex items-center gap-2 text-sm"><CreditCard className="w-4 h-4 text-primary" /><span>{p.ownerId}</span></div>
              </div>
            </section>
            <section className="bg-primary/5 p-5 rounded-xl">
              <h3 className="text-base font-bold mb-3 text-primary flex items-center gap-2">
                <User className="w-4 h-4" />
                {"بيانات المستأجر"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-primary" /><span className="font-semibold">{p.tenantName}</span></div>
                <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-primary" /><span dir="ltr">{p.tenantPhone}</span></div>
                <div className="flex items-center gap-2 text-sm"><CreditCard className="w-4 h-4 text-primary" /><span>{p.tenantId}</span></div>
              </div>
            </section>
          </div>

          {/* Financial */}
          <section>
            <h3 className="text-lg font-semibold mb-4 border-r-4 border-secondary pr-3 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              {"التفاصيل المالية"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard label="الإيجار الشهري" value={`${Number(p.monthlyRent).toLocaleString()} أوقية`} highlight />
              <InfoCard label="نوع التعاقد" value={p.contractType} />
              <InfoCard label="نظام التسديد" value={p.paymentSystem} />
              <InfoCard label="المتأخرات" value={`${Number(p.arrears).toLocaleString()} أوقية`} danger={Number(p.arrears) > 0} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {"تاريخ التأجير: "}{new Date(p.contractDate).toLocaleDateString("ar-MA")}
            </div>
          </section>

          {/* Utilities */}
          <section className="bg-muted p-5 rounded-xl">
            <h3 className="text-base font-bold mb-3 flex items-center gap-2">
              {"الالتزامات الخدمية"}
            </h3>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Droplet className={`w-5 h-5 ${p.sndeStatus ? "text-blue-600" : "text-destructive"}`} />
                <span className={`font-bold text-sm ${p.sndeStatus ? "text-blue-600" : "text-destructive"}`}>
                  {"SNDE: "}{p.sndeStatus ? "منتظمة" : "بها خلل"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className={`w-5 h-5 ${p.somelecStatus ? "text-orange-500" : "text-destructive"}`} />
                <span className={`font-bold text-sm ${p.somelecStatus ? "text-orange-500" : "text-destructive"}`}>
                  {"SOMELEC: "}{p.somelecStatus ? "منتظمة" : "بها خلل"}
                </span>
              </div>
            </div>
          </section>

          {p.notes && (
            <section className="bg-secondary/10 p-5 rounded-xl">
              <h3 className="text-base font-bold mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-secondary-foreground" />
                {"ملاحظات"}
              </h3>
              <p className="text-sm text-muted-foreground">{p.notes}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, highlight, danger }: { label: string; value: string; highlight?: boolean; danger?: boolean }) {
  return (
    <div className="bg-muted/50 p-3 rounded-lg">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`font-bold text-sm ${highlight ? "text-primary" : danger ? "text-destructive" : "text-card-foreground"}`}>{value}</p>
    </div>
  );
}
