
import React from 'react';
import { FileText, Download, PieChart, Info } from 'lucide-react';
import { Property } from '../types';

interface MonthlyReportProps {
  properties: Property[];
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({ properties }) => {
  const safeProperties = Array.isArray(properties) ? properties : [];
  const now = new Date();
  const monthName = now.toLocaleString('ar-MA', { month: 'long' });

  const summary = {
    totalProperties: safeProperties.length,
    paidOnTime: safeProperties.filter(p => p.arrears === 0).length,
    delayed: safeProperties.filter(p => p.arrears > 0).length,
    utilityCompliant: safeProperties.filter(p => p.sndeStatus && p.somelecStatus).length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-emerald-600" />
            التقرير الشهري التلقائي - {monthName} {now.getFullYear()}
          </h2>
          <p className="text-gray-500">ملخص حالة السداد ووضعية الفواتير لجميع العقارات المسجلة</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold transition-colors print:hidden"
        >
          <Download className="w-5 h-5" />
          طباعة التقرير
        </button>
      </div>

      {/* Detailed Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Status Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 lg:col-span-2">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2">
            <PieChart className="text-blue-500 w-5 h-5" />
            تحليل حالة السداد
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between group">
              <span className="text-gray-600">عقارات منتظمة في الدفع</span>
              <div className="flex items-center gap-4 flex-1 max-w-[60%] mx-4">
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${(summary.paidOnTime / (summary.totalProperties || 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="font-bold text-emerald-600">{summary.paidOnTime}</span>
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <span className="text-gray-600">عقارات بها متأخرات</span>
              <div className="flex items-center gap-4 flex-1 max-w-[60%] mx-4">
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${(summary.delayed / (summary.totalProperties || 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="font-bold text-red-600">{summary.delayed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200 flex flex-col justify-center text-center">
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-yellow-800 mb-2 text-lg">ملاحظة نظام التحصيل</h3>
          <p className="text-sm text-yellow-700 leading-relaxed">
            يجب التأكد من استلام إيصالات الماء والكهرباء الأصلية قبل نهاية كل شهر لضمان عدم تراكم الغرامات على المالك.
          </p>
        </div>
      </div>

      {/* Table of Monthly Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-4 font-bold border-b">المقاطعة</th>
              <th className="px-6 py-4 font-bold border-b">المستأجر</th>
              <th className="px-6 py-4 font-bold border-b">حالة السداد</th>
              <th className="px-6 py-4 font-bold border-b">فواتير SNDE</th>
              <th className="px-6 py-4 font-bold border-b">فواتير SOMELEC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {safeProperties.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4">{p.moughataa}</td>
                <td className="px-6 py-4 font-medium">{p.tenantName}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.arrears === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {p.arrears === 0 ? 'مسدد بالكامل' : `متأخر (${p.arrears})`}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={p.sndeStatus ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                    {p.sndeStatus ? 'منتظمة' : 'بها خلل'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={p.somelecStatus ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                    {p.somelecStatus ? 'منتظمة' : 'بها خلل'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyReport;
