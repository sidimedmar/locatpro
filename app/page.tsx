"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { useProperties } from "@/hooks/use-properties";
import { Property } from "@/lib/types";
import Sidebar from "@/components/sidebar";
import PropertyForm from "@/components/property-form";
import PropertyTable from "@/components/property-table";
import DashboardSummary from "@/components/dashboard-summary";
import MonthlyReport from "@/components/monthly-report";

type View = "dashboard" | "properties" | "reports";

export default function HomePage() {
  const { properties, isLoading, addProperty, deleteProperty } =
    useProperties();
  const [view, setView] = useState<View>("dashboard");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = useMemo(() => {
    return properties.filter(
      (p) =>
        (p.tenantName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (p.moughataa || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (p.neighborhood || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [properties, searchTerm]);

  const handleAddProperty = async (newProperty: Property) => {
    await addProperty(newProperty);
    setIsFormOpen(false);
  };

  const handleDeleteProperty = async (id: string) => {
    await deleteProperty(id);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar view={view} onViewChange={setView} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card shadow-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث..."
                className="w-full pr-10 pl-4 py-2 border border-border rounded-full bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-full font-bold shadow-lg transition-transform active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>{"إضافة سجل"}</span>
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="mr-3 text-muted-foreground">
                {"جاري تحميل البيانات..."}
              </span>
            </div>
          ) : (
            <>
              {view === "dashboard" && (
                <DashboardSummary properties={properties} />
              )}
              {view === "properties" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {"إدارة السجلات"}
                  </h2>
                  <PropertyTable
                    properties={filteredProperties}
                    onDelete={handleDeleteProperty}
                  />
                </div>
              )}
              {view === "reports" && (
                <MonthlyReport properties={properties} />
              )}
            </>
          )}
        </section>
      </main>

      {isFormOpen && (
        <PropertyForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddProperty}
        />
      )}
    </div>
  );
}
