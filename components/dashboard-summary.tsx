"use client";

import {
  TrendingUp,
  Users,
  Building2,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Clock,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Property, Payment, MaintenanceRequest, ActivityLog } from "@/lib/types";

interface DashboardSummaryProps {
  properties: Property[];
  payments: Payment[];
  maintenanceRequests: MaintenanceRequest[];
  activities: ActivityLog[];
}

const CHART_COLORS = ["#065f46", "#eab308", "#3b82f6", "#ef4444"];

export default function DashboardSummary({
  properties,
  payments,
  maintenanceRequests,
  activities,
}: DashboardSummaryProps) {
  const totalRent = properties.reduce((sum, p) => sum + (Number(p.monthlyRent) || 0), 0);
  const totalArrears = properties.reduce((sum, p) => sum + (Number(p.arrears) || 0), 0);
  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const waterIssues = properties.filter((p) => !p.sndeStatus).length;
  const electricityIssues = properties.filter((p) => !p.somelecStatus).length;
  const pendingMaintenance = maintenanceRequests.filter((r) => r.status === "pending" || r.status === "in_progress").length;

  // Bar chart: rent by wilaya
  const wilayaData = Object.entries(
    properties.reduce((acc, p) => {
      const key = p.wilaya;
      acc[key] = (acc[key] || 0) + Number(p.monthlyRent);
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + "..." : name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Pie chart: contract types
  const withContract = properties.filter((p) => p.contractType === "بعقد").length;
  const withoutContract = properties.filter((p) => p.contractType === "بدون عقد").length;
  const pieData = [
    { name: "بعقد رسمي", value: withContract },
    { name: "بدون عقد", value: withoutContract },
  ].filter((d) => d.value > 0);

  const ACTION_LABELS: Record<string, string> = {
    payment: "دفعة",
    maintenance: "صيانة",
    update: "تحديث",
    create: "إنشاء",
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-card-foreground text-balance">{"لوحة التحكم الرئيسية"}</h2>
        <p className="text-muted-foreground">{"إحصائيات شاملة ومؤشرات أداء محفظتك العقارية"}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Building2} label="إجمالي العقارات" value={String(properties.length)} iconBg="bg-accent" iconColor="text-accent-foreground" borderColor="border-primary" />
        <KpiCard icon={Wallet} label="العائد الشهري" value={`${totalRent.toLocaleString()} أوقية`} iconBg="bg-secondary/20" iconColor="text-secondary-foreground" borderColor="border-secondary" valueColor="text-primary" />
        <KpiCard icon={CheckCircle2} label="إجمالي التحصيل" value={`${totalCollected.toLocaleString()} أوقية`} iconBg="bg-accent" iconColor="text-accent-foreground" borderColor="border-primary" valueColor="text-primary" />
        <KpiCard icon={TrendingUp} label="إجمالي المتأخرات" value={`${totalArrears.toLocaleString()} أوقية`} iconBg="bg-destructive/10" iconColor="text-destructive" borderColor="border-destructive" valueColor="text-destructive" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl shadow-sm border border-border">
          <h3 className="font-bold text-card-foreground mb-4">{"العائد حسب الولاية"}</h3>
          {wilayaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={wilayaData} layout="vertical" margin={{ right: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} أوقية`} />
                <Bar dataKey="value" fill="#065f46" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">{"لا توجد بيانات"}</div>
          )}
        </div>

        {/* Pie chart */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
          <h3 className="font-bold text-card-foreground mb-4">{"أنواع التعاقد"}</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">{"لا توجد بيانات"}</div>
          )}
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-muted-foreground">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts + Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border space-y-4">
          <h4 className="text-lg font-bold flex items-center gap-2 text-primary">
            <AlertCircle className="text-secondary" />
            {"التنبيهات"}
          </h4>
          <AlertRow icon={AlertCircle} label="مشاكل فواتير الماء (SNDE)" count={waterIssues} color="destructive" />
          <AlertRow icon={AlertCircle} label="مشاكل فواتير الكهرباء (SOMELEC)" count={electricityIssues} color="orange" />
          <AlertRow icon={Wrench} label="طلبات صيانة نشطة" count={pendingMaintenance} color="blue" />
          <AlertRow icon={TrendingUp} label="عقارات بها متأخرات" count={properties.filter(p => Number(p.arrears) > 0).length} color="destructive" />
        </div>

        {/* Activity Feed */}
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
          <h4 className="text-lg font-bold flex items-center gap-2 text-primary mb-4">
            <Activity className="text-secondary" />
            {"آخر النشاطات"}
          </h4>
          {activities.length === 0 ? (
            <p className="text-muted-foreground text-sm">{"لا توجد نشاطات مسجلة"}</p>
          ) : (
            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {activities.slice(0, 10).map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`p-1.5 rounded-full shrink-0 mt-0.5 ${
                    a.actionType === "payment" ? "bg-accent text-accent-foreground" :
                    a.actionType === "maintenance" ? "bg-orange-100 text-orange-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    <Clock className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded-full">{ACTION_LABELS[a.actionType] || a.actionType}</span>
                      {a.createdAt && <span className="text-[10px] text-muted-foreground">{new Date(a.createdAt).toLocaleDateString("ar-MA")}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 truncate">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Status */}
      <div className="bg-primary p-8 rounded-2xl shadow-xl text-primary-foreground relative overflow-hidden">
        <Building2 className="absolute -bottom-10 -left-10 w-48 h-48 text-white/5 rotate-12" />
        <div className="relative z-10">
          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-secondary" />
            {"حالة المحفظة"}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBlock label="نسبة السداد" value={`${properties.length > 0 ? Math.round((properties.filter((p) => Number(p.arrears) === 0).length / properties.length) * 100) : 0}%`} />
            <StatBlock label="إجمالي الدخل الشهري" value={totalRent.toLocaleString()} />
            <StatBlock label="المستأجرون" value={String(properties.length)} />
            <StatBlock label="نسبة التحصيل" value={`${totalRent > 0 ? Math.round((totalCollected / totalRent) * 100) : 0}%`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, iconBg, iconColor, borderColor, valueColor }: {
  icon: typeof Building2; label: string; value: string; iconBg: string; iconColor: string; borderColor: string; valueColor?: string;
}) {
  return (
    <div className={`bg-card text-card-foreground p-5 rounded-2xl shadow-sm border-r-4 ${borderColor} flex items-center justify-between`}>
      <div>
        <p className="text-muted-foreground text-xs mb-1">{label}</p>
        <h3 className={`text-xl font-bold ${valueColor || ""}`}>{value}</h3>
      </div>
      <div className={`p-3 ${iconBg} rounded-xl`}><Icon className={`w-6 h-6 ${iconColor}`} /></div>
    </div>
  );
}

function AlertRow({ icon: Icon, label, count, color }: { icon: typeof AlertCircle; label: string; count: number; color: string }) {
  const bgMap: Record<string, string> = { destructive: "bg-destructive/5 border-destructive/10", orange: "bg-orange-50 border-orange-100", blue: "bg-blue-50 border-blue-100" };
  const textMap: Record<string, string> = { destructive: "text-destructive", orange: "text-orange-700", blue: "text-blue-700" };
  return (
    <div className={`flex items-center justify-between p-3 ${bgMap[color]} border rounded-xl`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${textMap[color]}`} />
        <span className={`text-sm font-semibold ${textMap[color]}`}>{label}</span>
      </div>
      <span className={`font-bold ${textMap[color]}`}>{count}</span>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 p-4 rounded-xl">
      <p className="text-xs text-primary-foreground/60">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
