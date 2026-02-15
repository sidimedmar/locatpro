
import React from 'react';
import { TrendingUp, Users, Building2, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { Property } from '../types';

interface DashboardSummaryProps {
  properties: Property[];
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ properties }) => {
  // Safe default
  const safeProperties = Array.isArray(properties) ? properties : [];

  const totalRent = safeProperties.reduce((sum, p) => sum + (Number(p.monthlyRent) || 0), 0);
  const totalArrears = safeProperties.reduce((sum, p) => sum + (Number(p.arrears) || 0), 0);
  const waterIssues = safeProperties.filter(p => !p.sndeStatus).length;
  const electricityIssues = safeProperties.filter(p => !p.somelecStatus).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-800">أهلاً بك في نظام إدارة العقارات</h2>
        <p className="text-gray-500">إحصائيات عامة حول محفظتك العقارية في موريتانيا</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Properties */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-1">إجمالي العقارات</p>
            <h3 className="text-3xl font-bold text-gray-800">{safeProperties.length}</h3>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600">
            <Building2 className="w-8 h-8" />
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-yellow-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-1">العائد الشهري</p>
            <h3 className="text-2xl font-bold text-emerald-700">{totalRent.toLocaleString()} <span className="text-sm font-normal">أوقية</span></h3>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl text-yellow-600">
            <Wallet className="w-8 h-8" />
          </div>
        </div>

        {/* Tenant Count */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-1">المستأجرون</p>
            <h3 className="text-3xl font-bold text-gray-800">{safeProperties.length}</h3>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
            <Users className="w-8 h-8" />
          </div>
        </div>

        {/* Arrears */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-red-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-1">إجمالي المتأخرات</p>
            <h3 className="text-2xl font-bold text-red-600">{totalArrears.toLocaleString()} <span className="text-sm font-normal">أوقية</span></h3>
          </div>
          <div className="p-4 bg-red-50 rounded-xl text-red-600">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Issues & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-emerald-900">
            <AlertCircle className="text-yellow-500" />
            التنبيهات الخدمية (فواتير معلقة)
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-red-900">مشاكل في فواتير الماء (SNDE)</p>
                  <p className="text-sm text-red-700">{waterIssues} عقار يحتاج لمراجعة</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-sm">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-orange-900">مشاكل في فواتير الكهرباء (SOMELEC)</p>
                  <p className="text-sm text-orange-700">{electricityIssues} عقار يحتاج لمراجعة</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-900 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <Building2 className="absolute -bottom-10 -left-10 w-48 h-48 text-emerald-800 opacity-30 rotate-12" />
          <div className="relative z-10">
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-yellow-400" />
              حالة المحفظة
            </h4>
            <p className="text-emerald-100 mb-6">المحفظة تعمل بنسبة كفاءة عالية. يوصى بمراجعة التحصيل الميداني في نواكشوط الشمالية.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-800/50 p-4 rounded-xl">
                <p className="text-xs text-emerald-300">نسبة السداد</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
              <div className="bg-emerald-800/50 p-4 rounded-xl">
                <p className="text-xs text-emerald-300">النمو الشهري</p>
                <p className="text-2xl font-bold">+12%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
