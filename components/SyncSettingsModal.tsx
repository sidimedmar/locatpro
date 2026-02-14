
import React, { useState } from 'react';
import { X, Save, ExternalLink, Info, ShieldCheck, Database, Table } from 'lucide-react';

interface SyncSettingsModalProps {
  currentUrl: string;
  currentSupabaseUrl: string;
  currentSupabaseKey: string;
  currentProvider: 'sheets' | 'supabase';
  onClose: () => void;
  onSave: (data: { provider: 'sheets' | 'supabase', url: string, supabaseUrl: string, supabaseKey: string }) => void;
}

const SyncSettingsModal: React.FC<SyncSettingsModalProps> = ({ 
  currentUrl, 
  currentSupabaseUrl, 
  currentSupabaseKey, 
  currentProvider,
  onClose, 
  onSave 
}) => {
  const [provider, setProvider] = useState<'sheets' | 'supabase'>(currentProvider);
  const [url, setUrl] = useState(currentUrl);
  const [supabaseUrl, setSupabaseUrl] = useState(currentSupabaseUrl);
  const [supabaseKey, setSupabaseKey] = useState(currentSupabaseKey);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-yellow-400" />
            <h2 className="text-xl font-bold">إعدادات الربط السحابي</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-800 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Provider Toggle */}
          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button 
              onClick={() => setProvider('sheets')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-all ${provider === 'sheets' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-500'}`}
            >
              <Table className="w-4 h-4" />
              Google Sheets
            </button>
            <button 
              onClick={() => setProvider('supabase')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-all ${provider === 'supabase' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-500'}`}
            >
              <Database className="w-4 h-4" />
              SQL Supabase
            </button>
          </div>

          {provider === 'sheets' ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800 border border-blue-100">
                <p className="font-bold mb-1 flex items-center gap-1"><Info className="w-3 h-3" /> تعليمات Google Sheets:</p>
                <p>ألصق رابط Web App الخاص بـ Google Apps Script الذي أنشأته سابقاً.</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">رابط الـ Script</label>
                <input 
                  type="url" 
                  className="w-full p-3 border rounded-xl text-left dir-ltr text-sm bg-gray-50"
                  placeholder="https://script.google.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-xl text-xs text-emerald-800 border border-emerald-100">
                <p className="font-bold mb-1 flex items-center gap-1"><Info className="w-3 h-3" /> تعليمات SQL Supabase:</p>
                <p>1. أنشئ مشروعاً في Supabase.<br/>2. أنشئ جدولاً باسم <code className="bg-emerald-200 px-1 rounded">properties</code>.<br/>3. ألصق البيانات أدناه.</p>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Project URL</label>
                  <input 
                    type="url" 
                    className="w-full p-3 border rounded-xl text-left dir-ltr text-sm bg-gray-50"
                    placeholder="https://xyz.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">API Key (Anon Public)</label>
                  <input 
                    type="password" 
                    className="w-full p-3 border rounded-xl text-left dir-ltr text-sm bg-gray-50"
                    placeholder="eyJhbG..."
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-3">
            <button 
              onClick={() => onSave({ provider, url, supabaseUrl, supabaseKey })}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-5 h-5" />
              حفظ الإعدادات وتفعيل
            </button>
            <a 
              href={provider === 'sheets' ? 'https://script.google.com' : 'https://supabase.com'} 
              target="_blank" 
              className="text-center text-xs text-emerald-600 hover:underline flex items-center justify-center gap-1"
            >
              فتح لوحة تحكم {provider === 'sheets' ? 'Google' : 'Supabase'}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncSettingsModal;
