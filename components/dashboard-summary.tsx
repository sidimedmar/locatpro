"use client";

import {
  TrendingUp,
  Users,
  Building2,
  Wallet,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Property } from "@/lib/types";

interface DashboardSummaryProps {
  properties: Property[];
}

export default function DashboardSummary({
  properties,
}: DashboardSummaryProps) {
  const totalRent = properties.reduce(
    (sum, p) => sum + (Number(p.monthlyRent) || 0),
    0
  );
  const totalArrears = properties.reduce(
    (sum, p) => sum + (Number(p.arrears) || 0),
    0
  );
  const waterIssues = properties.filter((p) => !p.sndeStatus).length;
  const electricityIssues = properties.filter((p) => !p.somelecStatus).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-card-foreground text-balance">
          {"أهلاً بك في نظام إدارة العقارات"}
        </h2>
        <p className="text-muted-foreground">
          {"إحصائيات عامة حول محفظتك العقارية في موريتانيا"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border-r-4 border-primary flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">
              {"إجمالي العقارات"}
            </p>
            <h3 className="text-3xl font-bold">{properties.length}</h3>
          </div>
          <div className="p-4 bg-accent rounded-xl text-accent-foreground">
            <Building2 className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border-r-4 border-secondary flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">
              {"العائد الشهري"}
            </p>
            <h3 className="text-2xl font-bold text-primary">
              {totalRent.toLocaleString()}{" "}
              <span className="text-sm font-normal">{"أوقية"}</span>
            </h3>
          </div>
          <div className="p-4 bg-secondary/20 rounded-xl text-secondary-foreground">
            <Wallet className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border-r-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">
              {"المستأجرون"}
            </p>
            <h3 className="text-3xl font-bold">{properties.length}</h3>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
            <Users className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border-r-4 border-destructive flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">
              {"إجمالي المتأخرات"}
            </p>
            <h3 className="text-2xl font-bold text-destructive">
              {totalArrears.toLocaleString()}{" "}
              <span className="text-sm font-normal">{"أوقية"}</span>
            </h3>
          </div>
          <div className="p-4 bg-destructive/10 rounded-xl text-destructive">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-sm border border-border">
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
            <AlertCircle className="text-secondary" />
            {"التنبيهات الخدمية"}
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-destructive/5 border border-destructive/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-destructive shadow-sm">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-destructive">
                    {"مشاكل في فواتير الماء (SNDE)"}
                  </p>
                  <p className="text-sm text-destructive/70">
                    {waterIssues} {"عقار يحتاج لمراجعة"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-orange-500 shadow-sm">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-orange-900">
                    {"مشاكل في فواتير الكهرباء (SOMELEC)"}
                  </p>
                  <p className="text-sm text-orange-700">
                    {electricityIssues} {"عقار يحتاج لمراجعة"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary p-8 rounded-2xl shadow-xl text-primary-foreground relative overflow-hidden">
          <Building2 className="absolute -bottom-10 -left-10 w-48 h-48 text-white/5 rotate-12" />
          <div className="relative z-10">
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-secondary" />
              {"حالة المحفظة"}
            </h4>
            <p className="text-primary-foreground/70 mb-6">
              {
                "المحفظة تعمل بنسبة كفاءة عالية. يوصى بمراجعة التحصيل الميداني."
              }
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-xs text-primary-foreground/60">
                  {"نسبة السداد"}
                </p>
                <p className="text-2xl font-bold">
                  {properties.length > 0
                    ? Math.round(
                        (properties.filter((p) => Number(p.arrears) === 0)
                          .length /
                          properties.length) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-xs text-primary-foreground/60">
                  {"إجمالي الدخل"}
                </p>
                <p className="text-2xl font-bold">
                  {totalRent.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
