import { ContactField } from "@/types";

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
  phones: ContactField[];
  emails: ContactField[];
  addresses: ContactField[];
};
