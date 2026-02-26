"use client";

import { useState } from "react";
import {
  Wallet,
  Plus,
  X,
  Save,
  Calendar,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { usePayments } from "@/hooks/use-payments";
import { Property } from "@/lib/types";

interface PaymentManagerProps {
  properties: Property[];
}

const MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export default function PaymentManager({ properties }: PaymentManagerProps) {
  const { payments, isLoading, addPayment } = usePayments();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterProperty, setFilterProperty] = useState("");

  const [form, setForm] = useState({
    propertyId: "",
    amount: 0,
    paymentDate: new Date().toISOString().split("T")[0],
    monthCovered: `${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`,
    method: "cash",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.propertyId) return;
    setIsSubmitting(true);
    try {
      await addPayment({ id: crypto.randomUUID(), ...form });
      setShowForm(false);
      setForm({
        propertyId: "",
        amount: 0,
        paymentDate: new Date().toISOString().split("T")[0],
        monthCovered: `${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`,
        method: "cash",
        notes: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPayments = filterProperty
    ? payments.filter((p) => p.propertyId === filterProperty)
    : payments;

  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const thisMonthPayments = payments.filter((p) => {
    const d = new Date(p.paymentDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  const inputClass =
    "w-full p-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-muted text-foreground";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-balance">
            <Wallet className="text-primary" />
            {"إدارة المدفوعات"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{"تتبع جميع مدفوعات الإيجار وسجل التحصيل"}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full font-bold shadow-lg transition-transform active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>{"تسجيل دفعة"}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card p-5 rounded-2xl shadow-sm border-r-4 border-primary flex items-center gap-4">
          <div className="p-3 bg-accent rounded-xl"><Banknote className="w-6 h-6 text-accent-foreground" /></div>
          <div>
            <p className="text-muted-foreground text-xs">{"إجمالي التحصيل"}</p>
            <p className="text-xl font-bold text-primary">{totalCollected.toLocaleString()} <span className="text-sm font-normal">{"أوقية"}</span></p>
          </div>
        </div>
        <div className="bg-card p-5 rounded-2xl shadow-sm border-r-4 border-secondary flex items-center gap-4">
          <div className="p-3 bg-secondary/20 rounded-xl"><Calendar className="w-6 h-6 text-secondary-foreground" /></div>
          <div>
            <p className="text-muted-foreground text-xs">{"تحصيل هذا الشهر"}</p>
            <p className="text-xl font-bold">{thisMonthTotal.toLocaleString()} <span className="text-sm font-normal">{"أوقية"}</span></p>
          </div>
        </div>
        <div className="bg-card p-5 rounded-2xl shadow-sm border-r-4 border-blue-500 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl"><CreditCard className="w-6 h-6 text-blue-600" /></div>
          <div>
            <p className="text-muted-foreground text-xs">{"عدد العمليات"}</p>
            <p className="text-xl font-bold">{payments.length}</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-card p-4 rounded-2xl shadow-sm">
        <select
          value={filterProperty}
          onChange={(e) => setFilterProperty(e.target.value)}
          className={`${inputClass} max-w-sm`}
        >
          <option value="">{"جميع العقارات"}</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.tenantName} - {p.moughataa}</option>
          ))}
        </select>
      </div>

      {/* Payments Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">{"جاري التحميل..."}</div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-card p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-border">
          <Wallet className="mx-auto w-12 h-12 text-muted-foreground mb-3" />
          <h3 className="font-bold text-muted-foreground">{"لا توجد مدفوعات مسجلة"}</h3>
          <p className="text-muted-foreground/60 text-sm">{"ابدأ بتسجيل أول دفعة إيجار"}</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-accent text-accent-foreground border-b border-border">
                  <th className="px-6 py-4 font-bold whitespace-nowrap">{"المستأجر"}</th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">{"المبلغ"}</th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">{"تاريخ الدفع"}</th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">{"الشهر المغطى"}</th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">{"طريقة الدفع"}</th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">{"الحالة"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold">{payment.tenantName || "---"}</div>
                      <div className="text-xs text-muted-foreground">{payment.moughataa}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      {Number(payment.amount).toLocaleString()} {"أوقية"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(payment.paymentDate).toLocaleDateString("ar-MA")}
                    </td>
                    <td className="px-6 py-4">{payment.monthCovered}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-muted px-3 py-1 rounded-full text-xs font-bold">
                        {payment.method === "cash" ? "نقدي" : payment.method === "bank" ? "تحويل بنكي" : "شيك"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        {"مسدد"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground w-full max-w-lg rounded-2xl shadow-2xl">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                {"تسجيل دفعة جديدة"}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-muted rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">{"العقار / المستأجر"}</label>
                <select required value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: e.target.value, amount: properties.find(p => p.id === e.target.value)?.monthlyRent || 0 })} className={inputClass}>
                  <option value="">{"-- اختر العقار --"}</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.tenantName} - {p.moughataa} ({Number(p.monthlyRent).toLocaleString()} {"أوقية/شهر"})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">{"المبلغ (أوقية)"}</label>
                  <input type="number" required min="0" className={`${inputClass} font-bold text-primary`} value={form.amount} onChange={(e) => setForm({ ...form, amount: parseInt(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">{"تاريخ الدفع"}</label>
                  <input type="date" required className={inputClass} value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">{"الشهر المغطى"}</label>
                  <input type="text" required className={inputClass} value={form.monthCovered} onChange={(e) => setForm({ ...form, monthCovered: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">{"طريقة الدفع"}</label>
                  <select className={inputClass} value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                    <option value="cash">{"نقدي"}</option>
                    <option value="bank">{"تحويل بنكي"}</option>
                    <option value="check">{"شيك"}</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">{"ملاحظات (اختياري)"}</label>
                <input type="text" className={inputClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-4 border-t border-border">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  <Save className="w-5 h-5" />
                  {isSubmitting ? "جاري الحفظ..." : "حفظ الدفعة"}
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
