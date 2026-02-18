"use client";

import { useMemo, useState } from "react";
import { Property } from "@/lib/types";
import {
  getWilayaColor,
} from "@/lib/geo-coordinates";
import {
  MapPin,
  Home,
  User,
  Phone,
  Wallet,
  Droplet,
  Zap,
  X,
  ChevronDown,
  Filter,
  Layers,
} from "lucide-react";
import MapLeaflet from "./map-leaflet";

interface PropertyMapProps {
  properties: Property[];
  onViewProperty?: (property: Property) => void;
}

function groupProperties(properties: Property[]) {
  const grouped: Record<
    string,
    { wilaya: string; moughataa: string; properties: Property[] }
  > = {};
  properties.forEach((p) => {
    const key = `${p.wilaya}|${p.moughataa}`;
    if (!grouped[key]) {
      grouped[key] = { wilaya: p.wilaya, moughataa: p.moughataa, properties: [] };
    }
    grouped[key].properties.push(p);
  });
  return Object.values(grouped);
}

export default function PropertyMap({
  properties,
  onViewProperty,
}: PropertyMapProps) {
  const [selectedWilaya, setSelectedWilaya] = useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showList, setShowList] = useState(true);

  const grouped = useMemo(() => groupProperties(properties), [properties]);

  const filteredGrouped = useMemo(
    () =>
      selectedWilaya === "all"
        ? grouped
        : grouped.filter((g) => g.wilaya === selectedWilaya),
    [grouped, selectedWilaya]
  );

  const filteredProperties = useMemo(
    () =>
      selectedWilaya === "all"
        ? properties
        : properties.filter((p) => p.wilaya === selectedWilaya),
    [properties, selectedWilaya]
  );

  const wilayas = useMemo(
    () => Array.from(new Set(properties.map((p) => p.wilaya))).sort(),
    [properties]
  );

  const totalRent = filteredProperties.reduce(
    (s, p) => s + Number(p.monthlyRent || 0),
    0
  );
  const totalArrears = filteredProperties.reduce(
    (s, p) => s + Number(p.arrears || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-balance">
            <MapPin className="w-6 h-6 text-primary" />
            {"خريطة العقارات"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {filteredProperties.length} {"عقار على الخريطة"}
            {selectedWilaya !== "all" && ` - ${selectedWilaya}`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
              className="pr-10 pl-4 py-2 border border-border rounded-lg bg-card text-foreground text-sm focus:ring-2 focus:ring-primary/40 outline-none appearance-none cursor-pointer"
            >
              <option value="all">{"جميع الولايات"}</option>
              {wilayas.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <button
            onClick={() => setShowList(!showList)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              showList
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            <Layers className="w-4 h-4" />
            {"قائمة المواقع"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">{"إجمالي العقارات"}</p>
          <p className="text-2xl font-bold text-primary">{filteredProperties.length}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">{"الولايات"}</p>
          <p className="text-2xl font-bold text-primary">
            {selectedWilaya === "all" ? wilayas.length : 1}
          </p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">{"إجمالي الإيجار"}</p>
          <p className="text-2xl font-bold text-primary">
            {totalRent.toLocaleString()}
          </p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">{"المتأخرات"}</p>
          <p
            className={`text-2xl font-bold ${
              totalArrears > 0 ? "text-destructive" : "text-primary"
            }`}
          >
            {totalArrears.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map */}
        <div className="flex-1 bg-card rounded-2xl border border-border overflow-hidden shadow-sm min-h-[500px]">
          <MapLeaflet
            properties={filteredProperties}
            onViewProperty={(p) => setSelectedProperty(p)}
          />
        </div>

        {/* Side Panel */}
        {showList && (
          <div className="w-full lg:w-80 shrink-0 space-y-3 max-h-[600px] overflow-y-auto">
            <h3 className="text-lg font-bold sticky top-0 bg-background py-2 z-10">
              {"تفاصيل المواقع"}
            </h3>
            {filteredGrouped.length === 0 ? (
              <div className="bg-card p-8 rounded-xl border-2 border-dashed border-border text-center">
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  {"لا توجد عقارات مسجلة"}
                </p>
              </div>
            ) : (
              filteredGrouped.map((group) => {
                const color = getWilayaColor(group.wilaya);
                return (
                  <div
                    key={`${group.wilaya}|${group.moughataa}`}
                    className="bg-card rounded-xl border border-border overflow-hidden"
                  >
                    <div
                      className="px-4 py-3 flex items-center gap-2"
                      style={{ borderRight: `4px solid ${color}` }}
                    >
                      <MapPin className="w-4 h-4 shrink-0" style={{ color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">
                          {group.moughataa}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {group.wilaya} - {group.properties.length} {"عقار"}
                        </p>
                      </div>
                    </div>
                    <div className="divide-y divide-border">
                      {group.properties.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedProperty(p)}
                          className="w-full text-right px-4 py-2.5 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Home className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-xs font-semibold truncate">
                              {p.tenantName}
                            </span>
                            <span className="text-[10px] text-muted-foreground mr-auto whitespace-nowrap">
                              {Number(p.monthlyRent).toLocaleString()} {"أوقية"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground">
                              {p.neighborhood} - {p.houseNumber}
                            </span>
                            {Number(p.arrears) > 0 && (
                              <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full mr-auto">
                                {"متأخرات"}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Selected Property Detail Popup */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div
              className="p-5 flex items-center justify-between"
              style={{
                borderBottom: `3px solid ${getWilayaColor(selectedProperty.wilaya)}`,
              }}
            >
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {selectedProperty.moughataa} - {selectedProperty.wilaya}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedProperty.neighborhood} {"- منزل رقم"}{" "}
                  {selectedProperty.houseNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Home className="w-3.5 h-3.5" />
                    {"نوع العقار"}
                  </div>
                  <p className="text-sm font-bold">{selectedProperty.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedProperty.roomsCount} {"غرف"}
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Wallet className="w-3.5 h-3.5" />
                    {"الإيجار الشهري"}
                  </div>
                  <p className="text-sm font-bold text-primary">
                    {Number(selectedProperty.monthlyRent).toLocaleString()}{" "}
                    {"أوقية"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-accent/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <User className="w-3.5 h-3.5" />
                    {"المالك"}
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedProperty.ownerName}
                  </p>
                  <p
                    className="text-xs text-muted-foreground flex items-center gap-1 mt-1"
                    dir="ltr"
                  >
                    <Phone className="w-3 h-3" />
                    {selectedProperty.ownerPhone}
                  </p>
                </div>
                <div className="bg-primary/5 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <User className="w-3.5 h-3.5" />
                    {"المستأجر"}
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedProperty.tenantName}
                  </p>
                  <p
                    className="text-xs text-muted-foreground flex items-center gap-1 mt-1"
                    dir="ltr"
                  >
                    <Phone className="w-3 h-3" />
                    {selectedProperty.tenantPhone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Droplet
                    className={`w-4 h-4 ${
                      selectedProperty.sndeStatus
                        ? "text-blue-600"
                        : "text-destructive"
                    }`}
                  />
                  <span
                    className={`text-xs font-bold ${
                      selectedProperty.sndeStatus
                        ? "text-blue-600"
                        : "text-destructive"
                    }`}
                  >
                    {"SNDE: "}
                    {selectedProperty.sndeStatus ? "منتظمة" : "بها خلل"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap
                    className={`w-4 h-4 ${
                      selectedProperty.somelecStatus
                        ? "text-orange-500"
                        : "text-destructive"
                    }`}
                  />
                  <span
                    className={`text-xs font-bold ${
                      selectedProperty.somelecStatus
                        ? "text-orange-500"
                        : "text-destructive"
                    }`}
                  >
                    {"SOMELEC: "}
                    {selectedProperty.somelecStatus ? "منتظمة" : "بها خلل"}
                  </span>
                </div>
              </div>
              {Number(selectedProperty.arrears) > 0 && (
                <div className="bg-destructive/10 p-3 rounded-lg flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-bold text-destructive">
                    {"متأخرات: "}
                    {Number(selectedProperty.arrears).toLocaleString()}{" "}
                    {"أوقية"}
                  </span>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                {onViewProperty && (
                  <button
                    onClick={() => {
                      onViewProperty(selectedProperty);
                      setSelectedProperty(null);
                    }}
                    className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    {"عرض التفاصيل الكاملة"}
                  </button>
                )}
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="px-4 py-2.5 bg-muted text-foreground rounded-lg text-sm font-semibold hover:bg-muted/80 transition-colors"
                >
                  {"إغلاق"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
