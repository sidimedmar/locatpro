"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { Property } from "@/lib/types";
import {
  WILAYA_COORDINATES,
  getPropertyCoordinates,
  getWilayaColor,
} from "@/lib/geo-coordinates";

interface MapLeafletProps {
  properties: Property[];
  onViewProperty?: (property: Property) => void;
}

// Load Leaflet from CDN to avoid module resolution issues with SSR
function loadLeaflet(): Promise<typeof import("leaflet")> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("SSR");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).L) return resolve((window as any).L);

    // Load CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load JS
    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolve((window as any).L);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    } else {
      // Script exists, wait for L
      const check = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).L) {
          clearInterval(check);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resolve((window as any).L);
        }
      }, 50);
      setTimeout(() => {
        clearInterval(check);
        reject("Leaflet load timeout");
      }, 10000);
    }
  });
}

export default function MapLeaflet({
  properties,
  onViewProperty,
}: MapLeafletProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  const markers = useMemo(() => {
    const groups: Record<
      string,
      {
        lat: number;
        lng: number;
        properties: Property[];
        wilaya: string;
        moughataa: string;
      }
    > = {};
    properties.forEach((p) => {
      const key = `${p.wilaya}|${p.moughataa}`;
      if (!groups[key]) {
        const coords = getPropertyCoordinates(p.wilaya, p.moughataa);
        if (coords) {
          groups[key] = {
            ...coords,
            properties: [],
            wilaya: p.wilaya,
            moughataa: p.moughataa,
          };
        }
      }
      if (groups[key]) {
        groups[key].properties.push(p);
      }
    });
    return Object.values(groups);
  }, [properties]);

  useEffect(() => {
    if (!mapRef.current) return;

    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapRef.current) return;
        setLoading(false);

        // Clean up previous map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapRef.current, {
          center: [18.0735, -15.9582],
          zoom: 6,
          zoomControl: true,
          attributionControl: true,
        });

        mapInstanceRef.current = map;

        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18,
          }
        ).addTo(map);

        // Add wilaya center markers
        Object.entries(WILAYA_COORDINATES).forEach(([, wilayaGeo]) => {
          L.circleMarker(
            [wilayaGeo.center.lat, wilayaGeo.center.lng],
            {
              radius: 3,
              color: "#94a3b8",
              fillColor: "#cbd5e1",
              fillOpacity: 0.4,
              weight: 1,
            }
          )
            .addTo(map)
            .bindTooltip(wilayaGeo.nameAr, {
              permanent: false,
              direction: "top",
              className: "leaflet-tooltip-custom",
            });
        });

        // Add property markers
        markers.forEach((group) => {
          const color = getWilayaColor(group.wilaya);
          const count = group.properties.length;
          const totalRent = group.properties.reduce(
            (s, p) => s + Number(p.monthlyRent || 0),
            0
          );
          const arrears = group.properties.reduce(
            (s, p) => s + Number(p.arrears || 0),
            0
          );

          const icon = L.divIcon({
            className: "custom-marker",
            html: `
              <div style="
                background: ${color};
                color: white;
                width: ${24 + count * 4}px;
                height: ${24 + count * 4}px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: ${12 + count}px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                border: 2px solid white;
                cursor: pointer;
              ">${count}</div>
            `,
            iconSize: [24 + count * 4, 24 + count * 4],
            iconAnchor: [
              (24 + count * 4) / 2,
              (24 + count * 4) / 2,
            ],
          });

          const marker = L.marker([group.lat, group.lng], { icon }).addTo(
            map
          );

          const propertiesList = group.properties
            .map(
              (p) => `
              <div style="padding:6px 0;border-bottom:1px solid #e5e7eb;cursor:pointer"
                   class="property-popup-item" data-id="${p.id}">
                <div style="display:flex;align-items:center;gap:6px">
                  <span style="font-weight:600;font-size:12px">${p.tenantName}</span>
                  <span style="margin-right:auto;font-size:10px;color:#6b7280">${Number(p.monthlyRent).toLocaleString()} MRU</span>
                </div>
                <div style="font-size:10px;color:#9ca3af;margin-top:2px">
                  ${p.neighborhood} - ${p.houseNumber} | ${p.roomsCount} ${"غرف"} | ${p.type}
                </div>
              </div>
            `
            )
            .join("");

          const popupContent = `
            <div style="min-width:250px;max-width:320px;font-family:system-ui,sans-serif;direction:rtl">
              <div style="padding:8px 12px;background:${color};color:white;border-radius:8px 8px 0 0;margin:-12px -12px 8px -12px">
                <div style="font-weight:bold;font-size:14px">${group.moughataa}</div>
                <div style="font-size:11px;opacity:0.9">${group.wilaya} - ${count} ${"عقار"}</div>
              </div>
              <div style="display:flex;gap:8px;margin-bottom:8px">
                <div style="flex:1;background:#f0fdf4;padding:6px;border-radius:6px;text-align:center">
                  <div style="font-size:10px;color:#6b7280">${"الإيجار"}</div>
                  <div style="font-weight:bold;font-size:12px;color:#065f46">${totalRent.toLocaleString()}</div>
                </div>
                ${
                  arrears > 0
                    ? `
                  <div style="flex:1;background:#fef2f2;padding:6px;border-radius:6px;text-align:center">
                    <div style="font-size:10px;color:#6b7280">${"المتأخرات"}</div>
                    <div style="font-weight:bold;font-size:12px;color:#ef4444">${arrears.toLocaleString()}</div>
                  </div>
                `
                    : ""
                }
              </div>
              ${propertiesList}
            </div>
          `;

          marker.bindPopup(popupContent, {
            maxWidth: 350,
            className: "custom-popup",
          });

          marker.on("popupopen", () => {
            setTimeout(() => {
              const items = document.querySelectorAll(
                ".property-popup-item"
              );
              items.forEach((item) => {
                item.addEventListener("click", () => {
                  const id = (item as HTMLElement).dataset.id;
                  const prop = group.properties.find(
                    (p) => p.id === id
                  );
                  if (prop && onViewProperty) {
                    map.closePopup();
                    onViewProperty(prop);
                  }
                });
              });
            }, 100);
          });
        });

        // Fit bounds if markers exist
        if (markers.length > 0) {
          const bounds = L.latLngBounds(
            markers.map((m) => [m.lat, m.lng] as [number, number])
          );
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
        }
      })
      .catch(() => {
        setLoading(false);
      });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [markers, onViewProperty]);

  return (
    <>
      <style>{`
        .custom-marker { background: none !important; border: none !important; }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-content { margin: 12px; }
        .leaflet-tooltip-custom {
          font-size: 11px;
          background: rgba(0,0,0,0.75);
          color: white;
          border: none;
          border-radius: 6px;
          padding: 4px 8px;
        }
        .leaflet-tooltip-custom::before { border-top-color: rgba(0,0,0,0.75) !important; }
        .property-popup-item:hover { background: #f9fafb; }
        .property-popup-item:last-child { border-bottom: none !important; }
      `}</style>
      <div ref={mapRef} className="w-full h-[500px] relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-[1000]">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">{"جاري تحميل الخريطة..."}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
