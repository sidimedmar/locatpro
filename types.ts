
export enum PropertyType {
  GROUND = 'منزل أرضي',
  STORY = 'طابق',
}

export enum ContractType {
  WITH_CONTRACT = 'بعقد',
  WITHOUT_CONTRACT = 'بدون عقد',
}

export enum PaymentSystem {
  PREPAID = 'مقدم',
  END_OF_MONTH = 'نهاية الشهر',
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
  sndeStatus: boolean; // Water
  somelecStatus: boolean; // Electricity
}

export interface LocationData {
  [wilaya: string]: string[];
}
