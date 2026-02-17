"use client";

import { FileText, Download, PieChart, Info } from "lucide-react";
import { Property } from "@/lib/types";

interface MonthlyReportProps {
  properties: Property[];
}

export default function MonthlyReport({ properties }: MonthlyReportProps) {
  const now = new Date();
  const monthName = now.toLocaleString("ar-MA", { month: "long" });

  const summary = {
    totalProperties: properties.length,
    paidOnTime: properties.filter((p) => Number(p.arrears) === 0).length,
    delayed: properties.filter((p) => Number(p.arrears) > 0).length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-balance">
            <FileText className="text-primary" />
            {"التقرير الشهري التلقائي"} - {monthName} {now.getFullYear()}
          </h2>
          <p className="text-muted-foreground">
            {
              "ملخص حالة السداد ووضعية الفواتير لجميع العقارات المسجلة"
            }
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-muted hover:bg-border text-muted-foreground px-6 py-2 rounded-lg font-bold transition-colors print:hidden"
        >
          <Download className="w-5 h-5" />
          {"طباعة التقرير"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border lg:col-span-2">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-border pb-2">
            <PieChart className="text-blue-500 w-5 h-5" />
            {"تحليل حالة السداد"}
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {"عقارات منتظمة في الدفع"}
              </span>
              <div className="flex items-center gap-4 flex-1 max-w-[60%] mx-4">
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        (summary.paidOnTime /
                          (summary.totalProperties || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <span className="font-bold text-primary">
                  {summary.paidOnTime}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {"عقارات بها متأخرات"}
              </span>
              <div className="flex items-center gap-4 flex-1 max-w-[60%] mx-4">
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-destructive rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        (summary.delayed / (summary.totalProperties || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <span className="font-bold text-destructive">
                  {summary.delayed}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20 flex flex-col justify-center text-center">
          <div className="w-12 h-12 bg-secondary/20 text-secondary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-secondary-foreground mb-2 text-lg">
            {"ملاحظة نظام التحصيل"}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {
              "يجب التأكد من استلام إيصالات الماء والكهرباء الأصلية قبل نهاية كل شهر لضمان عدم تراكم الغرامات على المالك."
            }
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-bold border-b border-border">
                {"المقاطعة"}
              </th>
              <th className="px-6 py-4 font-bold border-b border-border">
                {"المستأجر"}
              </th>
              <th className="px-6 py-4 font-bold border-b border-border">
                {"حالة السداد"}
              </th>
              <th className="px-6 py-4 font-bold border-b border-border">
                {"فواتير SNDE"}
              </th>
              <th className="px-6 py-4 font-bold border-b border-border">
                {"فواتير SOMELEC"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {properties.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4">{p.moughataa}</td>
                <td className="px-6 py-4 font-medium">{p.tenantName}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      Number(p.arrears) === 0
                        ? "bg-accent text-accent-foreground"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {Number(p.arrears) === 0
                      ? "مسدد بالكامل"
                      : `متأخر (${p.arrears})`}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={
                      p.sndeStatus
                        ? "text-primary font-bold"
                        : "text-destructive font-bold"
                    }
                  >
                    {p.sndeStatus ? "منتظمة" : "بها خلل"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={
                      p.somelecStatus
                        ? "text-primary font-bold"
                        : "text-destructive font-bold"
                    }
                  >
                    {p.somelecStatus ? "منتظمة" : "بها خلل"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
