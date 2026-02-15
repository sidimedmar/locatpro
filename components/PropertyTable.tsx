
import React from 'react';
import { Droplet, Zap, Phone, User, Trash2, MapPin } from 'lucide-react';
import { Property } from '../types';

interface PropertyTableProps {
  properties: Property[];
  onDelete: (id: string) => void;
}

const PropertyTable: React.FC<PropertyTableProps> = ({ properties, onDelete }) => {
  const safeProperties = Array.isArray(properties) ? properties : [];

  if (safeProperties.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-gray-200">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="text-gray-400 w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-600">لا توجد سجلات حالياً</h3>
        <p className="text-gray-400">ابدأ بإضافة أول عقار للنظام</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-emerald-50 text-emerald-900 border-b border-emerald-100">
              <th className="px-6 py-4 font-bold whitespace-nowrap">الموقع</th>
              <th className="px-6 py-4 font-bold whitespace-nowrap">المستأجر</th>
              <th className="px-6 py-4 font-bold whitespace-nowrap">المواصفات</th>
              <th className="px-6 py-4 font-bold whitespace-nowrap">الإيجار الشهري</th>
              <th className="px-6 py-4 font-bold whitespace-nowrap">الخدمات</th>
              <th className="px-6 py-4 font-bold whitespace-nowrap">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {safeProperties.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">{p.wilaya} - {p.moughataa}</div>
                  <div className="text-sm text-gray-500">{p.neighborhood}، منزل {p.houseNumber}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-gray-800">{p.tenantName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Phone className="w-3 h-3" />
                    {p.tenantPhone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                    {p.roomsCount} غرف - {p.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-emerald-700">{Number(p.monthlyRent).toLocaleString()} أوقية</div>
                  <div className="text-xs text-gray-400">{p.paymentSystem}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <div title="SNDE" className={`p-1.5 rounded-full ${p.sndeStatus ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                      <Droplet className="w-4 h-4" />
                    </div>
                    <div title="SOMELEC" className={`p-1.5 rounded-full ${p.somelecStatus ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onDelete(p.id)}
                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
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
};

export default PropertyTable;
