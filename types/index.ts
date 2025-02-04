export type ClientWithPhoneAndEmail = {
  clientId: string;
  fullName: string;
  riaClient: boolean;
  bdClient: boolean;
  repFullname: string | null;
  isActive: boolean;
  phoneNumber: string | null;
  emailAddress: string | null;
};

export type ClientFull = {
  clientId: string;
  createdon: string | null;
  lastupdated: string | null;
  isActive: boolean | null;
  nameSuffix: string | null;
  entityname: string | null;
  nameFull: string | null;
  nameSalutation: string | null;
  nameFirst: string | null;
  nameMiddle: string | null;
  nameLast: string | null;
  householdId: string | null;
  terminationDate: string | null;
  addressId: number | null;
  finprofileId: number | null;
  ofacId: number | null;
  dob: string | null;
  ssnTaxid: string | null;
  gender: string | null;
  maritalstatus: string | null;
  employmentStatus: string | null;
  employmentOccupation: string | null;
  employer: string | null;
  employerBusinessType: string | null;
  idNumber: string | null;
  idIssuer: string | null;
  idIssuedate: string | null;
  idExpires: string | null;
  idCitizenship: string | null;
  isUscitizen: boolean | null;
  idVerifiedby: string | null;
  idType: string | null;
  riaClient: boolean | null;
  bdClient: boolean | null;
  ofacResource: string | null;
  ofacResult: string | null;
  ofacBy: string | null;
  ofacDate: string | null;
  pcm: string | null;
  repFullname: string | null;
};

export type Rep = {
  repId: string;
  pcm: string | null;
  fullName: string | null;
  repType: string;
  isBranchMgr: boolean | null;
};

export type RepData = {
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  repType: string;
  isActive: boolean;
  isBranchMgr: boolean;
  dob: string | null;
  gender: string | null;
  phones: {
    type: string;
    value: string;
    isPrimary: boolean;
  }[];
  emails: {
    type: string;
    value: string;
    isPrimary: boolean;
  }[];
  addresses: {
    type: string;
    value: string;
    isPrimary: boolean;
  }[];
};

export type ContactField = {
  type: string;
  value: string;
  isPrimary: boolean;
};
