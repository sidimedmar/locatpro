"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Loader2, Filter, X } from "lucide-react";
import { useProperties } from "@/hooks/use-properties";
import { usePayments } from "@/hooks/use-payments";
import { useMaintenance } from "@/hooks/use-maintenance";
import { useActivity } from "@/hooks/use-activity";
import { Property, ContractType } from "@/lib/types";
import { MAURITANIA_LOCATIONS } from "@/lib/constants";
import Sidebar from "@/components/sidebar";
import PropertyForm from "@/components/property-form";
import PropertyTable from "@/components/property-table";
import PropertyDetail from "@/components/property-detail";
import DashboardSummary from "@/components/dashboard-summary";
import MonthlyReport from "@/components/monthly-report";
import PaymentManager from "@/components/payment-manager";
import MaintenanceManager from "@/components/maintenance-manager";

type View = "dashboard" | "properties" | "payments" | "maintenance" | "reports";

export default function HomePage() {
  const { properties, isLoading, addProperty, updateProperty, deleteProperty } = useProperties();
  const { payments } = usePayments();
  const { requests: maintenanceRequests } = useMaintenance();
  const { activities } = useActivity();

  const [view, setView] = useState<View>("dashboard");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Advanced filters
  const [filterWilaya, setFilterWilaya] = useState("");
  const [filterContractType, setFilterContractType] = useState("");
  const [filterHasArrears, setFilterHasArrears] = useState("");
  const [filterUtility, setFilterUtility] = useState("");

  const activeFiltersCount = [filterWilaya, filterContractType, filterHasArrears, filterUtility].filter(Boolean).length;

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        (p.tenantName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.ownerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.moughataa || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.neighborhood || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesWilaya = !filterWilaya || p.wilaya === filterWilaya;
      const matchesContract = !filterContractType || p.contractType === filterContractType;
      const matchesArrears =
        !filterHasArrears ||
        (filterHasArrears === "yes" ? Number(p.arrears) > 0 : Number(p.arrears) === 0);
      const matchesUtility =
        !filterUtility ||
        (filterUtility === "snde_issue" ? !p.sndeStatus : false) ||
        (filterUtility === "somelec_issue" ? !p.somelecStatus : false) ||
        (filterUtility === "all_ok" ? p.sndeStatus && p.somelecStatus : false);

      return matchesSearch && matchesWilaya && matchesContract && matchesArrears && matchesUtility;
    });
  }, [properties, searchTerm, filterWilaya, filterContractType, filterHasArrears, filterUtility]);

  const handleAddProperty = async (newProperty: Property) => {
    await addProperty(newProperty);
    setIsFormOpen(false);
  };

  const handleUpdateProperty = async (property: Property) => {
    await updateProperty(property.id, property);
    setEditingProperty(null);
  };

  const handleDeleteProperty = async (id: string) => {
    await deleteProperty(id);
  };

  const clearFilters = () => {
    setFilterWilaya("");
    setFilterContractType("");
    setFilterHasArrears("");
    setFilterUtility("");
  };

  const inputClass = "p-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-muted text-foreground text-sm";

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar view={view} onViewChange={setView} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card shadow-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث بالاسم، الموقع..."
                className="w-full pr-10 pl-4 py-2 border border-border rounded-full bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {view === "properties" && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-full border transition-colors relative ${
                  showFilters || activeFiltersCount > 0
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border hover:bg-border"
                }`}
              >
                <Filter className="w-5 h-5" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setEditingProperty(null); setIsFormOpen(true); }}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-full font-bold shadow-lg transition-transform active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>{"إضافة سجل"}</span>
            </button>
          </div>
        </header>

        {/* Advanced Filters */}
        {showFilters && view === "properties" && (
          <div className="bg-card border-b border-border px-6 py-4 animate-in slide-in-from-top-2">
            <div className="flex flex-wrap items-center gap-4">
              <select value={filterWilaya} onChange={(e) => setFilterWilaya(e.target.value)} className={inputClass}>
                <option value="">{"جميع الولايات"}</option>
                {Object.keys(MAURITANIA_LOCATIONS).map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
              <select value={filterContractType} onChange={(e) => setFilterContractType(e.target.value)} className={inputClass}>
                <option value="">{"نوع التعاقد"}</option>
                <option value={ContractType.WITH_CONTRACT}>{"بعقد"}</option>
                <option value={ContractType.WITHOUT_CONTRACT}>{"بدون عقد"}</option>
              </select>
              <select value={filterHasArrears} onChange={(e) => setFilterHasArrears(e.target.value)} className={inputClass}>
                <option value="">{"حالة السداد"}</option>
                <option value="no">{"مسدد بالكامل"}</option>
                <option value="yes">{"بها متأخرات"}</option>
              </select>
              <select value={filterUtility} onChange={(e) => setFilterUtility(e.target.value)} className={inputClass}>
                <option value="">{"حالة الخدمات"}</option>
                <option value="all_ok">{"منتظمة"}</option>
                <option value="snde_issue">{"مشكلة ماء"}</option>
                <option value="somelec_issue">{"مشكلة كهرباء"}</option>
              </select>
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-destructive text-sm font-bold hover:underline">
                  <X className="w-4 h-4" />
                  {"مسح الفلاتر"}
                </button>
              )}
              <span className="text-xs text-muted-foreground mr-auto">{filteredProperties.length} {"نتيجة"}</span>
            </div>
          </div>
        )}

        <section className="flex-1 overflow-y-auto p-4 md:p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="mr-3 text-muted-foreground">{"جاري تحميل البيانات..."}</span>
            </div>
          ) : (
            <>
              {view === "dashboard" && (
                <DashboardSummary
                  properties={properties}
                  payments={payments}
                  maintenanceRequests={maintenanceRequests}
                  activities={activities}
                />
              )}
              {view === "properties" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">{"إدارة السجلات"}</h2>
                    <span className="text-sm text-muted-foreground">{filteredProperties.length} {"سجل"}</span>
                  </div>
                  <PropertyTable
                    properties={filteredProperties}
                    onDelete={handleDeleteProperty}
                    onView={(p) => setViewingProperty(p)}
                    onEdit={(p) => { setEditingProperty(p); setIsFormOpen(true); }}
                  />
                </div>
              )}
              {view === "payments" && <PaymentManager properties={properties} />}
              {view === "maintenance" && <MaintenanceManager properties={properties} />}
              {view === "reports" && <MonthlyReport properties={properties} />}
            </>
          )}
        </section>
      </main>

      {isFormOpen && (
        <PropertyForm
          onClose={() => { setIsFormOpen(false); setEditingProperty(null); }}
          onSubmit={editingProperty ? handleUpdateProperty : handleAddProperty}
          editProperty={editingProperty}
        />
      )}

      {viewingProperty && (
        <PropertyDetail
          property={viewingProperty}
          onClose={() => setViewingProperty(null)}
          onEdit={() => {
            setEditingProperty(viewingProperty);
            setViewingProperty(null);
            setIsFormOpen(true);
          }}
        />
      )}
    </div>
  );
}
