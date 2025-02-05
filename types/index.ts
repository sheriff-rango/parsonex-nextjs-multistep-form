export * from "./clients";
export * from "./reps";

export interface ARRData {
  pcm: string;
  rep_name: string;
  quarterly_production: number;
  annual_recurring_revenue: number;
}

export interface YearlyProductionData {
  year: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  total: number;
}

export interface ContactField {
  type: string;
  value: string;
  isPrimary: boolean;
}

export type Account = {
  accountId: string;
  searchid: string | null;
  estDate: string | null;
  tin: string | null;
  lastupdated: string | null;
  accountType: string | null;
  date17A3: string | null;
  method17A3: string | null;
  emailAuth: boolean | null;
  ownerId: string | null;
  owner2Id: string | null;
  status: string | null;
  termDate: string | null;
  invObjective: string | null;
  riskTolerance: string | null;
  timeHorizon: string | null;
  pcm: string | null;
  branch: string | null;
  registration1: string | null;
  registration2: string | null;
  registration3: string | null;
  clientResState: string | null;
  accountEmail: string | null;
};

export type Holding = {
  holdingId: string;
  accountId: string;
  holdingType: string;
  securityName: string | null;
  securityTicker: string | null;
  cusip: string | null;
  units: number | null;
  unitPrice: number | null;
  marketValue: number | null;
  costBasis: number | null;
  productFamily: string | null;
  repNo: string | null;
  holdingFan: string | null;
};
