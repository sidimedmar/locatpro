// Real GPS coordinates for all Wilayas and Moughataas of Mauritania

export interface GeoPoint {
  lat: number;
  lng: number;
  name: string;
  nameAr: string;
}

export interface WilayaGeo {
  center: { lat: number; lng: number };
  nameAr: string;
  moughataas: Record<string, GeoPoint>;
}

export const WILAYA_COORDINATES: Record<string, WilayaGeo> = {
  "الحوض الشرقي": {
    center: { lat: 16.6, lng: -7.1 },
    nameAr: "الحوض الشرقي",
    moughataas: {
      "النعمة": { lat: 16.616, lng: -7.256, name: "Nema", nameAr: "النعمة" },
      "تمبدغة": { lat: 16.508, lng: -8.167, name: "Timbedra", nameAr: "تمبدغة" },
      "أمرج": { lat: 16.083, lng: -6.267, name: "Amourj", nameAr: "أمرج" },
      "باسكنو": { lat: 15.95, lng: -5.767, name: "Bassiknou", nameAr: "باسكنو" },
      "جكني": { lat: 16.267, lng: -5.85, name: "Djigueni", nameAr: "جكني" },
      "ولاتة": { lat: 17.3, lng: -7.033, name: "Oualata", nameAr: "ولاتة" },
    },
  },
  "الحوض الغربي": {
    center: { lat: 15.9, lng: -9.4 },
    nameAr: "الحوض الغربي",
    moughataas: {
      "لعيون": { lat: 15.35, lng: -9.833, name: "Aioun El Atrouss", nameAr: "لعيون" },
      "كوبني": { lat: 15.233, lng: -9.433, name: "Kobenni", nameAr: "كوبني" },
      "تامشكط": { lat: 17.233, lng: -10.667, name: "Tamchakett", nameAr: "تامشكط" },
      "الطينطان": { lat: 16.133, lng: -10.2, name: "Tintane", nameAr: "الطينطان" },
    },
  },
  "لعصابة": {
    center: { lat: 16.1, lng: -11.4 },
    nameAr: "لعصابة",
    moughataas: {
      "كيفه": { lat: 16.15, lng: -11.4, name: "Kiffa", nameAr: "كيفه" },
      "باركيول": { lat: 15.233, lng: -12.633, name: "Barkeol", nameAr: "باركيول" },
      "بومديد": { lat: 17.033, lng: -11.8, name: "Boumdeid", nameAr: "بومديد" },
      "كرو": { lat: 16.617, lng: -12.383, name: "Guerou", nameAr: "كرو" },
      "كنكوصة": { lat: 15.533, lng: -12.283, name: "Kankossa", nameAr: "كنكوصة" },
    },
  },
  "كوركول": {
    center: { lat: 16.1, lng: -13.1 },
    nameAr: "كوركول",
    moughataas: {
      "كيهيدي": { lat: 16.15, lng: -13.467, name: "Kaedi", nameAr: "كيهيدي" },
      "امبود": { lat: 16.733, lng: -12.733, name: "M'Bout", nameAr: "امبود" },
      "مقامة": { lat: 15.783, lng: -12.783, name: "Maghama", nameAr: "مقامة" },
      "مونكل": { lat: 16.517, lng: -13.217, name: "Monguel", nameAr: "مونكل" },
    },
  },
  "لبراكنة": {
    center: { lat: 17.2, lng: -14.5 },
    nameAr: "لبراكنة",
    moughataas: {
      "ألاك": { lat: 17.267, lng: -13.917, name: "Aleg", nameAr: "ألاك" },
      "بابابى": { lat: 16.467, lng: -14.467, name: "Bababé", nameAr: "بابابى" },
      "بوكى": { lat: 16.55, lng: -14.083, name: "Boghé", nameAr: "بوكى" },
      "امباي": { lat: 17.0, lng: -14.3, name: "M'Bagne", nameAr: "امباي" },
      "مقطع لحجار": { lat: 17.583, lng: -15.017, name: "Magta Lahjar", nameAr: "مقطع لحجار" },
    },
  },
  "الترارزة": {
    center: { lat: 17.7, lng: -15.6 },
    nameAr: "الترارزة",
    moughataas: {
      "روصو": { lat: 16.517, lng: -15.8, name: "Rosso", nameAr: "روصو" },
      "بوتلميت": { lat: 17.617, lng: -14.7, name: "Boutilimit", nameAr: "بوتلميت" },
      "كرمسين": { lat: 17.417, lng: -15.133, name: "Keur Macène", nameAr: "كرمسين" },
      "المذرذرة": { lat: 17.783, lng: -15.883, name: "Mederdra", nameAr: "المذرذرة" },
      "اركيز": { lat: 17.883, lng: -15.617, name: "R'Kiz", nameAr: "اركيز" },
      "واد الناقة": { lat: 17.733, lng: -15.45, name: "Ouad Naga", nameAr: "واد الناقة" },
    },
  },
  "آدرار": {
    center: { lat: 20.0, lng: -13.0 },
    nameAr: "آدرار",
    moughataas: {
      "أطار": { lat: 20.517, lng: -13.05, name: "Atar", nameAr: "أطار" },
      "أوجفت": { lat: 19.817, lng: -13.4, name: "Aoujeft", nameAr: "أوجفت" },
      "شنقيط": { lat: 20.467, lng: -12.35, name: "Chinguetti", nameAr: "شنقيط" },
      "وادان": { lat: 20.933, lng: -11.617, name: "Ouadane", nameAr: "وادان" },
    },
  },
  "داخلت نواذيبو": {
    center: { lat: 20.9, lng: -17.0 },
    nameAr: "داخلت نواذيبو",
    moughataas: {
      "نواذيبو": { lat: 20.933, lng: -17.033, name: "Nouadhibou", nameAr: "نواذيبو" },
      "الشامي": { lat: 19.833, lng: -16.05, name: "Chami", nameAr: "الشامي" },
    },
  },
  "تكانت": {
    center: { lat: 18.5, lng: -11.4 },
    nameAr: "تكانت",
    moughataas: {
      "تجكجة": { lat: 18.55, lng: -11.417, name: "Tidjikja", nameAr: "تجكجة" },
      "المجرية": { lat: 17.983, lng: -12.15, name: "Moudjeria", nameAr: "المجرية" },
      "تيشيت": { lat: 18.45, lng: -9.5, name: "Tichit", nameAr: "تيشيت" },
    },
  },
  "كيدي ماغا": {
    center: { lat: 15.2, lng: -12.2 },
    nameAr: "كيدي ماغا",
    moughataas: {
      "سيلبابي": { lat: 15.167, lng: -12.183, name: "Selibaby", nameAr: "سيلبابي" },
      "ولد ينجه": { lat: 15.3, lng: -12.667, name: "Ould Yenge", nameAr: "ولد ينجه" },
      "غابو": { lat: 14.3, lng: -12.6, name: "Ghabou", nameAr: "غابو" },
    },
  },
  "تيرس زمور": {
    center: { lat: 22.7, lng: -12.3 },
    nameAr: "تيرس زمور",
    moughataas: {
      "ازويرات": { lat: 22.733, lng: -12.483, name: "Zouerate", nameAr: "ازويرات" },
      "افديرك": { lat: 22.667, lng: -12.733, name: "F'Derick", nameAr: "افديرك" },
      "بير أم كرين": { lat: 25.233, lng: -11.567, name: "Bir Moghrein", nameAr: "بير أم كرين" },
    },
  },
  "إينشيري": {
    center: { lat: 19.8, lng: -14.4 },
    nameAr: "إينشيري",
    moughataas: {
      "أكجوجت": { lat: 19.767, lng: -14.383, name: "Akjoujt", nameAr: "أكجوجت" },
      "بنشاب": { lat: 19.567, lng: -14.567, name: "Bénichab", nameAr: "بنشاب" },
    },
  },
  "نواكشوط الغربية": {
    center: { lat: 18.1, lng: -15.97 },
    nameAr: "نواكشوط الغربية",
    moughataas: {
      "تفرغ زينة": { lat: 18.12, lng: -15.98, name: "Tevragh Zeina", nameAr: "تفرغ زينة" },
      "لكصر": { lat: 18.08, lng: -15.97, name: "Ksar", nameAr: "لكصر" },
      "السبخة": { lat: 18.06, lng: -15.95, name: "Sebkha", nameAr: "السبخة" },
    },
  },
  "نواكشوط الشمالية": {
    center: { lat: 18.15, lng: -15.93 },
    nameAr: "نواكشوط الشمالية",
    moughataas: {
      "تيارت": { lat: 18.17, lng: -15.92, name: "Teyarett", nameAr: "تيارت" },
      "دار النعيم": { lat: 18.14, lng: -15.95, name: "Dar Naim", nameAr: "دار النعيم" },
      "توجونين": { lat: 18.16, lng: -15.9, name: "Toujounine", nameAr: "توجونين" },
    },
  },
  "نواكشوط الجنوبية": {
    center: { lat: 18.03, lng: -15.95 },
    nameAr: "نواكشوط الجنوبية",
    moughataas: {
      "عرفات": { lat: 18.03, lng: -15.93, name: "Arafat", nameAr: "عرفات" },
      "الميناء": { lat: 18.05, lng: -15.96, name: "El Mina", nameAr: "الميناء" },
      "الرياض": { lat: 18.02, lng: -15.97, name: "Riyad", nameAr: "الرياض" },
    },
  },
};

// Get coordinates for a property based on its wilaya and moughataa
export function getPropertyCoordinates(
  wilaya: string,
  moughataa: string
): { lat: number; lng: number } | null {
  const wilayaGeo = WILAYA_COORDINATES[wilaya];
  if (!wilayaGeo) return null;

  const moughataaGeo = wilayaGeo.moughataas[moughataa];
  if (moughataaGeo) {
    // Add small random offset so markers don't stack exactly
    return {
      lat: moughataaGeo.lat + (Math.random() - 0.5) * 0.01,
      lng: moughataaGeo.lng + (Math.random() - 0.5) * 0.01,
    };
  }

  // Fallback to wilaya center
  return wilayaGeo.center;
}

// Get color for a wilaya (deterministic based on name)
export function getWilayaColor(wilaya: string): string {
  const colors = [
    "#065f46", "#0d9488", "#0ea5e9", "#6366f1",
    "#d97706", "#dc2626", "#16a34a", "#9333ea",
    "#e11d48", "#0891b2", "#ca8a04", "#be185d",
    "#7c3aed", "#059669", "#2563eb",
  ];
  let hash = 0;
  for (let i = 0; i < wilaya.length; i++) {
    hash = wilaya.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
