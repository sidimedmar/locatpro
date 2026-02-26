"use client";

import {
  TrendingUp,
  Users,
  Building2,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Banknote,
} from "lucide-react";
import { Property, Payment, MaintenanceRequest } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface DashboardSummaryProps {
  properties: Property[];
  payments: Payment[];
  maintenanceRequests: MaintenanceRequest[];
}

const CHART_COLORS = ["#065f46", "#eab308", "#3b82f6", "#ef4444", "#8b5cf6"];

export default function DashboardSummary({ properties, payments, maintenanceRequests }: DashboardSummaryProps) {
  const totalRent = properties.reduce((sum, p) => sum + (Number(p.monthlyRent) || 0), 0);
  const totalArrears = properties.reduce((sum, p) => sum + (Number(p.arrears) || 0), 0);
  const waterIssues = properties.filter((p) => !p.sndeStatus).length;
  const electricityIssues = properties.filter((p) => !p.somelecStatus).length;
  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingMaintenance = maintenanceRequests.filter((r) => r.status === "pending" || r.status === "in_progress").length;

  const paidOnTime = properties.filter((p) => Number(p.arrears) === 0).length;
  const withArrears = properties.filter((p) => Number(p.arrears) > 0).length;

  // Data for Wilaya distribution chart
  const wilayaMap: Record<string, number> = {};
  properties.forEach((p) => { wilayaMap[p.wilaya] = (wilayaMap[p.wilaya] || 0) + 1; });
  const wilayaData = Object.entries(wilayaMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  // Data for monthly payments chart
  const monthMap: Record<string, number> = {};
  payments.forEach((p) => {
    const d = new Date(p.paymentDate);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthMap[key] = (monthMap[key] || 0) + Number(p.amount);
  });
  const monthData = Object.entries(monthMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([month, amount]) => {
      const [y, m] = month.split("-");
      const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
      return { name: monthNames[parseInt(m) - 1] || m, amount };
    });

  // Data for payment status pie
  const pieData = [
    { name: "مسدد", value: paidOnTime },
    { name: "متأخر", value: withArrears },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-card-foreground text-balance">{"لوحة التحكم المتقدمة"}</h2>
        <p className="text-muted-foreground">{"إحصائيات شاملة حول محفظتك العقارية في موريتانيا"}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="إجمالي العقارات" value={String(properties.length)} bgIcon="bg-accent" textIcon="text-accent-foreground" borderColor="border-primary" />
        <StatCard icon={Wallet} label="العائد الشهري المتوقع" value={`${totalRent.toLocaleString()} أوقية`} bgIcon="bg-secondary/20" textIcon="text-secondary-foreground" borderColor="border-secondary" />
        <StatCard icon={Banknote} label="إجمالي التحصيل" value={`${totalCollected.toLocaleString()} أوقية`} bgIcon="bg-blue-50" textIcon="text-blue-600" borderColor="border-blue-500" />
        <StatCard icon={TrendingUp} label="إجمالي المتأخرات" value={`${totalArrears.toLocaleString()} أوقية`} bgIcon="bg-destructive/10" textIcon="text-destructive" borderColor="border-destructive" danger />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="المستأجرون" value={String(properties.length)} bgIcon="bg-primary/10" textIcon="text-primary" borderColor="border-primary" />
        <StatCard icon={CheckCircle2} label="منتظم في السداد" value={String(paidOnTime)} bgIcon="bg-accent" textIcon="text-accent-foreground" borderColor="border-primary" />
        <StatCard icon={Wrench} label="صيانة معلقة" value={String(pendingMaintenance)} bgIcon="bg-orange-50" textIcon="text-orange-600" borderColor="border-orange-500" />
        <StatCard icon={AlertCircle} label="مشاكل خدمية" value={String(waterIssues + electricityIssues)} bgIcon="bg-destructive/10" textIcon="text-destructive" borderColor="border-destructive" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Payments Chart */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
          <h4 className="text-base font-bold mb-4 text-card-foreground">{"التحصيل الشهري"}</h4>
          {monthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: number) => [`${val.toLocaleString()} أوقية`, "المبلغ"]} />
                <Bar dataKey="amount" fill="#065f46" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">{"لا توجد بيانات بعد"}</div>
          )}
        </div>

        {/* Wilaya Distribution */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
          <h4 className="text-base font-bold mb-4 text-card-foreground">{"توزيع العقارات حسب الولاية"}</h4>
          {wilayaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={wilayaData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#eab308" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">{"لا توجد بيانات بعد"}</div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Status Pie */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
          <h4 className="text-base font-bold mb-4 text-card-foreground">{"حالة السداد"}</h4>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} innerRadius={35} dataKey="value" stroke="none">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#065f46" : "#ef4444"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: i === 0 ? "#065f46" : "#ef4444" }} />
                    <span className="text-sm text-card-foreground">{d.name}: <strong>{d.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[140px] flex items-center justify-center text-muted-foreground text-sm">{"لا توجد بيانات بعد"}</div>
          )}
        </div>

        {/* Alerts */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
          <h4 className="text-base font-bold mb-4 text-card-foreground flex items-center gap-2">
            <AlertCircle className="text-secondary w-5 h-5" />
            {"التنبيهات"}
          </h4>
          <div className="space-y-3">
            <AlertRow label="مشاكل فواتير الماء (SNDE)" count={waterIssues} color="destructive" />
            <AlertRow label="مشاكل فواتير الكهرباء (SOMELEC)" count={electricityIssues} color="orange" />
            <AlertRow label="عقارات بمتأخرات" count={withArrears} color="destructive" />
            <AlertRow label="صيانة معلقة" count={pendingMaintenance} color="orange" />
          </div>
        </div>

        {/* Portfolio Health */}
        <div className="bg-primary p-6 rounded-2xl shadow-xl text-primary-foreground relative overflow-hidden">
          <Building2 className="absolute -bottom-8 -left-8 w-40 h-40 text-white/5 rotate-12" />
          <div className="relative z-10">
            <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
              <CheckCircle2 className="text-secondary" />
              {"صحة المحفظة"}
            </h4>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="text-[10px] text-primary-foreground/60">{"نسبة السداد"}</p>
                <p className="text-xl font-bold">
                  {properties.length > 0 ? Math.round((paidOnTime / properties.length) * 100) : 0}%
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="text-[10px] text-primary-foreground/60">{"نسبة التحصيل"}</p>
                <p className="text-xl font-bold">
                  {totalRent > 0 ? Math.round((totalCollected / totalRent) * 100) : 0}%
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="text-[10px] text-primary-foreground/60">{"الدخل الشهري"}</p>
                <p className="text-lg font-bold">{totalRent.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="text-[10px] text-primary-foreground/60">{"المحصل فعليا"}</p>
                <p className="text-lg font-bold">{totalCollected.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, bgIcon, textIcon, borderColor, danger }: {
  icon: typeof Building2; label: string; value: string; bgIcon: string; textIcon: string; borderColor: string; danger?: boolean;
}) {
  return (
    <div className={`bg-card text-card-foreground p-4 rounded-2xl shadow-sm border-r-4 ${borderColor} flex items-center gap-3`}>
      <div className={`p-3 ${bgIcon} rounded-xl shrink-0`}>
        <Icon className={`w-5 h-5 ${textIcon}`} />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-[11px] leading-tight">{label}</p>
        <p className={`text-lg font-bold leading-tight mt-0.5 truncate ${danger ? "text-destructive" : "text-card-foreground"}`}>{value}</p>
      </div>
    </div>
  );
}

function AlertRow({ label, count, color }: { label: string; count: number; color: string }) {
  const bgClass = color === "destructive" ? "bg-destructive/10" : "bg-orange-50";
  const textClass = color === "destructive" ? "text-destructive" : "text-orange-700";

  return (
    <div className={`flex items-center justify-between p-2.5 ${bgClass} rounded-lg`}>
      <span className={`text-xs font-medium ${textClass}`}>{label}</span>
      <span className={`text-sm font-bold ${textClass}`}>{count}</span>
    </div>
  );
}
