
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Plus, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Search,
  Cloud,
  Settings,
  RefreshCw,
  DownloadCloud,
  CheckCircle2,
  Database,
  AlertTriangle
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Property } from './types';
import PropertyForm from './components/PropertyForm';
import PropertyTable from './components/PropertyTable';
import DashboardSummary from './components/DashboardSummary';
import MonthlyReport from './components/MonthlyReport';
import SyncSettingsModal from './components/SyncSettingsModal';

const App: React.FC = () => {
  // Initialize state with safe defaults
  const [properties, setProperties] = useState<Property[]>([]);
  const [view, setView] = useState<'dashboard' | 'properties' | 'reports'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Settings with validation
  const [syncProvider, setSyncProvider] = useState<'sheets' | 'supabase'>(() => {
    const stored = localStorage.getItem('sync_provider');
    return (stored === 'sheets' || stored === 'supabase') ? stored : 'sheets';
  });
  
  const [sheetUrl, setSheetUrl] = useState<string>(localStorage.getItem('google_sheet_url') || '');
  const [supabaseUrl, setSupabaseUrl] = useState<string>(localStorage.getItem('supabase_url') || '');
  const [supabaseKey, setSupabaseKey] = useState<string>(localStorage.getItem('supabase_key') || '');

  const [isSyncing, setIsSyncing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [lastSync, setLastSync] = useState<string>(localStorage.getItem('last_sync_time') || '');

  // Initialize Supabase Client safely
  const supabase = useMemo(() => {
    if (syncProvider === 'supabase' && supabaseUrl && supabaseKey) {
      try {
        // Basic validation of URL format to prevent crashes
        if (!supabaseUrl.startsWith('http')) return null;
        return createClient(supabaseUrl, supabaseKey);
      } catch (e) {
        console.error("Supabase Init Error:", e);
        return null;
      }
    }
    return null;
  }, [syncProvider, supabaseUrl, supabaseKey]);

  // Load properties safely
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mauritania_real_estate');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setProperties(parsed);
        } else {
          console.warn("Stored data is invalid, resetting store");
          setProperties([]);
        }
      }
    } catch (e) {
      console.error("Failed to parse local storage:", e);
      setProperties([]);
    }
  }, []);

  // Save properties safely
  useEffect(() => {
    try {
      if (Array.isArray(properties)) {
        localStorage.setItem('mauritania_real_estate', JSON.stringify(properties));
      }
    } catch (e) {
      console.error("Failed to save to local storage:", e);
    }
  }, [properties]);

  const filteredProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];
    return properties.filter(p => 
      (p.tenantName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.moughataa || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.neighborhood || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [properties, searchTerm]);

  const handleAddProperty = (newProperty: Property) => {
    setProperties(prev => [newProperty, ...(prev || [])]);
    setIsFormOpen(false);
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSyncPush = async () => {
    const providerUrl = syncProvider === 'sheets' ? sheetUrl : supabaseUrl;
    if (!providerUrl) {
      alert('يرجى ضبط إعدادات الربط أولاً');
      return setIsSyncModalOpen(true);
    }

    setIsSyncing(true);
    try {
      if (syncProvider === 'sheets') {
        await fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'push', properties })
        });
      } else if (supabase) {
        if (!properties.length) {
          alert("لا توجد بيانات للمزامنة");
          setIsSyncing(false);
          return;
        }
        // SQL Professional Upsert
        const { error } = await supabase
          .from('properties')
          .upsert(properties, { onConflict: 'id' });
        
        if (error) throw error;
      }
      
      const time = new Date().toLocaleString('ar-MA');
      setLastSync(time);
      localStorage.setItem('last_sync_time', time);
      alert(syncProvider === 'supabase' ? '✅ تم الحفظ في قاعدة البيانات SQL' : '✅ تم الإرسال إلى Google Sheets');
    } catch (error: any) {
      console.error("Sync Error:", error);
      alert(`❌ فشل المزامنة: ${error.message || 'خطأ غير معروف'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncPull = async () => {
    const providerUrl = syncProvider === 'sheets' ? sheetUrl : supabaseUrl;
    if (!providerUrl) return setIsSyncModalOpen(true);

    setIsPulling(true);
    try {
      let data: Property[] = [];
      if (syncProvider === 'sheets') {
        const response = await fetch(`${sheetUrl}?action=pull`);
        data = await response.json();
      } else if (supabase) {
        const { data: sqlData, error } = await supabase
          .from('properties')
          .select('*')
          .order('contractDate', { ascending: false });
        
        if (error) throw error;
        data = sqlData as Property[];
      }
      
      if (data && Array.isArray(data)) {
        if (confirm(`تم جلب ${data.length} سجل من السحاب. هل تريد تحديث القائمة المحلية؟`)) {
          setProperties(data);
          const time = new Date().toLocaleString('ar-MA');
          setLastSync(time);
          localStorage.setItem('last_sync_time', time);
        }
      } else {
        alert("لم يتم العثور على بيانات صالحة");
      }
    } catch (error: any) {
      alert(`❌ فشل جلب البيانات: ${error.message}`);
    } finally {
      setIsPulling(false);
    }
  };

  const handleSaveSettings = (data: { provider: 'sheets' | 'supabase', url: string, supabaseUrl: string, supabaseKey: string }) => {
    setSyncProvider(data.provider);
    setSheetUrl(data.url);
    setSupabaseUrl(data.supabaseUrl);
    setSupabaseKey(data.supabaseKey);
    localStorage.setItem('sync_provider', data.provider);
    localStorage.setItem('google_sheet_url', data.url);
    localStorage.setItem('supabase_url', data.supabaseUrl);
    localStorage.setItem('supabase_key', data.supabaseKey);
    setIsSyncModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-['Cairo']" dir="rtl">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-emerald-900 text-white flex flex-col shadow-xl z-20 sticky top-0 md:h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-emerald-800">
          <Building2 className="w-8 h-8 text-yellow-400" />
          <h1 className="text-xl font-bold leading-tight">عقارات موريتانيا</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === 'dashboard' ? 'bg-yellow-500 text-emerald-950 font-bold' : 'hover:bg-emerald-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>لوحة التحكم</span>
          </button>
          
          <button 
            onClick={() => setView('properties')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === 'properties' ? 'bg-yellow-500 text-emerald-950 font-bold' : 'hover:bg-emerald-800'}`}
          >
            <Users className="w-5 h-5" />
            <span>إدارة المستأجرين</span>
          </button>
          
          <button 
            onClick={() => setView('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === 'reports' ? 'bg-yellow-500 text-emerald-950 font-bold' : 'hover:bg-emerald-800'}`}
          >
            <FileText className="w-5 h-5" />
            <span>التقارير الشهرية</span>
          </button>

          <div className="pt-4 border-t border-emerald-800 mt-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-emerald-400 px-4 mb-2">قاعدة البيانات ({syncProvider === 'sheets' ? 'Google Sheets' : 'SQL PostgreSQL'})</p>
            
            <button 
              onClick={handleSyncPush}
              disabled={isSyncing || isPulling}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-all text-emerald-100 disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin text-yellow-400' : ''}`} />
                <span>مزامنة إلى SQL</span>
              </div>
              <Cloud className={`w-4 h-4 ${(syncProvider === 'sheets' ? sheetUrl : supabaseUrl) ? 'text-emerald-400' : 'text-red-400'}`} />
            </button>

            <button 
              onClick={handleSyncPull}
              disabled={isSyncing || isPulling}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-all text-emerald-100 disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <DownloadCloud className={`w-5 h-5 ${isPulling ? 'animate-bounce text-yellow-400' : ''}`} />
                <span>جلب من SQL</span>
              </div>
            </button>

            <button 
              onClick={() => setIsSyncModalOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-emerald-800 transition-all text-xs text-emerald-400"
            >
              <Settings className="w-4 h-4" />
              <span>إعدادات الاتصال</span>
            </button>
          </div>
        </nav>

        <div className="p-4 mt-auto border-t border-emerald-800">
          <div className="bg-emerald-800/50 rounded-lg p-3 text-[10px] text-emerald-200">
            <p>آخر مزامنة: {lastSync || 'لم تتم بعد'}</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="بحث..."
                className="w-full pr-10 pl-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden lg:flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
               {syncProvider === 'supabase' ? <Database className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
               <span>{syncProvider === 'sheets' ? 'Google Sheets متصل' : 'SQL Supabase نشط'}</span>
             </div>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg transition-transform active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة سجل</span>
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8">
          {view === 'dashboard' && <DashboardSummary properties={properties || []} />}
          {view === 'properties' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">إدارة السجلات</h2>
              <PropertyTable properties={filteredProperties || []} onDelete={handleDeleteProperty} />
            </div>
          )}
          {view === 'reports' && <MonthlyReport properties={properties || []} />}
        </section>
      </main>

      {isFormOpen && <PropertyForm onClose={() => setIsFormOpen(false)} onSubmit={handleAddProperty} />}
      {isSyncModalOpen && (
        <SyncSettingsModal 
          currentUrl={sheetUrl}
          currentSupabaseUrl={supabaseUrl}
          currentSupabaseKey={supabaseKey}
          currentProvider={syncProvider}
          onClose={() => setIsSyncModalOpen(false)}
          onSave={handleSaveSettings}
        />
      )}
    </div>
  );
};

export default App;
