import { ContactField } from "@/types";

export type Rep = {
  pcm: string;
  fullName: string | null;
  repType: string;
  isBranchMgr: boolean | null;
};

export type RepData = {
  pcm: string;
  firstName: string;
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
