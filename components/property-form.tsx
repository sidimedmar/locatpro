"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import { Property, PropertyType, ContractType, PaymentSystem } from "@/lib/types";
import { MAURITANIA_LOCATIONS } from "@/lib/constants";

interface PropertyFormProps {
  onClose: () => void;
  onSubmit: (property: Property) => void;
}

export default function PropertyForm({ onClose, onSubmit }: PropertyFormProps) {
  const [wilaya, setWilaya] = useState("");
  const [moughataa, setMoughataa] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    neighborhood: "",
    houseNumber: "",
    roomsCount: 1,
    type: PropertyType.GROUND,
    accessories: "",
    ownerName: "",
    ownerPhone: "",
    ownerId: "",
    tenantName: "",
    tenantPhone: "",
    tenantId: "",
    contractDate: new Date().toISOString().split("T")[0],
    contractType: ContractType.WITH_CONTRACT,
    monthlyRent: 0,
    paymentSystem: PaymentSystem.PREPAID,
    arrears: 0,
    sndeStatus: true,
    somelecStatus: true,
  });

  const moughataas =
    wilaya && MAURITANIA_LOCATIONS[wilaya]
      ? MAURITANIA_LOCATIONS[wilaya]
      : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wilaya || !moughataa) {
      alert("يرجى اختيار الولاية والمقاطعة");
      return;
    }

    setIsSubmitting(true);
    const newProperty: Property = {
      ...formData,
      id: crypto.randomUUID(),
      wilaya,
      moughataa,
    };

    try {
      await onSubmit(newProperty);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full p-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-muted";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <h2 className="text-xl font-bold text-primary">
            {"إضافة عقار وتأجير جديد"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-r-4 border-secondary pr-3">
              {"أولاً: الموقع الجغرافي"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  {"الولاية"}
                </label>
                <select
                  required
                  value={wilaya}
                  onChange={(e) => {
                    setWilaya(e.target.value);
                    setMoughataa("");
                  }}
                  className={inputClass}
                >
                  <option value="">{"-- اختر الولاية --"}</option>
                  {Object.keys(MAURITANIA_LOCATIONS).map((w, idx) => (
                    <option key={w} value={w}>
                      {idx + 1}. {w}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  {"المقاطعة"}
                </label>
                <select
                  required
                  disabled={!wilaya}
                  value={moughataa}
                  onChange={(e) => setMoughataa(e.target.value)}
                  className={`${inputClass} disabled:opacity-50`}
                >
                  <option value="">{"-- اختر المقاطعة --"}</option>
                  {moughataas.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  {"الحي"}
                </label>
                <input
                  type="text"
                  required
                  className={inputClass}
                  value={formData.neighborhood}
                  onChange={(e) =>
                    setFormData({ ...formData, neighborhood: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  {"رقم المنزل"}
                </label>
                <input
                  type="text"
                  required
                  className={inputClass}
                  value={formData.houseNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, houseNumber: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Property Specs */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-r-4 border-secondary pr-3">
              {"ثانياً: مواصفات العقار"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  {"عدد الغرف"}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  className={inputClass}
                  value={formData.roomsCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roomsCount: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  {"التصنيف"}
                </label>
                <select
                  className={inputClass}
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as PropertyType,
                    })
                  }
                >
                  <option value={PropertyType.GROUND}>{"منزل أرضي"}</option>
                  <option value={PropertyType.STORY}>{"طابق"}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  {"الملحقات (اختياري)"}
                </label>
                <input
                  type="text"
                  placeholder="مطبخ، حمام خارجي، حديقة..."
                  className={inputClass}
                  value={formData.accessories}
                  onChange={(e) =>
                    setFormData({ ...formData, accessories: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Owner & Tenant Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-lg font-semibold mb-4 border-r-4 border-primary pr-3">
                {"بيانات المالك"}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  required
                  className={inputClass}
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                />
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  required
                  className={inputClass}
                  value={formData.ownerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPhone: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="رقم بطاقة التعريف"
                  required
                  className={inputClass}
                  value={formData.ownerId}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerId: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 border-r-4 border-primary pr-3">
                {"بيانات المستأجر"}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  required
                  className={inputClass}
                  value={formData.tenantName}
                  onChange={(e) =>
                    setFormData({ ...formData, tenantName: e.target.value })
                  }
                />
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  required
                  className={inputClass}
                  value={formData.tenantPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, tenantPhone: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="رقم بطاقة التعريف"
                  required
                  className={inputClass}
                  value={formData.tenantId}
                  onChange={(e) =>
                    setFormData({ ...formData, tenantId: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Finance */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-r-4 border-secondary pr-3">
              {"التفاصيل المالية والتعاقدية"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  {"تاريخ التأجير"}
                </label>
                <input
                  type="date"
                  required
                  className={inputClass}
                  value={formData.contractDate}
                  onChange={(e) =>
                    setFormData({ ...formData, contractDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  {"نوع التعاقد"}
                </label>
                <select
                  className={inputClass}
                  value={formData.contractType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contractType: e.target.value as ContractType,
                    })
                  }
                >
                  <option value={ContractType.WITH_CONTRACT}>
                    {"بعقد رسمي"}
                  </option>
                  <option value={ContractType.WITHOUT_CONTRACT}>
                    {"بدون عقد"}
                  </option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  {"المبلغ الشهري (أوقية)"}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  className={`${inputClass} font-bold text-primary`}
                  value={formData.monthlyRent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthlyRent: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  {"نظام التسديد"}
                </label>
                <select
                  className={inputClass}
                  value={formData.paymentSystem}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentSystem: e.target.value as PaymentSystem,
                    })
                  }
                >
                  <option value={PaymentSystem.PREPAID}>{"مقدم"}</option>
                  <option value={PaymentSystem.END_OF_MONTH}>
                    {"نهاية الشهر"}
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Utilities */}
          <div className="bg-accent p-6 rounded-xl border border-primary/10">
            <h3 className="text-lg font-semibold mb-4 text-accent-foreground">
              {"الالتزامات الخدمية"}
            </h3>
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-primary rounded"
                  checked={formData.sndeStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, sndeStatus: e.target.checked })
                  }
                />
                <span className="text-card-foreground">
                  {"انتظام فواتير الماء (SNDE)"}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-primary rounded"
                  checked={formData.somelecStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      somelecStatus: e.target.checked,
                    })
                  }
                />
                <span className="text-card-foreground">
                  {"انتظام فواتير الكهرباء (SOMELEC)"}
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? "جاري الحفظ..." : "حفظ البيانات"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 bg-muted hover:bg-border text-muted-foreground font-bold py-3 rounded-lg transition-colors"
            >
              {"إلغاء"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
