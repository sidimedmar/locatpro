export enum PropertyType {
  GROUND = "منزل أرضي",
  STORY = "طابق",
}

export enum ContractType {
  WITH_CONTRACT = "بعقد",
  WITHOUT_CONTRACT = "بدون عقد",
}

export enum PaymentSystem {
  PREPAID = "مقدم",
  END_OF_MONTH = "نهاية الشهر",
}

export interface Property {
  id: string;
  wilaya: string;
  moughataa: string;
  neighborhood: string;
  houseNumber: string;
  roomsCount: number;
  type: PropertyType;
  accessories: string;
  ownerName: string;
  ownerPhone: string;
  ownerId: string;
  tenantName: string;
  tenantPhone: string;
  tenantId: string;
  contractDate: string;
  contractType: ContractType;
  monthlyRent: number;
  paymentSystem: PaymentSystem;
  arrears: number;
  sndeStatus: boolean;
  somelecStatus: boolean;
  notes?: string;
  status?: string;
}

export interface Payment {
  id: string;
  propertyId: string;
  amount: number;
  paymentDate: string;
  monthCovered: string;
  method: string;
  notes: string;
  createdAt?: string;
  tenantName?: string;
  moughataa?: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  estimatedCost: number;
  actualCost: number;
  createdAt?: string;
  resolvedAt?: string | null;
  tenantName?: string;
  moughataa?: string;
}

export interface ActivityLog {
  id: string;
  propertyId: string | null;
  actionType: string;
  description: string;
  createdAt?: string;
}

export interface LocationData {
  [wilaya: string]: string[];
}
