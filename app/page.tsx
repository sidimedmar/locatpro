"use client";

import { useState } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";
import { useProperties } from "@/hooks/use-properties";
import { usePayments } from "@/hooks/use-payments";
import { useMaintenance } from "@/hooks/use-maintenance";
import { Property } from "@/lib/types";
import Sidebar, { type View } from "@/components/sidebar";
import PropertyForm from "@/components/property-form";
import PropertyTable from "@/components/property-table";
import PropertyDetail from "@/components/property-detail";
import DashboardSummary from "@/components/dashboard-summary";
import PaymentManager from "@/components/payment-manager";
import MaintenanceManager from "@/components/maintenance-manager";
import MonthlyReport from "@/components/monthly-report";
import PropertyMap from "@/components/property-map";
import ActivityLogView from "@/components/activity-log";

export default function HomePage() {
  const { properties, isLoading, addProperty, updateProperty, deleteProperty, mutate } = useProperties();
  const { payments } = usePayments();
  const { requests: maintenanceRequests } = useMaintenance();

  const [view, setView] = useState<View>("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [viewProperty, setViewProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const pendingMaintenance = maintenanceRequests.filter(
    (r) => r.status === "pending" || r.status === "in_progress"
  ).length;

  const filteredProperties = searchQuery
    ? properties.filter(
        (p) =>
          p.tenantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.moughataa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.wilaya?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.neighborhood?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : properties;

  const handleSubmit = async (property: Property) => {
    if (editProperty) {
      await updateProperty(property.id, property);
    } else {
      await addProperty(property);
    }
    setShowForm(false);
    setEditProperty(null);
  };

  const handleEdit = (property: Property) => {
    setEditProperty(property);
    setShowForm(true);
  };

  const handleView = (property: Property) => {
    setViewProperty(property);
  };

  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return (
          <DashboardSummary
            properties={properties}
            payments={payments}
            maintenanceRequests={maintenanceRequests}
          />
        );
      case "properties":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-balance">
                  {"إدارة العقارات والمستأجرين"}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {properties.length} {"عقار مسجل في النظام"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="بحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 pl-4 py-2 border border-border rounded-lg bg-muted text-foreground text-sm focus:ring-2 focus:ring-primary/40 outline-none w-48"
                  />
                </div>
                <button
                  onClick={() => mutate()}
                  className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                  title="تحديث"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setEditProperty(null);
                    setShowForm(true);
                  }}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full font-bold shadow-lg transition-transform active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  <span>{"إضافة عقار"}</span>
                </button>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                {"جاري تحميل البيانات..."}
              </div>
            ) : (
              <PropertyTable
                properties={filteredProperties}
                onDelete={deleteProperty}
                onView={handleView}
                onEdit={handleEdit}
              />
            )}
          </div>
        );
      case "map":
        return (
          <PropertyMap
            properties={properties}
            onViewProperty={handleView}
          />
        );
      case "payments":
        return <PaymentManager properties={properties} />;
      case "maintenance":
        return <MaintenanceManager properties={properties} />;
      case "reports":
        return <MonthlyReport properties={properties} />;
      case "activity":
        return <ActivityLogView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar
        view={view}
        onViewChange={setView}
        counts={{ properties: properties.length, pendingMaintenance }}
      />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {renderContent()}
      </main>

      {showForm && (
        <PropertyForm
          onClose={() => {
            setShowForm(false);
            setEditProperty(null);
          }}
          onSubmit={handleSubmit}
          editProperty={editProperty}
        />
      )}

      {viewProperty && (
        <PropertyDetail
          property={viewProperty}
          onClose={() => setViewProperty(null)}
          onEdit={() => {
            handleEdit(viewProperty);
            setViewProperty(null);
          }}
        />
      )}
    </div>
  );
}
