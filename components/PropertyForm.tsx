
import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Property, PropertyType, ContractType, PaymentSystem } from '../types';
import { MAURITANIA_LOCATIONS } from '../constants';

interface PropertyFormProps {
  onClose: () => void;
  onSubmit: (property: Property) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onClose, onSubmit }) => {
  const [wilaya, setWilaya] = useState('');
  const [moughataa, setMoughataa] = useState('');
  
  const [formData, setFormData] = useState({
    neighborhood: '',
    houseNumber: '',
    roomsCount: 1,
    type: PropertyType.GROUND,
    accessories: '',
    ownerName: '',
    ownerPhone: '',
    ownerId: '',
    tenantName: '',
    tenantPhone: '',
    tenantId: '',
    contractDate: new Date().toISOString().split('T')[0],
    contractType: ContractType.WITH_CONTRACT,
    monthlyRent: 0,
    paymentSystem: PaymentSystem.PREPAID,
    arrears: 0,
    sndeStatus: true,
    somelecStatus: true,
  });

  const moughataas = wilaya ? MAURITANIA_LOCATIONS[wilaya] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wilaya || !moughataa) return alert('يرجى اختيار الولاية والمقاطعة');
    
    const newProperty: Property = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      wilaya,
      moughataa,
    };
    onSubmit(newProperty);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-emerald-900">إضافة عقار وتأجير جديد</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Section 1: Location */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-r-4 border-yellow-500 pr-3">أولاً: الموقع الجغرافي</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">الولاية (اختر من القائمة)</label>
                <select 
                  required
                  value={wilaya}
                  onChange={(e) => {
                    setWilaya(e.target.value);
                    setMoughataa('');
                  }}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50"
                >
                  <option value="">-- اختر الولاية --</option>
                  {Object.keys(MAURITANIA_LOCATIONS).map((w, idx) => (
                    <option key={w} value={w}>{idx + 1}. {w}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">المقاطعة (تلقائي حسب الولاية)</label>
                <select 
                  required
                  disabled={!wilaya}
                  value={moughataa}
                  onChange={(e) => setMoughataa(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 disabled:opacity-50"
                >
                  <option value="">-- اختر المقاطعة --</option>
                  {moughataas.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">الحي</label>
                <input 
                  type="text" required
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.neighborhood}
                  onChange={e => setFormData({...formData, neighborhood: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">رقم المنزل</label>
                <input 
                  type="text" required
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.houseNumber}
                  onChange={e => setFormData({...formData, houseNumber: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Property Specs */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-r-4 border-yellow-500 pr-3">ثانياً: مواصفات العقار</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">عدد الغرف</label>
                <input 
                  type="number" min="1" required
                  className="w-full p-2.5 border rounded-lg"
                  value={formData.roomsCount}
                  onChange={e => setFormData({...formData, roomsCount: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">التصنيف</label>
                <select 
                  className="w-full p-2.5 border rounded-lg"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as PropertyType})}
                >
                  <option value={PropertyType.GROUND}>منزل أرضي</option>
                  <option value={PropertyType.STORY}>طابق</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">الملحقات (اختياري)</label>
                <input 
                  type="text"
                  placeholder="مطبخ، حمام خارجي، حديقة..."
                  className="w-full p-2.5 border rounded-lg"
                  value={formData.accessories}
                  onChange={e => setFormData({...formData, accessories: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Owner & Tenant Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-lg font-semibold mb-4 border-r-4 border-emerald-500 pr-3">بيانات المالك</h3>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="الاسم الكامل" required
                  className="w-full p-2.5 border rounded-lg"
                  value={formData.ownerName}
                  onChange={e => setFormData({...formData, ownerName: e.target.value})}
                />
                <input 
                  type="tel" placeholder="رقم الهاتف" required
                  className="w-full p-2.5 border rounded-lg"
                  value={formData.ownerPhone}
                  onChange={e => setFormData({...formData, ownerPhone: e.target.value})}
                />
                <input 
                  type="text" placeholder="رقم بطاقة التعريف" required
                  className="w-full p-2.5 border rounded-lg"
                  value={formData.ownerId}
                  onChange={e => setFormData({...formData, ownerId: e.target.value})}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 border-r-4 border-emerald-500 pr-3">بيانات المؤجر (المستأجر)</h3>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="الاسم الكامل" required
                  className="w-full p-2.5 border rounded-lg"
                  value={formData.tenantName}
                  onChange={e => setFormData({...formData, tenantName: e.target.value})}
                />
                <input 
                  type="tel" placeholder="رقم الهاتف" required
                  className="w-full p-2.5 border rounded-lg"
                  value={formData.tenantPhone}
                  onChange={e => setFormData({...formData, tenantPhone: e.target.value})}
                />
                <input 
                  type="text" placeholder="رقم بطاقة التعريف" required
                  className="w-full p-2.5 border rounded-lg"
                  value={formData.tenantId}
                  onChange={e => setFormData({...formData, tenantId: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Finance & Contract */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-r-4 border-yellow-500 pr-3">التفاصيل المالية والتعاقدية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">تاريخ التأجير</label>
                <input 
                  type="date" required
                  className="w-full p-2.5 border rounded-lg"
                  value={formData.contractDate}
                  onChange={e => setFormData({...formData, contractDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">نوع التعاقد</label>
                <select 
                  className="w-full p-2.5 border rounded-lg"
                  value={formData.contractType}
                  onChange={e => setFormData({...formData, contractType: e.target.value as ContractType})}
                >
                  <option value={ContractType.WITH_CONTRACT}>بعقد رسمي</option>
                  <option value={ContractType.WITHOUT_CONTRACT}>بدون عقد</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">المبلغ الشهري (أوقية)</label>
                <input 
                  type="number" min="0" required
                  className="w-full p-2.5 border rounded-lg font-bold text-emerald-700"
                  value={formData.monthlyRent}
                  onChange={e => setFormData({...formData, monthlyRent: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">نظام التسديد</label>
                <select 
                  className="w-full p-2.5 border rounded-lg"
                  value={formData.paymentSystem}
                  onChange={e => setFormData({...formData, paymentSystem: e.target.value as PaymentSystem})}
                >
                  <option value={PaymentSystem.PREPAID}>مقدم</option>
                  <option value={PaymentSystem.END_OF_MONTH}>نهاية الشهر</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Utilities */}
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
            <h3 className="text-lg font-semibold mb-4 text-emerald-900">الالتزامات الخدمية (الوضعية الحالية)</h3>
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-emerald-600 rounded"
                  checked={formData.sndeStatus}
                  onChange={e => setFormData({...formData, sndeStatus: e.target.checked})}
                />
                <span className="text-gray-700 group-hover:text-emerald-700 transition-colors">انتظام فواتير الماء (SNDE)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-emerald-600 rounded"
                  checked={formData.somelecStatus}
                  onChange={e => setFormData({...formData, somelecStatus: e.target.checked})}
                />
                <span className="text-gray-700 group-hover:text-emerald-700 transition-colors">انتظام فواتير الكهرباء (SOMELEC)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <button 
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              حفظ البيانات النهائية
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="px-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
