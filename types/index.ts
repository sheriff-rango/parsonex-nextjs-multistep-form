export * from "./clients";
export * from "./reps";
export * from "./forms";

export interface ARRData {
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

export type ContactField = {
  type: string;
  value: string;
  isPrimary: boolean;
};

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
  clientIdPrimary: string | null;
  clientIdJoint: string | null;
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
  lastUpdated: string | null;
  createdOn: string | null;
  holdingFan: string | null;
  productNo: string | null;
  productFamily: string | null;
  holdPriceDate: string | null;
  branchNo: string | null;
  repNo: string | null;
};
